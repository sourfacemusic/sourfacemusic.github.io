# Base44 Dev Environment

## Project type
Pure static website (HTML/CSS/JS) — the SOURFACEMUSIC public site, originally a GitHub Pages project. No backend, no database, no build step, no package manager.

## Running
`docker compose -f docker-compose.base44.yml up -d` serves the repo root via `nginx:alpine` on host port 3000. Files are bind-mounted read-only, so edits appear immediately on browser refresh (no live-reload server; call `reload_preview` after edits if needed).

## Key files
- `index.html` — homepage
- `site-config.js` — central config (contact info, socials, fundraiser URL) read by all pages
- `styles.css`, `script.js`, `playlist.css` — styling and behavior
- `links.html`, `support.html`, `privacy.html`, `404.html`, `gofundme.html` — other pages
- `assets/` — SVG artwork

## Secrets
None required. The site is fully self-contained static content.
