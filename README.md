# Café du L'Amour — website

A static, one-page site. No build step, no framework — `index.html`, `css/style.css`,
`js/main.js`, and the `img/` folder are the entire site. Open `index.html` in any
static file server and it works.

## Before you go live — confirm these

The site ships with reasonable defaults where information wasn't confirmed. Fix these
in `index.html` before pointing the real domain at it:

| What | Where | Current placeholder |
|---|---|---|
| **"Weekend" hours** | `js/main.js` (`computeStatus`) and the `<script type="application/ld+json">` block + hours table in `index.html` | Assumed **Friday & Saturday** close at 11:30pm. If it's actually Saturday & Sunday, change `day === 5 \|\| day === 6` in `main.js` to `day === 6 \|\| day === 0`, and swap the corresponding rows in the JSON-LD `openingHoursSpecification` and the `<table class="hours">`. |

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
├── index.html          the whole site — one page
├── css/style.css        all styling, light theme only (café doesn't need a dark mode)
├── js/main.js            live open/closed pill, mobile menu, order sheet, sticky order bar
├── img/                  pre-sized WebP + JPEG fallbacks, generated from Photos/
├── robots.txt
└── sitemap.xml
```

No CSV, no menu database, no prices ship to the browser — per the brief, the site
shows eight best-sellers as a showcase, not the full 262-item Petpooja menu.
