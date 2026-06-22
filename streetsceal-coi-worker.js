/**
 * StreetScéal — Cross-Origin Isolation Worker
 * ─────────────────────────────────────────────────────────────────
 * Purpose: GitHub Pages doesn't let you set custom HTTP response
 * headers. Wwise's web build needs SharedArrayBuffer, which only
 * works if the page is "cross-origin isolated" — meaning the
 * response carries both COOP and COEP headers.
 *
 * This Worker sits in front of streetsceal.ie (since Cloudflare
 * already manages its DNS), fetches the real page from GitHub
 * Pages, then adds the two required headers before sending the
 * response back to the browser.
 *
 * IMPORTANT FIX: the original version called fetch(request) with
 * the request object completely unchanged. Because the Worker is
 * attached to the same domain as the request, Cloudflare could
 * resolve that fetch() back to its own edge cache for the same
 * URL — a cached copy from BEFORE this Worker ever added headers
 * to it — rather than reaching all the way through to GitHub
 * Pages fresh. That's why headers never appeared even though the
 * Worker itself ran without errors.
 *
 * Fix: explicitly set cache: 'no-store' on the fetch() call, which
 * forces a genuinely fresh request to the real origin every time,
 * bypassing any cached edge copy.
 *
 * IMPORTANT: this only touches the specific page(s) listed in
 * TARGET_PATHS below. Every other page on the site passes through
 * completely untouched — same as if this Worker didn't exist.
 * ─────────────────────────────────────────────────────────────────
 */

const TARGET_PATHS = [
  '/town-trail.html',
  // '/plunkett-trail.html',
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (TARGET_PATHS.includes(url.pathname)) {
      // Force a genuinely fresh fetch, bypassing any cached edge
      // copy that might not have the headers applied yet.
      const freshRequest = new Request(request, { cache: 'no-store' });
      const response = await fetch(freshRequest);

      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // Every other path: fetch and return completely unchanged.
    return fetch(request);
  },
};
