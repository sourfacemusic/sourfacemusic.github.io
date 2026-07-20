# SOURFACEMUSIC Website Project Handoff

**Repository:** `sourfacemusic/sourfacemusic.github.io`  
**Owner:** David Hill / SOURFACEMUSIC  
**Primary branch:** `main`  
**Updated:** July 20, 2026

## Purpose

This repository is the single source of truth for the SOURFACEMUSIC public website, official links, fundraiser gateway, social-media copy, contact details, artwork and publishing automation.

## Current status

The website has been consolidated and rebuilt in GitHub. The repository contains a permanent publish-and-verify workflow. The public URL will continue returning a platform-level 404 until the repository's private Pages setting is changed once to **GitHub Actions**.

## One-time activation

1. Open `https://github.com/sourfacemusic/sourfacemusic.github.io/settings/pages`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open `https://github.com/sourfacemusic/sourfacemusic.github.io/actions/workflows/pages.yml`.
4. Select **Run workflow**, keep `main`, and run it.

After this one-time selection, no recurring manual publish step is required.

## Automatic workflow

`.github/workflows/pages.yml` now:

- publishes on every push to `main`
- can be run manually
- republishes every six hours
- validates required pages and artwork
- checks internal links
- verifies the live homepage, fundraiser page, official-links page and configuration file after deployment

GitHub Desktop only needs to commit and push to `main`.

## Central configuration

Edit `site-config.js` to change:

- public email
- phone number
- location
- official website address
- fundraiser address
- social handles
- artwork paths
- primary short bio

Do not duplicate those values across new files when the configuration can provide them.

## Public pages

- `index.html` — main website
- `links.html` — social-media link-in-bio page
- `support.html` — official GoFundMe gateway and sharing page
- `privacy.html` — privacy policy
- `404.html` — branded internal missing-page screen

## Artwork

- `assets/sfm-cosmic-banner.svg` — website and social cover
- `assets/sfm-cosmic-square.svg` — profile and square artwork
- `assets/sfm-cosmic-story.svg` — vertical story artwork

## Social-media master copy

`SOCIAL_MEDIA.md` contains the short bio, extra-short bio, link-in-bio URL, fundraiser URL, contact details, profile artwork paths and pinned-post copy.

The recommended single bio link is:

`https://sourfacemusic.github.io/links.html`

## Current contact data

- Email: `sourfacemusic@gmail.com`
- Phone: `(646) 286-7210`
- Location: `New York, NY`

The booking form submits through FormSubmit to `sourfacemusic@gmail.com`, with a mailto fallback.

## Fundraiser

The official fundraiser gateway is `support.html`. GoFundMe handles donations and receipts. The website does not store payment-card details.

## Advertising

- AdSense client ID: `ca-pub-5559716494726644`
- `ads.txt`: `google.com, pub-5559716494726644, DIRECT, f08c47fec0942fa0`

Do not add the AdSense loader more than once on a page.

## Security boundaries

Never commit or upload:

- passwords or personal access tokens
- recovery codes
- Gmail, Google, GoFundMe or AdSense credentials
- bank, tax or identity documents
- Social Security or government-service records
- password-manager exports

GitHub is the public website control center, not a vault for private account records.

## Final verification after activation

- `/` returns HTTP 200
- `/links.html` opens
- `/support.html` opens
- `/privacy.html` opens
- `/ads.txt` contains the expected publisher line
- artwork loads on desktop and mobile
- booking form sends or opens the email fallback
- GitHub Actions publish-and-verify workflow is green

Tracking issue: `https://github.com/sourfacemusic/sourfacemusic.github.io/issues/1`
