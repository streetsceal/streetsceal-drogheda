/**
 * StreetScéal — Cross-Origin Isolation + Multi-Town Routing Worker
 * ─────────────────────────────────────────────────────────────────
 * This Worker does two jobs:
 *
 * 1. HOST-BASED ROUTING (new)
 *    GitHub Pages only recognises ONE custom domain per repo — the
 *    one listed in the repo's /CNAME file, which is "streetsceal.ie".
 *    If a request arrives at GitHub's edge claiming to be Host:
 *    drogheda.streetsceal.ie, GitHub doesn't know that hostname and
 *    will refuse it, even though Cloudflare DNS points it correctly
 *    at streetsceal.github.io.
 *
 *    So instead of passing the request straight through, this Worker
 *    rewrites it: it fetches from the origin AS "streetsceal.ie"
 *    (the hostname GitHub actually accepts), with the path prefixed
 *    by the matching town folder (e.g. /drogheda/...). The visitor's
 *    browser never sees this — it only ever sees the original
 *    drogheda.streetsceal.ie URL and the response that comes back.
 *
 *    Adding a new town later (e.g. Athlone) is just one more entry
 *    in TOWN_HOSTS below, plus its own /athlone/ folder in the repo
 *    and its own DNS record — no other changes needed.
 *
 * 2. CROSS-ORIGIN ISOLATION HEADERS (existing)
 *    GitHub Pages doesn't let you set custom HTTP response headers.
 *    Wwise's web build needs SharedArrayBuffer, which only works if
 *    the page is "cross-origin isolated" — meaning the response
 *    carries both COOP and COEP headers. This Worker adds those two
 *    headers on the specific page(s) listed in COI_PATHS below.
 *
 *    IMPORTANT FIX (kept from the original version): calling
 *    fetch(request) with the request object unchanged let Cloudflare
 *    resolve it back to its own edge cache — a copy from BEFORE this
 *    Worker ever added headers — rather than reaching origin fresh.
 *    Fix: cache: 'no-store' forces a genuinely fresh request every
 *    time, bypassing any cached edge copy. This still applies with
 *    host-based routing in play, so it's kept below.
 * ─────────────────────────────────────────────────────────────────
 */

// Hostname GitHub Pages actually recognises (from the repo's /CNAME file).
// All origin fetches go out as this host, regardless of which subdomain
// the visitor actually requested.
const ORIGIN_HOST = 'streetsceal.ie';

// Map each live town subdomain to its folder in the repo, and to the
// page that should load when someone visits the bare subdomain with
// no path (e.g. https://drogheda.streetsceal.ie/ with nothing else).
const TOWN_HOSTS = {
  'drogheda.streetsceal.ie': { folder: '/drogheda', rootPage: '/drogheda/map.html' },
  // 'athlone.streetsceal.ie': { folder: '/athlone', rootPage: '/athlone/map.html' },
};

// Paths (as they exist in the repo, i.e. AFTER the /drogheda prefix is
// applied) that need the COOP/COEP cross-origin-isolation headers.
const COI_PATHS = [
  '/drogheda/town-trail.html',
  // '/drogheda/plunkett-trail.html',
];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const town = TOWN_HOSTS[url.hostname];

    // Work out which path to actually request from the origin.
    let originPath = url.pathname;
    if (town) {
      originPath = url.pathname === '/' ? town.rootPage : town.folder + url.pathname;
    }

    // Build the real origin request: same URL, but hostname forced to
    // whatever GitHub Pages' CNAME file recognises, and path rewritten
    // if this request came in on a town subdomain.
    const originURL = new URL(request.url);
    originURL.hostname = ORIGIN_HOST;
    originURL.pathname = originPath;

    // Force a genuinely fresh fetch, bypassing any cached edge copy
    // (see comment block above — this bit fixed a real bug once).
    const originRequest = new Request(originURL.toString(), request);
    const freshRequest = new Request(originRequest, { cache: 'no-store' });
    const response = await fetch(freshRequest);

    if (COI_PATHS.includes(originPath)) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // Every other path: pass the (possibly rewritten) response back
    // completely unchanged.
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
