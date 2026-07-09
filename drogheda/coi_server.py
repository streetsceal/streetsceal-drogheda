#!/usr/bin/env python3
"""
Local dev server for StreetScéal — adds the two headers Wwise's
AudioWorklet needs for SharedArrayBuffer (Cross-Origin-Opener-Policy
and Cross-Origin-Embedder-Policy). Plain `python -m http.server`
does NOT send these, which is why SharedArrayBuffer was undefined.

Usage (from the drogheda/ folder):
    python coi_server.py

Then open http://localhost:8000/town-trail.html
"""
import http.server
import socketserver

PORT = 8000

class COIRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), COIRequestHandler) as httpd:
        print(f"Serving with COOP/COEP headers at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()
