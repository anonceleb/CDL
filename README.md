# Café du L'Amour — website

A static, two-page site. No build step, no framework — `index.html`, `menu.html`,
`css/style.css`, `js/main.js`, and the `img/` folder are the entire site. Open either
page in any static file server and it works. The masthead and footer are duplicated
across the two pages (no templating layer to share them from) — a change to one
(new nav link, new social URL, a footer edit) needs the same edit made in both files.

The Cloudflare Worker serves these files at **extensionless** URLs — `menu.html` is
live at `/menu`, `index.html` at `/`. So all internal links, `<link rel="canonical">`,
`og:url`, `sitemap.xml` and the JSON-LD use `/menu` and `/`, not the `.html` names.
Keep it that way when adding links, or the canonical URL will 307-redirect.

## Deploying (Cloudflare Pages — recommended)

The domain `cafe-du-lamour.com` is already on Cloudflare, so Pages is the path of
least resistance: it creates the DNS record and TLS certificate for you.

1. Push this `site/` folder to a GitHub repository (see below).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**,
   pick the repo. Build command: none. Build output directory: `/` (or `site` if you
   keep this folder inside a larger repo).
3. **Workers & Pages → your project → Custom domains → Add** →
   `cafe-du-lamour.com` (and `www.cafe-du-lamour.com` if you want both). Cloudflare
   wires the DNS automatically since the zone is already yours.
4. **SSL/TLS → Overview** — set encryption mode to **Full (strict)**. Skipping this is
   the one step that causes a redirect loop on a Cloudflare-proxied domain.

Moving back to Petpooja later is a single DNS change — repoint the record, no code
changes needed here.

### Apex vs www — must stay consistent

Every canonical signal in the HTML (`<link rel="canonical">`, `og:url`, `sitemap.xml`,
`robots.txt`) points at the **apex** `https://cafe-du-lamour.com/`. So the apex must
serve the site, and `www` must 301-redirect to it (not the other way round):

- Bind the Worker / Pages project to **both** `cafe-du-lamour.com` and
  `www.cafe-du-lamour.com`.
- Add a Cloudflare **Redirect Rule**: `www.cafe-du-lamour.com/*` →
  `https://cafe-du-lamour.com/$1`, 301.

If you'd rather make `www` canonical instead, that's fine — but then change all four
signals above in both HTML files to match, or search engines see the canonical URL
returning a redirect.

### Fonts load non-blocking

The Google Fonts `<link>` uses `media="print" onload="this.media='all'"` with a
`<noscript>` fallback so it doesn't block first paint. If a Content-Security-Policy
is ever added at the Worker, it must allow the inline `onload` handler (or switch to
a `rel="preload" as="style"` swap done from `js/main.js`).

## Deploying (GitHub Pages — alternative)

1. Push `site/` to a GitHub repo, as the repo root (or use the `docs/` convention).
2. Repo **Settings → Pages** → Source: deploy from the branch/folder containing this
   site.
3. **Settings → Pages → Custom domain** → `cafe-du-lamour.com`. GitHub gives you the
   IPs / CNAME target to add — add them as DNS records in Cloudflare, with the
   Cloudflare proxy (orange cloud) either on with SSL set to **Full (strict)**, or off
   (grey cloud) to let GitHub's own certificate handle TLS directly.

## Structure

```
site/
├── index.html          the home page
├── menu.html            the full range — every dish/drink name, no prices
├── css/style.css        all styling, light theme only (café doesn't need a dark mode)
├── js/main.js            live open/closed pill, mobile menu, order sheet, sticky order bar
├── img/                  pre-sized WebP + JPEG fallbacks, generated from Photos/
├── robots.txt
└── sitemap.xml
```

No prices ship to the browser anywhere on the site. `index.html` shows eight
best-sellers as a curated showcase; `menu.html` lists all 198 items from the Petpooja
export (262 rows minus add-ons, combos, deals, and a handful of pure bottled-water/
soda utility rows) grouped by category with a veg/egg/non-veg mark, so a visitor can
see the full range without either page becoming a live price list.

`menu.html` was generated from `Base Menu from Petpooja.csv` by a one-off script
(not checked into this repo) — regenerate it by re-running the same category
grouping / name-cleanup / veg-non-veg-pair-merging logic against a fresh CSV export
if the menu changes meaningfully; hand-editing the item list in place is fine for
small tweaks (a renamed dish, a dropped item).
