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
 * Pages exactly as normal, then adds the two required headers
 * before sending the response back to the browser.
 *
 * IMPORTANT: this only touches the specific page(s) listed in
 * TARGET_PATHS below. Every other page on the site passes through
 * completely untouched — same as if this Worker didn't exist.
 * ─────────────────────────────────────────────────────────────────
 */

// Add the path(s) of any page that uses the Wwise web build here.
// Paths must start with a leading slash and match exactly what's
// in the URL bar (e.g. "/town-trail.html", not "/town-trail").
const TARGET_PATHS = [
  '/town-trail.html',
  // Add more as Wwise rolls out to other trails, e.g.:
  // '/plunkett-trail.html',
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Fetch the real page from GitHub Pages, completely unchanged.
    const response = await fetch(request);

    // Only modify headers for the specific page(s) that need
    // cross-origin isolation. Everything else passes straight through.
    if (TARGET_PATHS.includes(url.pathname)) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // Every other path: return the original response as-is.
    return response;
  },
};
