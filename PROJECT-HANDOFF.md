# SourFaceMusic Website Project Handoff

**Repository:** `sourfacemusic/sourfacemusic.github.io`  
**Owner:** David Hill / SOURFACEMUSIC  
**Primary branch:** `main`  
**Handoff updated:** July 14, 2026

## Purpose

This repository contains the SourFaceMusic static website and its GitHub Pages deployment setup. This file is the single handoff document for anyone continuing the work. Start here instead of searching old chats, issues, or commits.

## Current status

The website files are present and the GitHub Pages deployment workflow has been added. The public GitHub Pages site was still returning a 404 during the last check because the repository-level Pages source had not yet been set to **GitHub Actions**.

## Completed work

- Built and expanded the static SourFaceMusic website.
- Added homepage content, services, Rooms, portfolio, testimonials, FAQ, booking form, social links, music-player code, privacy page, and custom 404 page.
- Added the SFM logo artwork and homepage logo styling.
- Added Google AdSense code to the site using publisher ID `ca-pub-5559716494726644`.
- Added root `ads.txt` with:
  `google.com, pub-5559716494726644, DIRECT, f08c47fec0942fa0`
- Added a Cookiebot CMP integration scaffold in `script.js`.
- Cookiebot automatic blocking is configured with `data-blockingmode="auto"`.
- Cookiebot remains inactive until a valid Cookiebot Domain Group ID is supplied. Do not invent or expose that ID.
- Added `.nojekyll` for direct static-file publishing.
- Added `.github/workflows/pages.yml` to deploy the repository through GitHub Actions.
- Created GitHub issue #1, **Finish GitHub Pages activation**, with direct setup links and Android instructions.

## One required activation step

GitHub Pages must be enabled at the private repository-settings level. A website file, including `404.html`, cannot change this setting.

1. Open:
   `https://github.com/sourfacemusic/sourfacemusic.github.io/settings/pages`
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open:
   `https://github.com/sourfacemusic/sourfacemusic.github.io/actions/workflows/pages.yml`
4. Select **Run workflow**.
5. Keep branch `main` selected and run it.
6. Confirm the deployment finishes successfully.
7. Verify:
   `https://sourfacemusic.github.io/`
8. Verify:
   `https://sourfacemusic.github.io/ads.txt`

On Android, use Chrome and enable **Desktop site** if GitHub hides the Pages controls.

## Important files

- `index.html` — main website.
- `privacy.html` — privacy policy.
- `404.html` — custom not-found page.
- `styles.css` — primary site styling.
- `script.js` — site behavior, player, booking form, analytics hooks, and Cookiebot scaffold.
- `playlist.css` — music-player styling.
- `ads.txt` — AdSense publisher authorization.
- `.nojekyll` — tells GitHub Pages to serve the static files directly.
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment workflow.
- GitHub issue #1 — activation instructions and tracking.

## AdSense status

The repository currently uses:

- Website client ID: `ca-pub-5559716494726644`
- `ads.txt` publisher ID: `pub-5559716494726644`

The owner reported that **Auto ads** was enabled in the private AdSense dashboard. That private switch cannot be verified from GitHub alone. Once the website is live, confirm that the source contains the AdSense loader and allow Google time to begin serving ads.

Do not add the AdSense loader more than once per page.

## Cookiebot status

The Cookiebot code is installed as a safe inactive scaffold in `script.js`.

- Automatic prior-consent blocking is already selected.
- A valid Domain Group ID is still required before Cookiebot can load.
- Do not place Cookiebot credentials in issues, screenshots, chat logs, or public documentation.
- Do not disable automatic blocking unless the owner explicitly requests it.

## Booking form

The booking form currently submits through FormSubmit to:

`booking@sourfacemusic.com`

Confirm that this mailbox exists and that FormSubmit activation has been completed. If not, update the destination only after the owner confirms the correct address.

## Security boundaries

Never commit or upload any of the following:

- GitHub passwords or personal access tokens.
- Gmail or Google passwords.
- AdSense passwords, tax information, bank information, or identity documents.
- ID.me credentials, recovery codes, government records, tax records, unemployment records, military records, or Social Security information.
- Cookiebot private account credentials.
- Password-manager exports or recovery-code files.

ID.me must remain separate from GitHub. GitHub is for the public website and code, not government identity records.

## Recommended verification checklist

After Pages is activated:

- Homepage returns HTTP 200 instead of 404.
- CSS, logo, audio, and JavaScript load correctly.
- Privacy page opens.
- Custom 404 page works for a false path.
- `ads.txt` shows the expected Google line.
- Page source contains the correct AdSense client ID.
- Booking form submits successfully.
- No console errors prevent the site from loading.
- Cookiebot remains inactive until its real Domain Group ID is configured.

## Work style requested by the owner

When technical work must be performed locally, provide one complete copy-and-paste script whenever possible, preferably PowerShell for Windows Terminal. Avoid long chains of separate commands and repeated instructions.

## Where the next person should begin

1. Read this file completely.
2. Open GitHub issue #1.
3. Enable GitHub Pages with **GitHub Actions**.
4. Run the deployment workflow.
5. Verify the live site and `ads.txt`.
6. Continue with Cookiebot only after obtaining the real Domain Group ID securely.

Do not rebuild the website from scratch unless the existing repository is proven unusable. Most of the work is already present; the immediate blocker is Pages activation.
