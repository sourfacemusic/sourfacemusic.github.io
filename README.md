# SOURFACEMUSIC Main Brain

This repository is the single source of truth for the public SOURFACEMUSIC website, official links, fundraiser gateway, contact details, social-media copy, artwork and automatic publishing.

## Public pages

- Main website: `index.html`
- Social / link-in-bio page: `links.html`
- Official fundraiser gateway: `support.html`
- Privacy policy: `privacy.html`
- Branded missing-page screen: `404.html`

## Change public information once

Edit **`site-config.js`** whenever the phone number, email address, website address, fundraiser link or social handle changes. The website pages read those details from that central file.

Social profile copy is stored in **`SOCIAL_MEDIA.md`**.

## Artwork

- Website / cover banner: `assets/sfm-cosmic-banner.svg`
- Square profile artwork: `assets/sfm-cosmic-square.svg`
- Vertical story artwork: `assets/sfm-cosmic-story.svg`

## Permanent publishing workflow

`.github/workflows/pages.yml` performs all of the following:

1. Runs whenever `main` changes.
2. Runs manually from GitHub Actions.
3. Re-runs every six hours as a self-refresh.
4. Verifies required files and internal links.
5. Publishes the complete repository to GitHub Pages.
6. Checks the live homepage, fundraiser page, official-links page and configuration file after deployment.

## One-time GitHub Pages activation

GitHub keeps the publishing-source control in private repository settings. Open:

https://github.com/sourfacemusic/sourfacemusic.github.io/settings/pages

Under **Build and deployment**, set **Source** to **GitHub Actions**. After that one selection, GitHub Desktop pushes and repository edits publish automatically.

Tracking issue: https://github.com/sourfacemusic/sourfacemusic.github.io/issues/1

## GitHub Desktop workflow

1. Open repository `sourfacemusic.github.io`.
2. Keep branch `main` selected.
3. Make or receive changes.
4. Commit to `main`.
5. Push origin.

The publish-and-verify workflow handles the rest. Do not store passwords, API keys, recovery codes, tax documents or private identification files in this repository.
