# SOURFACEMUSIC Main Brain

This repository is the single source of truth for the public SOURFACEMUSIC website, official links, fundraiser gateway, contact details, social-media copy, artwork and automatic publishing.

## Public pages

- Main website: `index.html`
- Social / link-in-bio page: `links.html`
- Official fundraiser gateway: `support.html`
- Privacy policy: `privacy.html`
- Branded missing-page screen: `404.html`

## Change public information once

Edit **`site-config.js`** whenever contact details, official links, social handles, fundraiser settings, or Stripe/Bluevine payment links change. The website pages read those details from that central file.

### Fundraiser note

The public support flow for this site includes GoFundMe plus optional Stripe/Bluevine payment links.

Never publish dashboard URLs (for example, `dashboard.stripe.com` or `app.bluevine.com/dashboard`) on public pages.

Use the setup script if editing `site-config.js` is difficult:

`.\set-payment-links.ps1`

Or set both links in one command:

`.\set-payment-links.ps1 -StripeUrl "https://buy.stripe.com/your-link" -BluevineUrl "https://your-public-bluevine-link"`

Do not use placeholder values such as `REAL_LINK` or `your-actual-link`; the script now blocks those.

To update and publish in one command:

`.\set-payment-links-and-publish.ps1 -StripeUrl "https://buy.stripe.com/your-real-link" -BluevineUrl "https://your-real-bluevine-public-link"`

Or run without parameters and it will prompt you for both links:

`.\set-payment-links-and-publish.ps1`

## One-command full link audit

Run this to check all site links end-to-end (internal pages, assets, external URLs, and payment links):

`.\check-site-links.ps1`

If PowerShell blocks scripts, use:

`powershell -ExecutionPolicy Bypass -File ".\check-site-links.ps1"`

Or use the launcher (no execution-policy friction):

`.\check-site-links.cmd`

From any folder, this always works:

`& "C:\Users\sourf\.copilot\repos\copilot-worktrees\sourfacemusic.github.io\sourfacemusic-musical-chainsaw\check-site-links.cmd"`

Use `-ShowAll` for full per-link output.

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

## GitHub Desktop workflow

1. Open repository `sourfacemusic.github.io`.
2. Keep branch `main` selected.
3. Make or receive changes.
4. Commit to `main`.
5. Push origin.

The publish-and-verify workflow handles the rest. Do not store passwords, API keys, recovery codes, tax documents or private identification files in this repository.
