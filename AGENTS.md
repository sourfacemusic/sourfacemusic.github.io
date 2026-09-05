# Base44 Dev Environment

## Project type
Pure static website (SOURFACEMUSIC). HTML, CSS, vanilla JS — no build step, no backend, no database, no external credentials.

## Running
`docker compose -f docker-compose.base44.yml up -d` serves the repo root via nginx:alpine on host port 3000.

## Editing
Edit HTML/CSS/JS files directly; changes appear on reload (no live-reload dev server — call `reload_preview` after edits, or just refresh the browser).

## Key files
- `index.html` — main page
- `links.html` — link-in-bio page
- `support.html` — fundraiser gateway
- `privacy.html` — privacy policy
- `404.html` — branded 404
- `site-config.js` — central config (phone, email, socials, URLs)
- `script.js` — page behavior driven by site-config.js
- `styles.css` / `playlist.css` — styling
- `assets/` — SVG artwork

## Brand rules (always follow)
- **Always write "SOURFACEMUSIC" as one word.** Never split it, abbreviate it mid-sentence, or let it wrap/break across lines. The brand name stays together everywhere: headers, headings, body copy, meta tags, JSON-LD, social text. CSS already has `.brand strong{white-space:nowrap}` — preserve it.
- The full byline is: SOURFACEMUSIC — David "SOUR FACE" Hill · DJ · Producer · Engineer · Educator.

## Verification
`curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the homepage.
