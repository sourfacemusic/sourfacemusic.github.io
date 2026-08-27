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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SOURFACEMUSIC – David “SOUR FACE” Hill</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --bg: #050509;
      --fg: #f5f5f5;
      --accent: #ff4b8b;
      --accent-soft: #ffb3da;
      --border: #333;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--fg);
    }
    header {
      padding: 50px 20px;
      text-align: center;
      background: radial-gradient(circle at top, var(--accent), var(--bg));
    }
    h1 {
      margin: 0;
      font-size: 2.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    h2 {
      margin: 10px 0 0;
      font-weight: 400;
      color: var(--accent-soft);
    }
    nav {
      margin-top: 25px;
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    nav a {
      color: var(--fg);
      text-decoration: none;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    nav a:hover {
      border-color: var(--accent);
      color: var(--accent-soft);
    }
    main {
      max-width: 960px;
      margin: 40px auto;
      padding: 0 20px 60px;
    }
    section {
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 1px solid #15151b;
    }
    section:last-of-type {
      border-bottom: none;
    }
    h3 {
      margin-top: 0;
      font-size: 1.4rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    p {
      line-height: 1.6;
      margin: 10px 0;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 6px 0;
    }
    a {
      color: var(--accent);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    footer {
      text-align: center;
      padding: 20px;
      font-size: 0.8rem;
      color: #888;
      border-top: 1px solid #15151b;
    }
  </style>
</head>

<body>
  <header>
    <h1>SOURFACEMUSIC</h1>
    <h2>David “SOUR FACE” Hill · DJ · Producer · Engineer · Educator</h2>
    <nav>
      <a href="#about">About</a>
      <a href="#program">Youth Program</a>
      <a href="#work">Work & Collaborations</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>

    <section id="about">
      <h3>About SOUR FACE</h3>
      <p>
        David Hill, professionally known as <strong>SOUR FACE</strong>, is a Harlem-born DJ, producer,
        engineer and creative educator whose work connects music production, DJ culture, artist development
        and youth education. Beginning his career as a teenage DJ in New York City, David learned directly
        from the artists and engineers who shaped the sound of hip hop.
      </p>

      <p>
        His musical style blends hip hop, R&B, jazz, soul and New York street energy, rooted in the
        discipline and creativity of classic DJ culture. Over the years, David has collaborated with
        legendary figures including Wu-Tang artists and affiliates, Busta Rhymes, Missy Elliott, DMX,
        Treach of Naughty by Nature, DJ Cutmaster and Latoya Hanson (the original DJ Spinderella).
      </p>

      <p>
        As Founder and CEO of <strong>SOURFACEMUSIC</strong>, David leads an independent creative studio
        focused on original production, remix blends, DJ culture, artist development, session prep and
        youth education.
      </p>

      <p>
        His work has earned national recognition, including a Congressional Music Award for the song
        <em>BX</em> and production of <em>9/11 America Anthem</em> with Patrick Adams for a documentary
        permanently exhibited at the National September 11 Memorial & Museum.
      </p>
    </section>

    <section id="program">
      <h3>Youth DJ & Hip Hop Program</h3>
      <p>
        SOURFACEMUSIC teaches DJ culture and hip hop history to young people in the Bronx, offering
        instruction in DJ fundamentals, beat matching, equipment setup, sampling, performance technique
        and cultural literacy.
      </p>
      <p>
        The program emphasizes confidence, discipline, teamwork, cultural authenticity and creative
        responsibility — giving young people tools to express themselves and build community through music.
      </p>
    </section>

    <section id="work">
      <h3>Work & Collaborations</h3>
      <p>
        Collaborative work connected with Harlem 6, Treach of Naughty by Nature, DJ Cutmaster, Latoya
        Hanson (the original DJ Spinderella), and RZA of Wu-Tang Clan.
      </p>
      <p>
        SOURFACEMUSIC provides:
      </p>
      <ul>
        <li>Original production</li>
        <li>Remix blends</li>
        <li>Artist development</li>
        <li>Session prep</li>
        <li>DJ culture education</li>
      </ul>
    </section>

    <section id="contact">
      <h3>Contact</h3>
      <p>For bookings, collaborations or youth program inquiries:</p>
      <ul>
        <li>Email: <a href="mailto:sourfacemusic@gmail.com">sourfacemusic@gmail.com</a></li>
      </ul>
    </section>

  </main>

  <footer>
    © <span id="year"></span> SOURFACEMUSIC · David Hill
  </footer>

  <script>
    document.getElementById("year").textContent = new Date().getFullYear();
  </script>
</body>
</html>
