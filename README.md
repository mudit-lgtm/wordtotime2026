# WordsToTime — Free Word Count to Speech & Reading Time Calculator

> **Live site:** https://wordstotime.netlify.app  
> **Repository:** Single-file static site generator (`generate-site-seo-optimized.js`)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Page Inventory](#2-page-inventory)
3. [Redirects (301) — Removed & Consolidated Pages](#3-redirects-301--removed--consolidated-pages)
4. [Tech Stack](#4-tech-stack)
5. [Local Development](#5-local-development)
6. [Deploy to Netlify](#6-deploy-to-netlify)
7. [Site Configuration](#7-site-configuration)
8. [SEO Architecture](#8-seo-architecture)
9. [Updating the Site](#9-updating-the-site)
10. [Project Structure](#10-project-structure)

---

## 1. Project Overview

WordsToTime converts any word count to speaking time, reading time, and presentation duration. All calculations use research-backed WPM rates from the American Speech-Language-Hearing Association (ASHA).

**Key facts:**
- **100% static HTML** — no server, no database, no JavaScript framework
- **41 canonical pages** generated from a single Node.js script
- **21 301 redirects** from old/duplicate URLs to canonical pages
- Google AdSense publisher: `ca-pub-9275267797924945`
- Google Analytics: replace `G-XXXXXXXXXX` in the generator with your real GA4 ID

---

## 2. Page Inventory

### Core Tool Pages (11)
| Page | URL |
|------|-----|
| Home / Words to Time Calculator | `/` |
| Words to Minutes | `/words-to-minutes/` |
| Reading Time Calculator | `/word-to-reading-time/` |
| Speaking Time Calculator | `/word-to-speaking-time/` |
| Speech Length Calculator | `/word-to-speech-length/` |
| Public Speaking Timer | `/word-to-public-speaking-time/` |
| Presentation Timer | `/word-to-presentation-time/` |
| Debate Time Calculator | `/word-to-debate-time/` |
| Typing Time Calculator | `/word-to-typing-time/` |
| Speaking WPM Guide | `/speaking-words-per-minute/` |
| Practice Mode | `/practice-mode/` |
| Reading Speed Test | `/reading-speed-test/` |

### Word Count Pages (15)
200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000, 1300, 1500, 2000, 2500 words  
URLs: `/{N}-words-to-minutes/`

### Speech Duration Pages (9)
2, 3, 4, 5, 6, 7, 10, 15, 20 minutes  
URLs: `/{N}-minute-speech-word-count/`

### International Pages (2)
| Page | URL | Language |
|------|-----|----------|
| Palabras a Minutos | `/palabras-a-minutos/` | Spanish |
| Lesezeit Rechner | `/lesezeit-rechner/` | German |

### Static Pages (4)
`/about/` · `/privacy/` · `/terms/` · `/404.html`

---

## 3. Redirects (301) — Removed & Consolidated Pages

These old/duplicate URLs are permanently redirected. They have **no HTML files** — Netlify handles the redirects via `netlify.toml`.

| Old URL (removed) | Redirects to |
|-------------------|--------------|
| `/words-to-time/` | `/` |
| `/speech-time-calculator/` | `/word-to-speaking-time/` |
| `/speaking-time-calculator/` | `/word-to-speaking-time/` |
| `/text-to-speech-time/` | `/word-to-speaking-time/` |
| `/reading-time-calculator/` | `/word-to-reading-time/` |
| `/reading-time/` | `/word-to-reading-time/` |
| `/read-time-calculator/` | `/word-to-reading-time/` |
| `/read-aloud-time/` | `/word-to-reading-time/` |
| `/how-long-to-read/` | `/word-to-reading-time/` |
| `/speech-length-calculator/` | `/word-to-speech-length/` |
| `/presentation-time-calculator/` | `/word-to-presentation-time/` |
| `/debate-calculator/` | `/word-to-debate-time/` |
| `/words-per-minute-speech/` | `/speaking-words-per-minute/` |
| `/average-speaking-speed/` | `/speaking-words-per-minute/` |
| `/script-timer/` | `/practice-mode/` |
| `/how-long-1000-word-speech/` | `/1000-words-to-minutes/` |
| `/how-long-500-word-speech/` | `/500-words-to-minutes/` |
| `/how-long-600-word-speech/` | `/600-words-to-minutes/` |
| `/how-long-900-word-speech/` | `/900-words-to-minutes/` |
| `/how-long-1500-word-speech/` | `/1500-words-to-minutes/` |
| `/how-long-2500-word-speech/` | `/2500-words-to-minutes/` |

> All redirects are defined in `netlify.toml` (auto-generated). Never edit `netlify.toml` manually — run the generator to regenerate it.

---

## 4. Tech Stack

| Component | Technology |
|-----------|-----------|
| Site generator | Node.js (CommonJS) — zero dependencies |
| Styling | Inline CSS (served as `/css/style.css`) |
| JavaScript | Vanilla JS (served as `/js/app.js`) |
| Fonts | Google Fonts (Lora, Source Sans 3, JetBrains Mono) via CDN |
| Hosting | Netlify (static hosting) |
| Redirects | `netlify.toml` [[redirects]] blocks |
| Analytics | Google Analytics 4 |
| Monetisation | Google AdSense |

---

## 5. Local Development

### Prerequisites
- **Node.js 18+** (check: `node --version`)
- **npm** (check: `npm --version`)

### 1. Clone the repository
```bash
git clone https://github.com/mudit-lgtm/wordtotime2026.git
cd wordtotime2026
```

### 2. Generate all static files
```bash
node generate-site-seo-optimized.js
```
This writes everything to `public/`. Expected output:
```
✅ WordsToTime generated successfully!
   📁 Total files:  47
   📄 HTML pages:   41 canonical
   🔀 Redirects:    21 (in netlify.toml)
   🗺  Sitemap:      41 URLs
```

### 3. Preview locally
```bash
# Option A — npx serve (no install required)
npx serve public -p 3000

# Option B — if you have Python
python3 -m http.server 3000 --directory public
```

Open http://localhost:3000

---

## 6. Deploy to Netlify

### Method A — Netlify Git Integration (Recommended)

This is the easiest method. Every push to `main` automatically rebuilds and deploys.

**Step 1 — Push to GitHub**
```bash
git add .
git commit -m "feat: update site"
git push origin main
```

**Step 2 — Connect to Netlify**
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect your GitHub account
3. Select the `wordtotime2026` repository
4. Configure build settings:
   - **Base directory:** *(leave blank)*
   - **Build command:** `node generate-site-seo-optimized.js`
   - **Publish directory:** `public`
   - **Node version:** `18` *(set in netlify.toml — no action needed)*
5. Click **Deploy site**

**Step 3 — Set custom domain (optional)**
- Go to **Domain settings** → **Add custom domain**
- Follow Netlify's DNS instructions

### Method B — Netlify CLI (Manual Deploy)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Generate the site
node generate-site-seo-optimized.js

# Link to your Netlify site (first time)
netlify link

# Deploy to production
netlify deploy --prod --dir=public
```

### Method C — Netlify Drop (No Account)

1. Run `node generate-site-seo-optimized.js`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `public/` folder into the browser
4. Site is live instantly

> ⚠️ Method C does **not** apply `netlify.toml` redirects. Use Method A or B for production.

---

## 7. Site Configuration

### Google Analytics
Replace `G-XXXXXXXXXX` on line 8 of `generate-site-seo-optimized.js` with your real GA4 Measurement ID:
```js
const GA_ID = 'G-YOUR_REAL_ID';
```

### Google AdSense
The AdSense publisher ID is already set: `ca-pub-9275267797924945`. If you change the site, update line 7:
```js
const ADSENSE_PUB = 'ca-pub-YOUR_PUB_ID';
```

### Google Search Console Verification
Update the verification meta tag on line ~773:
```js
<meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE">
```

### Base URL
If deploying to a different domain, update line 6:
```js
const BASE_URL = 'https://your-custom-domain.com';
```

---

## 8. SEO Architecture

### Canonical Strategy
- Every page has a `<link rel="canonical">` tag
- All old/duplicate URLs redirect 301 to canonical pages
- Sitemap (`/sitemap.xml`) contains **only canonical URLs** — no redirect sources

### Schema Markup
Every page includes structured data:
- `SoftwareApplication` (with AggregateRating)
- `BreadcrumbList`
- `FAQPage` on all calculator pages

### Internal Linking
- Every page has a contextual **link strip** to related pages
- **Sidebar** on all pages links to all 12 calculators
- **Footer** links to all core tools, word count pages, and static pages
- **Homepage** has three link strips: Word Count Pages, Speech Duration Pages, Core Tools

---

## 9. Updating the Site

### Add a new page
1. Write a new `buildMyNewPage()` function in `generate-site-seo-optimized.js`
2. Add `write('public/my-new-page/index.html', buildMyNewPage());` to the main section
3. Add the URL to `sitemapUrls`
4. Run `node generate-site-seo-optimized.js`

### Add a redirect
1. Add an entry to the `REDIRECTS` array in `generate-site-seo-optimized.js`
2. Run `node generate-site-seo-optimized.js` (this regenerates `netlify.toml`)

### Edit content
All content is in `generate-site-seo-optimized.js`. The file is structured as:
- Lines 1–44: Constants and helper functions
- Lines 45–531: CSS
- Lines 533–616: JavaScript (app.js)
- Lines 618–905: Shared components (header, footer, widgets)
- Lines 907–1741: Page builder functions
- Lines 1743–1925: Main generation (writes all files)

---

## 10. Project Structure

```
wordtotime2026/
├── generate-site-seo-optimized.js  ← Single generator script (edit this)
├── netlify.toml                     ← Auto-generated (do not edit manually)
├── README.md
├── .gitignore
└── public/                          ← Auto-generated (do not edit manually)
    ├── index.html                   ← Homepage
    ├── css/style.css
    ├── js/app.js
    ├── sitemap.xml
    ├── robots.txt
    ├── ads.txt
    ├── 404.html
    ├── words-to-minutes/index.html
    ├── word-to-reading-time/index.html
    ├── word-to-speaking-time/index.html
    ├── word-to-speech-length/index.html
    ├── word-to-public-speaking-time/index.html
    ├── word-to-presentation-time/index.html
    ├── word-to-debate-time/index.html
    ├── word-to-typing-time/index.html
    ├── speaking-words-per-minute/index.html
    ├── practice-mode/index.html
    ├── reading-speed-test/index.html
    ├── [200,250,300...2500]-words-to-minutes/index.html  (15 pages)
    ├── [2,3,4...20]-minute-speech-word-count/index.html  (9 pages)
    ├── palabras-a-minutos/index.html
    ├── lesezeit-rechner/index.html
    ├── about/index.html
    ├── privacy/index.html
    └── terms/index.html
```

> **Note:** The `public/` directory is auto-generated. Never edit files inside it directly. All changes must be made in `generate-site-seo-optimized.js` and then re-run.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Redirects not working locally | Redirects only work on Netlify. Test with Method A or B. |
| Fonts not loading locally | Google Fonts blocked in some dev environments. Works on Netlify. |
| AdSense not showing | AdSense requires domain approval. Works after Netlify deploy + GSC verification. |
| Pages not updating | Delete `public/` folder, re-run `node generate-site-seo-optimized.js` |
| Build failing on Netlify | Check Node.js version: must be 18. Set in `netlify.toml` under `[build.environment]`. |

---

*Generated by WordsToTime v5.1 · [wordstotime.netlify.app](https://wordstotime.netlify.app)*
