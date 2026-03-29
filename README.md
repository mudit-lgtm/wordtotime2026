# WordsToTime — Complete Website Rebuild

A fully SEO-optimized static site generator for **https://wordstotime.netlify.app** — a free word-count-to-speaking-time calculator.

## Overview

- **503K+ monthly impressions** analyzed and optimized
- **55+ pages** generated from a single Node.js script
- **22 301-redirects** to consolidate duplicate pages
- **0 external npm dependencies** — pure Node.js `fs` module only
- **FAQPage schema** on every page for rich results
- **AdSense Auto Ads** (pub-9275267797924945) on every page

## How to Build

```bash
node generate-site-seo-optimized.js
```

Output goes to `public/`. Netlify auto-deploys on push to `main`.

## URLs

- **Production**: https://wordstotime.netlify.app
- **GitHub**: https://github.com/mudit-lgtm/wordtotime2026

## Pages Generated

### Core Tool Pages (14)
| Page | Priority | Status |
|------|----------|--------|
| / (Homepage) | 1.0 | ✅ |
| /words-to-minutes/ | 0.9 | ✅ |
| /word-to-reading-time/ | 0.9 | ✅ — **Critical meta fix applied** |
| /word-to-speaking-time/ | 0.9 | ✅ |
| /word-to-speech-length/ | 0.9 | ✅ — **Critical meta fix applied** |
| /word-to-public-speaking-time/ | 0.9 | ✅ |
| /word-to-presentation-time/ | 0.8 | ✅ |
| /word-to-debate-time/ | 0.8 | ✅ |
| /word-to-typing-time/ | 0.8 | ✅ |
| /speaking-words-per-minute/ | 0.8 | ✅ |
| /practice-mode/ | 0.8 | ✅ |
| /reading-speed-test/ | 0.8 | ✅ — **New page** |
| /palabras-a-minutos/ | 0.7 | ✅ — **New Spanish page** |
| /lesezeit-rechner/ | 0.7 | ✅ — **New German page** |

### Word Count Pages (15)
200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000, 1300, 1500, 2000, 2500 words

### Speech Duration Pages (9)
2, 3, 4, 5, 6, 7, 10, 15, 20 minute speech word count pages

## Critical SEO Fixes Applied

1. **Meta descriptions with concrete answers** — every page now leads with actual numbers (e.g., "1,000 words = 7m 41s") rather than generic descriptions
2. **FAQPage schema** on every page — enables rich results accordion in Google
3. **22 301 redirects** consolidate duplicate/thin pages
4. **SoftwareApplication schema** with star ratings on every tool page
5. **BreadcrumbList schema** on all sub-pages

## Data Architecture

- **WPM Constants**: Slow (110), Average (130), Fast (150), Rapid (170), Silent Read (238), Read Aloud (183), Presentation (100)
- **Source**: American Speech-Language-Hearing Association (ASHA)
- **Storage**: Pure static HTML — no database, no server
- **Generator**: `generate-site-seo-optimized.js` (single file, no dependencies)

## Design System

- **Color palette**: Warm editorial (charcoal #292524, amber #b45309, forest #166534, cream #fafaf9)
- **Fonts**: Lora (headers) + Source Sans 3 (body) + JetBrains Mono (times/code)
- **Anti-pattern**: Deliberately avoids generic "AI blue" palette

## Deployment

- **Platform**: Netlify (auto-deploy from `main` branch)
- **Build command**: `node generate-site-seo-optimized.js`
- **Publish directory**: `public`
- **Node version**: 18

## Tech Stack

- Node.js (generator script, zero npm deps)
- Pure HTML/CSS/JS output (no framework)
- Netlify for hosting and redirects
- Google AdSense Auto Ads
- Google Analytics 4

## Last Updated

March 2026 — v5.0 complete rebuild based on GSC data analysis
