# DCS mods site

A small static website for sharing DCS World mods. No build step, no server code — just HTML, CSS and JavaScript.

```
index.html   the homepage: photo, mod list, install steps, footer
mod.html     one page per mod (mod.html?id=<mod id>)
app.js       fills both pages from mods.js
mods.js      ← YOUR MODS LIVE HERE (the only file you normally edit)
assets/      the design kit (styles, scripts, photos). Leave as is
images/      put your own screenshots here (create the folder)
credits.html credits for the stand-in photographs
old/         the first version of the site, kept for reference
```

## Make it yours

- **Name:** The site name, "Inferno Mods", is set in `mods.js`, `index.html`
  and `mod.html` (search for "Inferno" to change it).
- **Photos:** the jet photographs are public-domain stand-ins from Wikimedia Commons. Swap in your
  own in-game screenshots as you get them, and the mod list uses them automatically.
- **List length:** the homepage list is laid out for your one mod. From about the third mod, phones
  need the list section to be two screens tall; on desktop one screen holds 5 to 6 mods.

## Add a mod

1. Open `mods.js`.
2. Copy one `{ ... },` block inside `window.MODS = [ ... ]` and change the values.
3. Give it a unique `id` (lowercase, dashes, no spaces).
4. Add a 16:9 screenshot to `images/` and set `image: "images/your-file.jpg"`.
5. Set `download` to the link where the file lives (see below).

Change the site name, your callsign and footer links in `window.SITE` at the top of `mods.js`.

Each mod gets its own page: `https://your-site/mod.html?id=mod-id`. Handy for Discord or forum posts.

A mod whose `download` is left empty shows without a download button.

## Where to put the mod files

DCS mods are often big, so don't put large zips inside the website itself.

| Option | Good for | Limit |
|---|---|---|
| **GitHub Releases** (recommended) | Versioned zips with download counts | 2 GB per file |
| Google Drive / Dropbox / MEGA share link | Very large files | Your storage plan |
| `downloads/` folder in this site | Small scripts and missions | ~25–100 MB depending on host |

Paste the file's direct link into `download`.

## Put it online (free)

**GitHub Pages**
1. Create a repository on GitHub and upload these files.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Your site is live at `https://<username>.github.io/<repo>/`.
4. For each mod, create a Release in the same repo and attach the zip; copy the asset link into `mods.js`.

**Netlify / Cloudflare Pages**
Drag this folder onto Netlify Drop (app.netlify.com/drop) or connect the GitHub repo.

## Preview locally

Double-click `index.html`, or run:

```
python3 -m http.server 8000
```

and open http://localhost:8000.
