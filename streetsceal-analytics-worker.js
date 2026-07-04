/**
 * StreetScéal — Analytics Worker
 * ─────────────────────────────────────────────────────────────────────
 * Handles two routes:
 *
 *   POST /analytics/event
 *     Body: { type, trail, stop? }
 *     type: 'page' | 'stop' | 'audio' | 'ar'
 *     Increments a daily counter in KV for this event.
 *     Returns 200 on success, silently fails gracefully.
 *
 *   GET /analytics/report?from=YYYY-MM-DD&to=YYYY-MM-DD
 *     Returns JSON summary of all counters in date range.
 *     Protected by a shared secret in the Authorization header.
 *
 * KV key format:
 *   analytics:YYYY-MM-DD:page:trail-id
 *   analytics:YYYY-MM-DD:stop:trail-id:stop-id
 *   analytics:YYYY-MM-DD:audio:trail-id:stop-id
 *   analytics:YYYY-MM-DD:ar:trail-id:stop-id
 *
 * KV namespace binding: ANALYTICS_KV (bind this in Cloudflare dashboard)
 * Secret binding: REPORT_SECRET (set as environment variable in dashboard)
 * ─────────────────────────────────────────────────────────────────────
 *
 * CORS — kept dynamic rather than a fixed origin string.
 * This endpoint is always posted to at the fixed apex URL
 * (https://streetsceal.ie/analytics/event), but the PAGE making that
 * request now lives on different origins: streetsceal.ie itself, and
 * every town subdomain (drogheda.streetsceal.ie, and whichever towns
 * come after it). Browsers do an exact string match on
 * Access-Control-Allow-Origin, so a single hardcoded value only ever
 * works for one of those origins at a time — this checks the
 * incoming Origin header against an allowlist pattern and reflects
 * back the matching one, so any current or future *.streetsceal.ie
 * subdomain works without editing this file again.
 */

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return origin === 'https://streetsceal.ie' || /^https:\/\/[a-z0-9-]+\.streetsceal\.ie$/.test(origin);
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowOrigin = isAllowedOrigin(origin) ? origin : 'https://streetsceal.ie';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CORS_HEADERS = corsHeaders(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ── POST /analytics/event ────────────────────────────────────────
    if (request.method === 'POST' && url.pathname === '/analytics/event') {
      try {
        const body = await request.json();
        const { type, trail, stop } = body;

        // Validate inputs
        const validTypes = ['page', 'stop', 'audio', 'ar'];
        if (!validTypes.includes(type) || !trail) {
          return new Response('Bad request', { status: 400, headers: CORS_HEADERS });
        }

        // Build the KV key for today's counter
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const key = stop
          ? `analytics:${today}:${type}:${trail}:${stop}`
          : `analytics:${today}:${type}:${trail}`;

        // Read current count, increment, write back
        const current = await env.ANALYTICS_KV.get(key);
        const count = (parseInt(current) || 0) + 1;
        await env.ANALYTICS_KV.put(key, String(count), {
          // Keep data for 2 years — more than enough for funder reporting
          expirationTtl: 60 * 60 * 24 * 730
        });

        return new Response('ok', { status: 200, headers: CORS_HEADERS });

      } catch (e) {
        // Silently swallow errors — analytics should never break the site
        return new Response('error', { status: 500, headers: CORS_HEADERS });
      }
    }

    // ── GET /analytics/report ────────────────────────────────────────
    if (request.method === 'GET' && url.pathname === '/analytics/report') {

      // Check the report secret
      const auth = request.headers.get('Authorization') || '';
      if (auth !== `Bearer ${env.REPORT_SECRET}`) {
        return new Response('Unauthorized', {
          status: 401,
          headers: { ...CORS_HEADERS, 'WWW-Authenticate': 'Bearer' }
        });
      }

      // Date range from query params, default to current month
      const now = new Date();
      const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const defaultTo = now.toISOString().slice(0, 10);
      const from = url.searchParams.get('from') || defaultFrom;
      const to = url.searchParams.get('to') || defaultTo;

      try {
        // List all keys — KV list() with prefix returns up to 1000 keys per call
        // For a heritage walking trail, total keys will be very small (<<1000)
        const listed = await env.ANALYTICS_KV.list({ prefix: 'analytics:' });

        // Filter to keys within the date range and parse into a structured object
        const result = {
          from,
          to,
          totals: { page: 0, stop: 0, audio: 0, ar: 0 },
          byTrail: {},
          byDay: {},
          byStop: {}
        };

        for (const item of listed.keys) {
          // Key format: analytics:YYYY-MM-DD:type:trail[:stop]
          const parts = item.name.split(':');
          if (parts.length < 4) continue;
          const [, date, type, trail, stop] = parts;

          // Filter by date range
          if (date < from || date > to) continue;

          const value = parseInt(await env.ANALYTICS_KV.get(item.name)) || 0;

          // Total by event type
          if (result.totals[type] !== undefined) result.totals[type] += value;

          // By trail
          if (!result.byTrail[trail]) result.byTrail[trail] = { page: 0, stop: 0, audio: 0, ar: 0 };
          if (result.byTrail[trail][type] !== undefined) result.byTrail[trail][type] += value;

          // By day (for charts)
          if (!result.byDay[date]) result.byDay[date] = { page: 0, stop: 0, audio: 0, ar: 0 };
          if (result.byDay[date][type] !== undefined) result.byDay[date][type] += value;

          // By stop (only for stop/audio/ar events)
          if (stop && ['stop', 'audio', 'ar'].includes(type)) {
            const stopKey = `${trail}:${stop}`;
            if (!result.byStop[stopKey]) result.byStop[stopKey] = { stop: 0, audio: 0, ar: 0 };
            if (result.byStop[stopKey][type] !== undefined) result.byStop[stopKey][type] += value;
          }
        }

        return new Response(JSON.stringify(result, null, 2), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
