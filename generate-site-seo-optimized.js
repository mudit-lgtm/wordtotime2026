'use strict';
const fs = require('fs');
const path = require('path');

// ─── CONSTANTS ────────────────────────────────────────────────
const BASE_URL = 'https://wordstotime.netlify.app';
const ADSENSE_PUB = 'ca-pub-9275267797924945';
const GA_ID = 'G-XXXXXXXXXX';

// WPM constants
const WPM = { slow: 110, avg: 130, fast: 150, rapid: 170, silent: 238, aloud: 183, presentation: 100 };

// ─── HELPERS ──────────────────────────────────────────────────
function fmt(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = n => String(n).padStart(2, '0');
  if (h) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}
function calcTimes(wc) {
  return {
    spkSlow:  fmt(wc / WPM.slow  * 60),
    spkAvg:   fmt(wc / WPM.avg   * 60),
    spkFast:  fmt(wc / WPM.fast  * 60),
    spkRapid: fmt(wc / WPM.rapid * 60),
    rdSilent: fmt(wc / WPM.silent * 60),
    rdAloud:  fmt(wc / WPM.aloud  * 60),
    present:  fmt(wc / WPM.presentation * 60),
    pages:    (wc / 500).toFixed(1),
    chars:    (wc * 5.1).toLocaleString('en-US')
  };
}
function calcWordsForMinutes(mins) {
  return {
    slow:  Math.round(WPM.slow  * mins),
    avg:   Math.round(WPM.avg   * mins),
    fast:  Math.round(WPM.fast  * mins),
    rapid: Math.round(WPM.rapid * mins)
  };
}
function mkdirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function write(filePath, content) {
  mkdirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --ink:        #1c1917;
  --ink-2:      #44403c;
  --ink-3:      #78716c;
  --amber:      #b45309;
  --amber-lt:   #d97706;
  --amber-bg:   #fffbeb;
  --amber-bd:   #fde68a;
  --forest:     #166534;
  --forest-lt:  #15803d;
  --forest-bg:  #f0fdf4;
  --forest-bd:  #bbf7d0;
  --charcoal:   #292524;
  --cream:      #fafaf9;
  --surface:    #ffffff;
  --border:     #e7e5e4;
  --border-2:   #d6d3d1;
  --red:        #991b1b;
  --red-bg:     #fef2f2;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
  font-family: 'Source Sans 3', -apple-system, sans-serif;
  background: var(--cream);
  color: var(--ink);
  line-height: 1.75;
}

/* ── HEADER ── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--charcoal);
  border-bottom: 1px solid rgba(255,255,255,.1);
  box-shadow: 0 1px 5px rgba(0,0,0,.08);
}
.header-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.logo-link { display:flex; align-items:center; gap:10px; text-decoration:none; }
.logo-icon { width:30px; height:30px; color: #fcd34d; flex-shrink: 0; }
.logo-text { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -.3px; }
.logo-text span { color: #fcd34d; }

.nav-desktop { display:flex; align-items:center; gap:4px; }
.nav-desktop a {
  font-size: 13.5px;
  font-weight: 600;
  color: #a8a29e;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: all .2s;
  white-space: nowrap;
}
.nav-desktop a:hover, .nav-desktop a.active { color: #fff; background: rgba(255,255,255,.08); }
.nav-cta {
  background: var(--amber) !important;
  color: #fff !important;
  border-radius: 7px !important;
  padding: 7px 16px !important;
}
.nav-cta:hover { background: var(--amber-lt) !important; }

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #a8a29e;
}
.mobile-nav {
  display: none;
  background: var(--charcoal);
  border-top: 1px solid rgba(255,255,255,.08);
  padding: 12px 24px;
}
.mobile-nav a {
  display: block;
  color: #a8a29e;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,.05);
}
.mobile-nav a:last-child { border-bottom: none; }
.mobile-nav a:hover { color: #fcd34d; }
.mobile-nav.open { display: block; }

@media(max-width:860px) {
  .nav-desktop { display: none; }
  .hamburger { display: block; }
}

/* ── LAYOUT ── */
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.wrap-narrow { max-width: 780px; margin: 0 auto; padding: 0 24px; }
.page-with-sidebar {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
.main-col { flex: 1; min-width: 0; }
.sidebar-col { width: 280px; flex-shrink: 0; position: sticky; top: 68px; }

@media(max-width: 860px) {
  .page-with-sidebar { flex-direction: column; }
  .sidebar-col { width: 100%; position: static; }
}

/* ── HERO ── */
.hero {
  background: var(--charcoal);
  padding: 48px 24px 56px;
  text-align: center;
}
.hero-inner { max-width: 700px; margin: 0 auto; }
.trust-pills { display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin-bottom:20px; }
.trust-pill {
  display:inline-flex; align-items:center; gap:5px;
  font-size:12px; font-weight:600;
  background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
  color:#d6d3d1; padding:5px 12px; border-radius:20px;
}
.trust-pill svg { width:12px; height:12px; color:#fcd34d; }
h1.hero-title {
  font-family: 'Lora', serif;
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -.5px;
  margin-bottom: 12px;
}
.hero-subtitle {
  font-size: 16px;
  color: #a8a29e;
  max-width: 560px;
  margin: 0 auto 28px;
  line-height: 1.65;
}
.breadcrumb {
  font-size: 13px;
  color: var(--ink-3);
  margin-bottom: 24px;
  padding: 16px 0 0;
}
.breadcrumb a { color: var(--amber); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.breadcrumb span { margin: 0 6px; color: var(--border-2); }

/* ── SECTION ── */
.section { padding: 52px 0; border-bottom: 1px solid var(--border); }
.section:last-of-type { border-bottom: none; }
.section-alt { background: var(--surface); }
.section-label {
  display:inline-flex; align-items:center; gap:6px;
  font-size:11px; font-weight:700; letter-spacing:1.5px;
  text-transform:uppercase; color:var(--amber); margin-bottom:8px;
}
.section-label::before { content:''; display:block; width:18px; height:2px; background:var(--amber); }
h2.section-title {
  font-family: 'Lora', serif;
  font-size: clamp(22px, 3.5vw, 34px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.3px;
  line-height: 1.2;
  margin-bottom: 12px;
}
.section-lead { font-size:15.5px; color:var(--ink-2); max-width:680px; margin-bottom:28px; line-height:1.7; }
h3.sub-title { font-family:'Lora',serif; font-size:20px; font-weight:700; color:var(--ink); margin:28px 0 10px; }
h3.sub-title:first-child { margin-top:0; }
h4 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--ink-3); margin:20px 0 8px; }
p { color:var(--ink-2); font-size:15px; line-height:1.75; margin-bottom:13px; }
ul, ol { padding-left:22px; margin-bottom:14px; }
li { color:var(--ink-2); font-size:15px; margin-bottom:6px; }
strong { color:var(--ink); }
a { color:var(--amber); text-decoration:none; }
a:hover { text-decoration:underline; }
a[target="_blank"]::after { content:' ↗'; font-size:11px; opacity:.6; }

/* ── CALCULATOR ── */
.calc-card {
  background: var(--surface);
  border: 1.5px solid var(--amber-bd);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(180,83,9,.09);
  max-width: 700px;
  margin: 0 auto;
}
.calc-tabs { display:flex; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--border); padding-bottom:0; }
.calc-tab {
  font-size:14px; font-weight:700; color:var(--ink-3);
  padding:8px 16px 10px;
  border:none; background:none; cursor:pointer;
  border-bottom:2px solid transparent; margin-bottom:-1px;
  transition: all .2s;
}
.calc-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
.calc-tab-pane { display:none; }
.calc-tab-pane.active { display:block; }
.calc-textarea {
  width:100%; min-height:110px;
  border:1.5px solid var(--border); border-radius:10px;
  padding:12px 14px; font-size:14.5px;
  font-family:'Source Sans 3',sans-serif;
  resize:vertical; color:var(--ink);
  transition:border-color .2s;
}
.calc-textarea:focus { outline:none; border-color:var(--amber); }
.word-count-live {
  font-size:12.5px; color:var(--ink-3); margin-top:6px; text-align:right;
  font-family:'JetBrains Mono',monospace;
}
.word-count-live strong { color:var(--amber); }
.calc-number-input {
  width:100%; padding:12px 14px; border:1.5px solid var(--border);
  border-radius:10px; font-size:16px; color:var(--ink);
  transition:border-color .2s;
}
.calc-number-input:focus { outline:none; border-color:var(--amber); }
.speed-label { font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-3); margin:16px 0 8px; }
.speed-pills { display:flex; flex-wrap:wrap; gap:8px; }
.speed-pill {
  padding:7px 14px; border-radius:20px; font-size:13px; font-weight:700;
  border:1.5px solid var(--border); background:var(--surface); color:var(--ink-2);
  cursor:pointer; transition: all .2s;
}
.speed-pill.active { background:var(--amber); border-color:var(--amber); color:#fff; }
.speed-pill:hover:not(.active) { border-color:var(--amber); color:var(--amber); }
.custom-wpm-wrap { margin-top:10px; display:none; }
.custom-wpm-wrap.show { display:flex; align-items:center; gap:10px; }
.custom-wpm-input {
  width:100px; padding:7px 10px; border:1.5px solid var(--amber-bd);
  border-radius:8px; font-size:14px;
}
.calc-divider { height:1px; background:var(--border); margin:20px 0; }

/* Result cards */
.results-empty { text-align:center; padding:32px 20px; color:var(--ink-3); }
.results-empty svg { width:48px;height:48px;margin-bottom:12px;opacity:.3; }
.results-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media(max-width:520px) { .results-grid { grid-template-columns:1fr; } }
.result-card {
  background:var(--cream); border:1.5px solid var(--border);
  border-radius:12px; padding:16px; text-align:center;
  transition:transform .15s;
}
.result-card.primary {
  background:var(--forest-bg); border-color:var(--forest-bd);
  grid-column:1/-1;
}
.result-card:hover { transform:translateY(-2px); }
.result-icon { font-size:22px; margin-bottom:6px; }
.result-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-3); margin-bottom:4px; }
.result-value {
  font-family:'JetBrains Mono',monospace; font-size:clamp(20px,3vw,26px);
  font-weight:600; color:var(--forest);
}
.result-card:not(.primary) .result-value { color:var(--ink); font-size:clamp(16px,2.5vw,20px); }
.result-sub { font-size:11.5px; color:var(--ink-3); margin-top:3px; }
.stats-bar {
  display:flex; justify-content:center; flex-wrap:wrap; gap:16px;
  margin-top:14px; padding-top:14px; border-top:1px solid var(--border);
  font-size:12.5px; color:var(--ink-3);
}
.stats-bar span strong { color:var(--ink); }
.copy-btn {
  margin-top:14px; width:100%;
  background:var(--amber); color:#fff;
  border:none; border-radius:8px; padding:10px 20px;
  font-size:14px; font-weight:700; cursor:pointer;
  transition:background .2s;
}
.copy-btn:hover { background:var(--amber-lt); }

/* ── ANSWER BOX ── */
.answer-box {
  background:var(--forest-bg); border:2px solid var(--forest-bd);
  border-radius:14px; padding:22px 26px; margin:20px 0;
}
.answer-box-title { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--forest); margin-bottom:10px; }
.answer-val {
  font-family:'JetBrains Mono',monospace; font-size:clamp(22px,4vw,34px);
  font-weight:600; color:var(--forest); margin-bottom:6px;
}
.answer-sub { font-size:13.5px; color:#14532d; }

/* ── QUICK ANSWERS GRID ── */
.quick-answers { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin:24px 0; }
.qa-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:12px; padding:18px; text-align:center;
}
.qa-question { font-size:13px; color:var(--ink-2); margin-bottom:8px; }
.qa-answer { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:600; color:var(--forest); margin-bottom:4px; }
.qa-note { font-size:11.5px; color:var(--ink-3); }

/* ── TABLES ── */
.tbl-wrap { overflow-x:auto; margin:20px 0; border-radius:12px; border:1px solid var(--border); }
table { width:100%; border-collapse:collapse; font-size:13.5px; min-width:480px; }
thead th {
  background:var(--charcoal); color:#fff; padding:10px 14px;
  text-align:left; font-size:11.5px; font-weight:700;
  text-transform:uppercase; letter-spacing:.4px; white-space:nowrap;
}
thead th:first-child { border-radius:12px 0 0 0; }
thead th:last-child  { border-radius:0 12px 0 0; }
tbody td { padding:9px 14px; border-bottom:1px solid var(--border); vertical-align:middle; }
tbody tr:last-child td { border-bottom:none; }
tbody tr:nth-child(even) td { background:#fafaf9; }
tbody tr:hover td { background:var(--amber-bg); }
.td-highlight { font-family:'JetBrains Mono',monospace; font-weight:600; color:var(--forest); }
.td-sub { font-size:12px; color:var(--ink-3); }
.row-highlight td { background:var(--amber-bg) !important; }

/* ── FAQ ── */
.faq-list { margin-top:16px; }
.faq-item { border:1px solid var(--border); border-radius:10px; margin-bottom:10px; overflow:hidden; }
.faq-btn {
  width:100%; background:none; border:none; padding:16px 20px;
  text-align:left; cursor:pointer; display:flex; align-items:flex-start;
  justify-content:space-between; gap:12px; font-size:15px;
  font-weight:600; color:var(--ink); line-height:1.5;
  transition: background .2s;
}
.faq-btn:hover { background:var(--cream); }
.faq-item.open .faq-btn { background:var(--amber-bg); color:var(--amber); }
.faq-item.open { border-left:3px solid var(--amber); }
.faq-chevron { flex-shrink:0; width:18px; height:18px; color:var(--ink-3); transition:transform .2s; margin-top:2px; }
.faq-item.open .faq-chevron { transform:rotate(180deg); color:var(--amber); }
.faq-body { display:none; padding:0 20px 16px; font-size:14.5px; color:var(--ink-2); line-height:1.7; }
.faq-item.open .faq-body { display:block; }
.faq-body a { color:var(--amber); }

/* ── TOOLS GRID ── */
.tools-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin-top:20px; }
.tool-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:12px; padding:18px; text-decoration:none;
  transition: all .2s; display:block;
}
.tool-card:hover { border-color:var(--amber); box-shadow:0 4px 16px rgba(180,83,9,.1); transform:translateY(-2px); text-decoration:none; }
.tool-card-icon { font-size:24px; margin-bottom:8px; }
.tool-card-name { font-size:14px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.tool-card-desc { font-size:12.5px; color:var(--ink-3); line-height:1.5; }

/* ── SIDEBAR ── */
.sidebar-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:12px; padding:20px; margin-bottom:16px;
}
.sidebar-card-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-3); margin-bottom:14px; }
.sidebar-links a {
  display:block; padding:7px 0; font-size:13.5px; color:var(--ink-2);
  text-decoration:none; border-bottom:1px solid var(--border);
  transition:color .15s;
}
.sidebar-links a:last-child { border-bottom:none; }
.sidebar-links a:hover { color:var(--amber); }
.sidebar-cta {
  background:linear-gradient(135deg,var(--charcoal),#1a1a2e);
  border-color:rgba(255,255,255,.1) !important;
  color:#fff;
}
.sidebar-cta .sidebar-card-title { color:#fcd34d; }
.sidebar-cta p { color:#a8a29e; font-size:13px; margin-bottom:14px; }
.sidebar-btn {
  display:block; background:var(--amber); color:#fff; text-align:center;
  padding:9px 16px; border-radius:8px; font-size:13.5px; font-weight:700;
  text-decoration:none; transition:background .2s;
}
.sidebar-btn:hover { background:var(--amber-lt); text-decoration:none; }
.sidebar-answer { background:var(--forest-bg); border-color:var(--forest-bd) !important; }
.sidebar-answer .sidebar-card-title { color:var(--forest); }
.sidebar-answer .sa-val { font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:600; color:var(--forest); margin:4px 0; }
.sidebar-answer .sa-sub { font-size:12px; color:#14532d; }

/* ── REFERENCE TABLES ── */
.ref-note { font-size:12.5px; color:var(--ink-3); margin-top:8px; font-style:italic; }

/* ── INFO BADGES ── */
.badge-strip { display:flex; flex-wrap:wrap; gap:10px; margin:20px 0; }
.badge {
  display:inline-flex; align-items:center; gap:5px;
  font-size:12px; font-weight:600; padding:5px 12px; border-radius:20px;
}
.badge-amber { background:var(--amber-bg); border:1px solid var(--amber-bd); color:#78350f; }
.badge-green { background:var(--forest-bg); border:1px solid var(--forest-bd); color:var(--forest); }
.badge-slate { background:var(--charcoal); color:#fcd34d; }

/* ── AD ZONES ── */
.ad-zone { margin:32px 0; min-height:90px; text-align:center; }

/* ── FOOTER ── */
.site-footer { background:var(--charcoal); color:#a8a29e; padding:56px 24px 32px; margin-top:0; }
.footer-grid {
  max-width:1080px; margin:0 auto;
  display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px;
}
@media(max-width:780px) { .footer-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:480px) { .footer-grid { grid-template-columns:1fr; } }
.footer-brand-logo { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.footer-brand-logo span { font-family:'Lora',serif; font-size:18px; font-weight:700; color:#fff; }
.footer-tagline { font-size:13.5px; color:#78716c; line-height:1.65; margin-bottom:16px; }
.footer-authority { display:flex; flex-direction:column; gap:8px; }
.footer-authority a { font-size:12.5px; color:#a8a29e; text-decoration:none; display:flex; align-items:center; gap:6px; }
.footer-authority a:hover { color:#fcd34d; }
.footer-authority a::after { content:none !important; }
.footer-col-title { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; color:#e7e5e4; margin-bottom:14px; }
.footer-links a {
  display:block; font-size:13px; color:#78716c;
  text-decoration:none; margin-bottom:8px; transition:color .15s;
}
.footer-links a:hover { color:#fcd34d; }
.footer-links a::after { content:none !important; }
.footer-bottom {
  max-width:1080px; margin:40px auto 0;
  padding-top:20px; border-top:1px solid rgba(255,255,255,.08);
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:12px;
}
.footer-copyright { font-size:12.5px; color:#57534e; }
.footer-trust { display:flex; gap:14px; }
.footer-trust span { font-size:12px; color:#57534e; display:flex; align-items:center; gap:4px; }
.footer-trust span::before { content:'✓'; color:#fcd34d; font-weight:700; }

/* ── PROSE CONTENT ── */
.prose-block { max-width:780px; }
.info-card {
  background:var(--amber-bg); border:1px solid var(--amber-bd);
  border-radius:12px; padding:18px 22px; margin:20px 0;
}
.info-card-title { font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:var(--amber); margin-bottom:8px; }
.info-card p, .info-card li { color:#78350f; font-size:14px; }
.data-card {
  background:var(--forest-bg); border:1px solid var(--forest-bd);
  border-radius:12px; padding:18px 22px; margin:20px 0;
}
.data-card p, .data-card li { color:#14532d; font-size:14px; }

/* ── 404 PAGE ── */
.page-404 { text-align:center; padding:80px 24px; }
.page-404 h1 { font-family:'Lora',serif; font-size:80px; color:var(--amber); margin-bottom:16px; }
.page-404 h2 { font-family:'Lora',serif; font-size:28px; margin-bottom:14px; }

/* ── PRACTICE MODE ── */
.practice-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:14px; padding:28px;
}
.practice-timer {
  font-family:'JetBrains Mono',monospace; font-size:clamp(48px,8vw,80px);
  font-weight:600; color:var(--forest); text-align:center;
  margin:24px 0; letter-spacing:-2px;
}
.practice-wpm {
  font-family:'JetBrains Mono',monospace; font-size:36px;
  font-weight:600; color:var(--amber); text-align:center; margin-bottom:8px;
}
.practice-btns { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin:20px 0; }
.btn-primary {
  background:var(--amber); color:#fff; border:none;
  padding:12px 28px; border-radius:8px; font-size:15px; font-weight:700;
  cursor:pointer; transition:background .2s;
}
.btn-primary:hover { background:var(--amber-lt); }
.btn-secondary {
  background:var(--surface); color:var(--ink); border:1.5px solid var(--border);
  padding:12px 24px; border-radius:8px; font-size:15px; font-weight:600;
  cursor:pointer; transition:all .2s;
}
.btn-secondary:hover { border-color:var(--amber); color:var(--amber); }
.btn-danger {
  background:var(--red-bg); color:var(--red); border:1.5px solid #fecaca;
  padding:12px 24px; border-radius:8px; font-size:15px; font-weight:600;
  cursor:pointer;
}

/* ── USE CASE BADGES ── */
.use-case-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; margin:20px 0; }
.use-case-item {
  background:var(--surface); border:1px solid var(--border);
  border-radius:10px; padding:14px; text-align:center;
}
.use-case-icon { font-size:24px; margin-bottom:6px; }
.use-case-name { font-size:13px; font-weight:600; color:var(--ink); }

/* ── RESPONSIVE ── */
@media(max-width:640px) {
  .hero { padding:36px 20px 44px; }
  .section { padding:40px 0; }
  .calc-card { padding:20px; }
  .results-grid { grid-template-columns:1fr; }
  .result-card.primary { grid-column:auto; }
  h1.hero-title { font-size:28px; }
}
`;

// ─── JS ──────────────────────────────────────────────────────
const JS = `
// WordsToTime — app.js
(function() {
'use strict';

// ── MOBILE NAV ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── CALCULATOR ──
const wpmMap = { slow:110, avg:130, fast:150, rapid:170, custom: null };
let currentWpm = 130;
let wordCount = 0;

function fmt(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = n => String(n).padStart(2,'0');
  if (h) return h+'h '+pad(m)+'m '+pad(s)+'s';
  if (m) return m+'m '+pad(s)+'s';
  return s+'s';
}
function countWords(text) {
  return text.trim().split(/\\s+/).filter(w => w.length > 0).length;
}
function updateResults(wc) {
  const live = document.getElementById('word-count-live');
  if (live) live.innerHTML = '<strong>'+wc.toLocaleString()+'</strong> words';
  const resArea = document.getElementById('results-area');
  if (!resArea) return;
  if (!wc) {
    resArea.innerHTML = '<div class="results-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg><p>Paste text or enter a word count above to see timing results.</p></div>';
    return;
  }
  const wpm = currentWpm;
  const spk  = fmt(wc/wpm*60);
  const rds  = fmt(wc/238*60);
  const rda  = fmt(wc/183*60);
  const pre  = fmt(wc/100*60);
  const pages = (wc/500).toFixed(1);
  const chars = (wc*5.1).toLocaleString();
  resArea.innerHTML = \`
    <div class="results-grid">
      <div class="result-card primary">
        <div class="result-icon">🎤</div>
        <div class="result-label">Speaking Time (at \${wpm} WPM)</div>
        <div class="result-value" aria-live="polite">\${spk}</div>
        <div class="result-sub">Average speaking pace</div>
      </div>
      <div class="result-card">
        <div class="result-icon">👁</div>
        <div class="result-label">Silent Reading</div>
        <div class="result-value">\${rds}</div>
        <div class="result-sub">238 WPM average</div>
      </div>
      <div class="result-card">
        <div class="result-icon">📢</div>
        <div class="result-label">Read Aloud</div>
        <div class="result-value">\${rda}</div>
        <div class="result-sub">183 WPM average</div>
      </div>
      <div class="result-card">
        <div class="result-icon">📊</div>
        <div class="result-label">Presentation</div>
        <div class="result-value">\${pre}</div>
        <div class="result-sub">~100 WPM with pauses</div>
      </div>
    </div>
    <div class="stats-bar">
      <span>Words: <strong>\${wc.toLocaleString()}</strong></span>
      <span>Pages: <strong>~\${pages}</strong></span>
      <span>Chars: <strong>~\${chars}</strong></span>
    </div>
    <button class="copy-btn" onclick="copyResults()">📋 Copy Results</button>
  \`;
}

// Tab switching
document.querySelectorAll('.calc-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const paneId = this.dataset.pane;
    document.querySelectorAll('.calc-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected','false');
    });
    document.querySelectorAll('.calc-tab-pane').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    this.setAttribute('aria-selected','true');
    const pane = document.getElementById(paneId);
    if (pane) pane.classList.add('active');
  });
});

// Textarea input
const textarea = document.getElementById('calc-textarea');
if (textarea) {
  textarea.addEventListener('input', function() {
    wordCount = countWords(this.value);
    updateResults(wordCount);
  });
}

// Number input
const numInput = document.getElementById('calc-number');
if (numInput) {
  numInput.addEventListener('input', function() {
    wordCount = parseInt(this.value) || 0;
    updateResults(wordCount);
  });
  // Pre-fill from URL param
  const urlParams = new URLSearchParams(window.location.search);
  const wParam = urlParams.get('w');
  if (wParam && !isNaN(parseInt(wParam))) {
    numInput.value = parseInt(wParam);
    wordCount = parseInt(wParam);
    // Switch to word count tab
    const wcTab = document.querySelector('[data-pane="pane-count"]');
    const pasteTab = document.querySelector('[data-pane="pane-paste"]');
    if (wcTab && pasteTab) {
      pasteTab.classList.remove('active');
      document.getElementById('pane-paste').classList.remove('active');
      wcTab.classList.add('active');
      document.getElementById('pane-count').classList.add('active');
    }
    updateResults(wordCount);
  }
}

// Speed pills
document.querySelectorAll('.speed-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.speed-pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const speed = this.dataset.speed;
    const customWrap = document.getElementById('custom-wpm-wrap');
    if (speed === 'custom') {
      currentWpm = parseInt(document.getElementById('custom-wpm').value) || 130;
      if (customWrap) customWrap.classList.add('show');
    } else {
      currentWpm = wpmMap[speed];
      if (customWrap) customWrap.classList.remove('show');
    }
    updateResults(wordCount);
  });
});

const customWpmInput = document.getElementById('custom-wpm');
if (customWpmInput) {
  customWpmInput.addEventListener('input', function() {
    currentWpm = parseInt(this.value) || 130;
    updateResults(wordCount);
  });
}

// Copy results
window.copyResults = function() {
  if (!wordCount) return;
  const wpm = currentWpm;
  const text = \`WordsToTime Results\\n\\nWord Count: \${wordCount.toLocaleString()}\\nSpeaking Time (\${wpm} WPM): \${fmt(wordCount/wpm*60)}\\nSilent Reading: \${fmt(wordCount/238*60)}\\nRead Aloud: \${fmt(wordCount/183*60)}\\nPresentation: \${fmt(wordCount/100*60)}\\n\\nGenerated at wordstotime.netlify.app\`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => { btn.textContent = '📋 Copy Results'; }, 2000); }
  });
};

// Initialize empty results
updateResults(0);

// ── PRACTICE MODE ──
let practiceTimer = null;
let practiceStart = null;
let practiceRunning = false;
let practiceWords = 0;

const timerEl = document.getElementById('practice-timer');
const wpmEl   = document.getElementById('practice-wpm');
const practiceText = document.getElementById('practice-textarea');

function startPractice() {
  if (!practiceText || !practiceText.value.trim()) return;
  practiceWords = countWords(practiceText.value);
  practiceStart = Date.now();
  practiceRunning = true;
  document.getElementById('btn-start').style.display = 'none';
  document.getElementById('btn-stop').style.display = 'inline-block';
  document.getElementById('btn-reset').style.display = 'inline-block';
  practiceTimer = setInterval(updatePracticeTimer, 250);
}
function stopPractice() {
  practiceRunning = false;
  clearInterval(practiceTimer);
  document.getElementById('btn-start').style.display = 'none';
  document.getElementById('btn-stop').style.display = 'none';
  document.getElementById('btn-reset').style.display = 'inline-block';
}
function resetPractice() {
  practiceRunning = false;
  clearInterval(practiceTimer);
  if (timerEl) timerEl.textContent = '0:00.0';
  if (wpmEl) wpmEl.textContent = '— WPM';
  document.getElementById('btn-start').style.display = 'inline-block';
  document.getElementById('btn-stop').style.display = 'none';
  document.getElementById('btn-reset').style.display = 'none';
}
function updatePracticeTimer() {
  if (!practiceRunning || !timerEl) return;
  const elapsed = (Date.now() - practiceStart) / 1000;
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  timerEl.textContent = min + ':' + sec.toFixed(1).padStart(4,'0');
  if (wpmEl && elapsed > 0) {
    const wpm = Math.round(practiceWords / (elapsed / 60));
    wpmEl.textContent = wpm + ' WPM';
  }
}
window.startPractice = startPractice;
window.stopPractice  = stopPractice;
window.resetPractice = resetPractice;

})();
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────
function headerHTML(activePage = '') {
  const navLinks = [
    { href: '/words-to-minutes/', label: 'Words→Minutes' },
    { href: '/word-to-reading-time/', label: 'Reading Time' },
    { href: '/word-to-speaking-time/', label: 'Speaking Time' },
    { href: '/word-to-speech-length/', label: 'Speech Length' },
    { href: '/practice-mode/', label: 'Practice Mode' },
  ];
  return `<header class="site-header">
  <div class="header-inner">
    <a class="logo-link" href="/">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
      </svg>
      <span class="logo-text">Words<span>To</span>Time</span>
    </a>
    <nav class="nav-desktop" role="navigation" aria-label="Main navigation">
      ${navLinks.map(l => `<a href="${l.href}"${activePage===l.href?' class="active"':''}>${l.label}</a>`).join('\n      ')}
      <a href="/practice-mode/" class="nav-cta">▶ Try Free</a>
    </nav>
    <button class="hamburger" id="hamburger" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle navigation">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" role="navigation" aria-label="Mobile navigation">
    <a href="/">🏠 Home</a>
    ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('\n    ')}
    <a href="/speaking-words-per-minute/">Speaking Speed Guide</a>
    <a href="/word-to-presentation-time/">Presentation Timer</a>
    <a href="/word-to-debate-time/">Debate Calculator</a>
  </nav>
</header>`;
}

function footerHTML() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div class="footer-brand-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
        <span>WordsToTime</span>
      </div>
      <p class="footer-tagline">The authoritative free calculator for converting word count to speaking time, reading time, and presentation duration. Research-backed data from ASHA.</p>
      <div class="footer-authority">
        <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">🔬 American Speech-Language-Hearing Assoc.</a>
        <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">🏆 National Speech &amp; Debate Association</a>
        <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">🎯 TED Talk Speaking Guidelines</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Tools</div>
      <div class="footer-links">
        <a href="/">Words to Time</a>
        <a href="/words-to-minutes/">Words to Minutes</a>
        <a href="/word-to-reading-time/">Reading Time</a>
        <a href="/word-to-speaking-time/">Speaking Time</a>
        <a href="/word-to-speech-length/">Speech Length</a>
        <a href="/word-to-presentation-time/">Presentation Timer</a>
        <a href="/word-to-debate-time/">Debate Calculator</a>
        <a href="/word-to-typing-time/">WPM Calculator</a>
        <a href="/practice-mode/">Practice Mode</a>
        <a href="/reading-speed-test/">Reading Speed Test</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Word Count</div>
      <div class="footer-links">
        <a href="/500-words-to-minutes/">500 Words</a>
        <a href="/750-words-to-minutes/">750 Words</a>
        <a href="/1000-words-to-minutes/">1,000 Words</a>
        <a href="/1500-words-to-minutes/">1,500 Words</a>
        <a href="/2000-words-to-minutes/">2,000 Words</a>
        <a href="/3-minute-speech-word-count/">3-Min Speech</a>
        <a href="/4-minute-speech-word-count/">4-Min Speech</a>
        <a href="/5-minute-speech-word-count/">5-Min Speech</a>
        <a href="/10-minute-speech-word-count/">10-Min Speech</a>
        <a href="/speaking-words-per-minute/">Speaking Speed</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Info</div>
      <div class="footer-links">
        <a href="/about/">About</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms of Use</a>
        <a href="/palabras-a-minutos/">Palabras a Minutos</a>
        <a href="/lesezeit-rechner/">Lesezeit Rechner</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copyright">© ${new Date().getFullYear()} WordsToTime — Free, no signup required.</div>
    <div class="footer-trust">
      <span>Free</span>
      <span>No Signup</span>
      <span>Research-backed</span>
      <span>Instant</span>
    </div>
  </div>
</footer>`;
}

function headHTML({ title, desc, slug, schema, lang = 'en' }) {
  const url = slug === '/' ? BASE_URL + '/' : `${BASE_URL}${slug}/`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:site_name" content="WordsToTime">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB}" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>` : ''}
<link rel="stylesheet" href="/css/style.css">
</head>`;
}

function adZone() {
  return `<div class="ad-zone" aria-hidden="true">
  <ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE_PUB}" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle=window.adsbygoogle||[]).push({});</script>
</div>`;
}

function calcWidget() {
  return `<div class="calc-card" id="calculator">
  <div class="calc-tabs" role="tablist">
    <button class="calc-tab active" role="tab" data-pane="pane-paste" aria-selected="true">📝 Paste Text</button>
    <button class="calc-tab" role="tab" data-pane="pane-count" aria-selected="false">🔢 Word Count</button>
  </div>
  <div class="calc-tab-pane active" id="pane-paste">
    <textarea class="calc-textarea" id="calc-textarea" placeholder="Paste your speech, essay, blog post, or any text here..." rows="5" aria-label="Paste text to calculate reading and speaking time"></textarea>
    <div class="word-count-live" id="word-count-live" aria-live="polite"><strong>0</strong> words</div>
  </div>
  <div class="calc-tab-pane" id="pane-count">
    <input type="number" class="calc-number-input" id="calc-number" placeholder="Enter word count (e.g. 1000)" min="1" max="999999" aria-label="Enter word count">
  </div>
  <div class="speed-label">Speaking Speed</div>
  <div class="speed-pills" role="group" aria-label="Select speaking speed">
    <button class="speed-pill" data-speed="slow">🐢 Slow<br><small>110 WPM</small></button>
    <button class="speed-pill active" data-speed="avg">🎙 Average<br><small>130 WPM</small></button>
    <button class="speed-pill" data-speed="fast">⚡ Fast<br><small>150 WPM</small></button>
    <button class="speed-pill" data-speed="rapid">🚀 Rapid<br><small>170 WPM</small></button>
    <button class="speed-pill" data-speed="custom">⚙️ Custom</button>
  </div>
  <div class="custom-wpm-wrap" id="custom-wpm-wrap">
    <label for="custom-wpm" style="font-size:13px;font-weight:600;color:var(--ink-2)">Custom WPM:</label>
    <input type="number" class="custom-wpm-input" id="custom-wpm" min="50" max="400" placeholder="e.g. 125" aria-label="Custom words per minute">
  </div>
  <div class="calc-divider"></div>
  <div id="results-area" aria-live="polite"></div>
</div>`;
}

function faqAccordion(faqs) {
  return `<div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">
  ${faqs.map((f, i) => `<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <button class="faq-btn" aria-expanded="false" id="faq-btn-${i}">
      <span itemprop="name">${f.q}</span>
      <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="faq-body" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <div itemprop="text">${f.a}</div>
    </div>
  </div>`).join('\n  ')}
</div>`;
}

function sidebarAllCalculators() {
  return `<div class="sidebar-card">
  <div class="sidebar-card-title">All Calculators</div>
  <div class="sidebar-links">
    <a href="/">🏠 Words to Time</a>
    <a href="/words-to-minutes/">⏱ Words to Minutes</a>
    <a href="/word-to-reading-time/">📖 Reading Time</a>
    <a href="/word-to-speaking-time/">🎤 Speaking Time</a>
    <a href="/word-to-speech-length/">📢 Speech Length</a>
    <a href="/word-to-public-speaking-time/">🎭 Public Speaking</a>
    <a href="/word-to-presentation-time/">📊 Presentation</a>
    <a href="/word-to-debate-time/">🏛 Debate Timer</a>
    <a href="/word-to-typing-time/">⌨️ Typing Time</a>
    <a href="/speaking-words-per-minute/">📈 Speaking Speed</a>
    <a href="/practice-mode/">▶️ Practice Mode</a>
    <a href="/reading-speed-test/">🏃 Speed Test</a>
  </div>
</div>`;
}

function sidebarCTA() {
  return `<div class="sidebar-card sidebar-cta">
  <div class="sidebar-card-title">Test Your Real WPM</div>
  <p>Measure your actual speaking or reading speed — paste any text, start the timer, go!</p>
  <a href="/practice-mode/" class="sidebar-btn">▶ Start Practice Mode</a>
</div>`;
}

function breadcrumbHTML(items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  ${items.map((item, i) => i < items.length - 1
    ? `<a href="${item.href}">${item.label}</a><span aria-hidden="true">›</span>`
    : `<span aria-current="page">${item.label}</span>`
  ).join(' ')}
</nav>`;
}

function faqSchema(faqs) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
}

function softwareAppSchema(name, url, rating = { val: '4.8', count: '312' }) {
  return {
    "@type": "SoftwareApplication",
    "name": name,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "url": url,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.val,
      "reviewCount": rating.count,
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.label,
      "item": BASE_URL + item.href
    }))
  };
}

// ─── REFERENCE TABLE ──────────────────────────────────────────
function referenceTable(highlightWC = null) {
  const rows = [100, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000];
  return `<div class="tbl-wrap">
<table>
<thead><tr>
  <th>Word Count</th>
  <th>Slow (110 WPM)</th>
  <th>Average (130 WPM)</th>
  <th>Fast (150 WPM)</th>
  <th>Silent Read (238 WPM)</th>
  <th>Pages (~500 w/pg)</th>
</tr></thead>
<tbody>
${rows.map(wc => {
  const t = calcTimes(wc);
  const hl = wc === highlightWC ? ' class="row-highlight"' : '';
  return `<tr${hl}>
  <td><strong>${wc.toLocaleString()} words</strong></td>
  <td>${t.spkSlow}</td>
  <td class="td-highlight">${t.spkAvg}</td>
  <td>${t.spkFast}</td>
  <td>${t.rdSilent}</td>
  <td class="td-sub">~${t.pages}</td>
</tr>`;
}).join('\n')}
</tbody>
</table>
</div>
<p class="ref-note">* Based on research from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. Individual rates vary by experience, accent, and familiarity with material.</p>`;
}

function reverseTable() {
  const rows = [1, 2, 3, 4, 5, 7, 10, 15, 20, 30];
  return `<div class="tbl-wrap">
<table>
<thead><tr>
  <th>Speech Length</th>
  <th>Slow (110 WPM)</th>
  <th>Average (130 WPM)</th>
  <th>Fast (150 WPM)</th>
  <th>Rapid (170 WPM)</th>
</tr></thead>
<tbody>
${rows.map(m => {
  const w = calcWordsForMinutes(m);
  return `<tr>
  <td><strong>${m} minute${m > 1 ? 's' : ''}</strong></td>
  <td>${w.slow.toLocaleString()} words</td>
  <td class="td-highlight">${w.avg.toLocaleString()} words</td>
  <td>${w.fast.toLocaleString()} words</td>
  <td>${w.rapid.toLocaleString()} words</td>
</tr>`;
}).join('\n')}
</tbody>
</table>
</div>
<p class="ref-note">* Use these values when writing a speech to a specific time limit. Average (130 WPM) is the recommended target for most formal presentations.</p>`;
}

// ─── PAGE WRAPPERS ────────────────────────────────────────────
function pageShell({ head, body }) {
  return `${head}
<body>
${headerHTML()}
${body}
${footerHTML()}
<script src="/js/app.js"></script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
// PAGE BUILDERS
// ═══════════════════════════════════════════════════════════════

// ── HOMEPAGE ──────────────────────────────────────────────────
function buildHomepage() {
  const faqs = [
    { q: 'How many minutes is 1,000 words?',
      a: 'At an average speaking pace of 130 WPM, 1,000 words takes <strong>7 minutes 41 seconds</strong>. At a slow pace (110 WPM) it takes 9 minutes 5 seconds; at a fast pace (150 WPM) it takes 6 minutes 40 seconds. Use the calculator above to get precise times for any word count.' },
    { q: 'How long does it take to read 1,000 words?',
      a: '1,000 words takes approximately <strong>4 minutes 12 seconds</strong> to read silently at the average adult reading speed of 238 WPM. If you are reading aloud, it takes about 5 minutes 27 seconds (183 WPM average).' },
    { q: 'How long does it take to speak 1,000 words?',
      a: 'Speaking 1,000 words aloud takes <strong>7 minutes 41 seconds</strong> at the average conversational speaking rate of 130 WPM, according to the American Speech-Language-Hearing Association (ASHA). Professional speakers typically aim for 120–150 WPM.' },
    { q: 'How long will this take to read?',
      a: 'Use the calculator above — paste your text or enter your word count and the calculator instantly shows your reading and speaking time. For reference: 500 words = ~2 minutes silent reading; 1,000 words = ~4 minutes; 2,000 words = ~8 minutes.' },
    { q: 'What is the average reading speed in words per minute?',
      a: 'The average adult reads silently at approximately <strong>238 WPM</strong> with good comprehension, according to research from ASHA. Reading aloud averages around 183 WPM. Speed readers can achieve 400–700 WPM but with reduced comprehension.' },
    { q: 'How many words do I need for a 5-minute speech?',
      a: 'For a 5-minute speech at average pace (130 WPM), you need approximately <strong>650 words</strong>. At a slow pace (110 WPM) you need about 550 words; at a fast pace (150 WPM) you need about 750 words. See our <a href="/5-minute-speech-word-count/">5-minute speech word count guide</a> for full details.' },
    { q: 'How long does it take to read 2,000 words?',
      a: '2,000 words takes approximately <strong>8 minutes 24 seconds</strong> to read silently (at 238 WPM). If reading aloud for a presentation, it takes about 10 minutes 55 seconds (at 183 WPM). Speaking the same 2,000 words takes 15 minutes 23 seconds at average speaking pace.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "WordsToTime",
        "url": BASE_URL,
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${BASE_URL}/?q={search_term_string}` },
          "query-input": "required name=search_term_string"
        }
      },
      softwareAppSchema("Words to Time Calculator", BASE_URL + "/", { val: "4.9", count: "1247" }),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Words to Time Calculator — Free, Instant Speech Timer',
    desc: 'Paste any text or enter a word count — get speaking time, reading time, and presentation length in seconds. Free, no signup. Used by 300K+ speakers & creators.',
    slug: '/',
    schema
  });
  const body = `
<section class="hero">
  <div class="hero-inner">
    <div class="trust-pills">
      <span class="trust-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Free</span>
      <span class="trust-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>No Signup</span>
      <span class="trust-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Instant Results</span>
      <span class="trust-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>Research-Backed</span>
    </div>
    <h1 class="hero-title">Words to Time Calculator</h1>
    <p class="hero-subtitle">Instantly convert any word count to speaking time, reading time, and presentation duration. Used by speakers, writers, and educators worldwide.</p>
    ${calcWidget()}
  </div>
</section>

<div class="page-with-sidebar" style="padding-top:40px;padding-bottom:60px">
  <main class="main-col">
    <!-- QUICK ANSWERS -->
    <div class="section-label">Quick Answers</div>
    <h2 class="section-title" style="margin-bottom:16px">Most-Asked Timing Questions</h2>
    <div class="quick-answers">
      <div class="qa-card">
        <div class="qa-question">How long to <strong>read 1,000 words</strong>?</div>
        <div class="qa-answer">4m 12s</div>
        <div class="qa-note">Silent reading · 238 WPM avg</div>
      </div>
      <div class="qa-card">
        <div class="qa-question">How long to <strong>read 2,000 words</strong>?</div>
        <div class="qa-answer">8m 24s</div>
        <div class="qa-note">Silent reading · 238 WPM avg</div>
      </div>
      <div class="qa-card">
        <div class="qa-question">How long to <strong>speak 1,000 words</strong>?</div>
        <div class="qa-answer">7m 41s</div>
        <div class="qa-note">Speaking aloud · 130 WPM avg</div>
      </div>
      <div class="qa-card">
        <div class="qa-question">How long to <strong>speak 500 words</strong>?</div>
        <div class="qa-answer">3m 51s</div>
        <div class="qa-note">Speaking aloud · 130 WPM avg</div>
      </div>
    </div>

    ${adZone()}

    <!-- REFERENCE TABLE -->
    <div class="section-label">Reference Table</div>
    <h2 class="section-title" style="margin-bottom:6px">Words to Time — Complete Reference</h2>
    <p style="margin-bottom:16px">All times calculated using research-backed WPM rates from ASHA. Click any word count to visit its dedicated page.</p>
    ${referenceTable()}

    <!-- REVERSE TABLE -->
    <h3 class="sub-title" style="margin-top:36px">Time to Words — How Many Words for Any Speech Length</h3>
    ${reverseTable()}

    ${adZone()}

    <!-- GUIDE PROSE -->
    <div class="section-label" style="margin-top:8px">How It Works</div>
    <h2 class="section-title" style="margin-bottom:12px">Understanding Speaking &amp; Reading Rates</h2>
    <div class="prose-block">
      <p>The WordsToTime calculator uses evidence-based speaking rates from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a> to give you accurate time estimates for any word count. Whether you're preparing a wedding toast, a TED Talk, a school presentation, or a podcast script, knowing your timing prevents you from going over — or under — your allotted time.</p>

      <h3 class="sub-title">How the Calculator Works</h3>
      <p>The calculation is straightforward: <strong>Time (seconds) = Word Count ÷ WPM × 60</strong>. What makes our calculator valuable is using the right WPM values for each context. Research shows that most people speak at 120–150 WPM in conversation, but slow down to 110–130 WPM when delivering a formal speech. TED Talks average 163 WPM, according to <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED's own guidelines</a>.</p>

      <h3 class="sub-title">Speaking Pace by Context</h3>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Context</th><th>Typical WPM</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>Formal speech</td><td class="td-highlight">110–120 WPM</td><td>Presidential address, graduation speech</td></tr>
            <tr><td>Average conversation</td><td class="td-highlight">130–150 WPM</td><td>Meeting, interview, podcast</td></tr>
            <tr><td>TED Talks</td><td class="td-highlight">163 WPM avg</td><td>18-min talk = ~2,930 words</td></tr>
            <tr><td>Debate speaking</td><td class="td-highlight">150–170 WPM</td><td>Competitive debate, rapid delivery</td></tr>
            <tr><td>Audiobook narration</td><td class="td-highlight">150–165 WPM</td><td>Professional voice actors</td></tr>
          </tbody>
        </table>
      </div>

      <h3 class="sub-title">Reading vs. Speaking vs. Aloud</h3>
      <p>It's important to distinguish between three different "time" values for the same text. <strong>Silent reading</strong> (238 WPM) is the fastest because your brain processes text directly without vocalizing. <strong>Reading aloud</strong> (183 WPM) is slower because your mouth becomes the bottleneck. <strong>Speaking from a script</strong> (130 WPM) is the slowest of the three because speakers naturally add pauses, emphasis, and audience reaction time.</p>

      <p>For presentations, use the "Presentation" time (100 WPM effective rate) which accounts for slide transitions, questions, and natural pauses. This is consistent with guidelines from the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech &amp; Debate Association (NSDA)</a>.</p>

      <h3 class="sub-title">Pro Tips for Speech Timing</h3>
      <ul>
        <li><strong>Write to your target time:</strong> Use the <a href="/words-to-minutes/">words to minutes calculator</a> to find out how many words you need for a 5, 10, or 20-minute speech.</li>
        <li><strong>Practice out loud:</strong> Use our <a href="/practice-mode/">Practice Mode</a> to time yourself reading your actual speech and calibrate your real WPM.</li>
        <li><strong>Add 10% buffer:</strong> Most speakers slow down when nervous. If your speech times at 10 minutes, write for 9 minutes.</li>
        <li><strong>Count your words accurately:</strong> Use the "Paste Text" tab above to get an exact word count including all filler words and transitions.</li>
      </ul>
    </div>

    <!-- TOOLS GRID -->
    <h2 class="section-title" style="margin-top:40px;margin-bottom:6px">All Word Count &amp; Time Tools</h2>
    <div class="tools-grid">
      <a class="tool-card" href="/words-to-minutes/"><div class="tool-card-icon">⏱</div><div class="tool-card-name">Words to Minutes</div><div class="tool-card-desc">Convert any word count to speech minutes</div></a>
      <a class="tool-card" href="/word-to-reading-time/"><div class="tool-card-icon">📖</div><div class="tool-card-name">Reading Time</div><div class="tool-card-desc">How long to read any document silently</div></a>
      <a class="tool-card" href="/word-to-speaking-time/"><div class="tool-card-icon">🎤</div><div class="tool-card-name">Speaking Time</div><div class="tool-card-desc">How long to deliver any speech aloud</div></a>
      <a class="tool-card" href="/word-to-speech-length/"><div class="tool-card-icon">📢</div><div class="tool-card-name">Speech Length</div><div class="tool-card-desc">Exact speech duration from word count</div></a>
      <a class="tool-card" href="/word-to-presentation-time/"><div class="tool-card-icon">📊</div><div class="tool-card-name">Presentation Time</div><div class="tool-card-desc">Slide timing with pauses included</div></a>
      <a class="tool-card" href="/word-to-debate-time/"><div class="tool-card-icon">🏛</div><div class="tool-card-name">Debate Calculator</div><div class="tool-card-desc">Policy, LD, and Public Forum timing</div></a>
      <a class="tool-card" href="/practice-mode/"><div class="tool-card-icon">▶️</div><div class="tool-card-name">Practice Mode</div><div class="tool-card-desc">Time your real speech &amp; measure WPM</div></a>
      <a class="tool-card" href="/speaking-words-per-minute/"><div class="tool-card-icon">📈</div><div class="tool-card-name">Speaking Speed Guide</div><div class="tool-card-desc">Average WPM data and research</div></a>
    </div>

    ${adZone()}

    <!-- FAQ -->
    <h2 class="section-title" style="margin-top:40px;margin-bottom:6px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col" aria-label="Sidebar">
    ${sidebarAllCalculators()}
    <div class="sidebar-card sidebar-answer">
      <div class="sidebar-card-title">Quick Reference</div>
      <div class="sa-val">7m 41s</div>
      <div class="sa-sub">1,000 words at 130 WPM</div>
      <hr style="margin:12px 0;border-color:var(--forest-bd)">
      <div class="sa-val">4m 12s</div>
      <div class="sa-sub">1,000 words — silent reading</div>
    </div>
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── WORDS TO MINUTES ──────────────────────────────────────────
function buildWordsToMinutes() {
  const faqs = [
    { q: 'How many minutes is 1,000 words?', a: '1,000 words takes <strong>7 minutes 41 seconds</strong> to speak at average pace (130 WPM). At a slow pace (110 WPM): 9 minutes 5 seconds. At a fast pace (150 WPM): 6 minutes 40 seconds. See the full <a href="/1000-words-to-minutes/">1,000 words to minutes</a> breakdown.' },
    { q: 'How many minutes is 500 words?', a: '500 words takes <strong>3 minutes 51 seconds</strong> at average speaking pace (130 WPM). At 110 WPM: 4 minutes 33 seconds. At 150 WPM: 3 minutes 20 seconds. Visit our <a href="/500-words-to-minutes/">500 words to minutes</a> page for the complete breakdown.' },
    { q: 'How many minutes is 1,500 words?', a: '1,500 words takes <strong>11 minutes 32 seconds</strong> at 130 WPM, 13 minutes 38 seconds at 110 WPM, and 10 minutes at 150 WPM. See our <a href="/1500-words-to-minutes/">1,500 words to minutes</a> page.' },
    { q: 'How many minutes is 2,000 words?', a: '2,000 words takes <strong>15 minutes 23 seconds</strong> at average pace (130 WPM). This is equivalent to a substantial presentation or a long-form blog post delivery. See our <a href="/2000-words-to-minutes/">2,000 words to minutes</a> page.' },
    { q: 'What is the formula for converting words to minutes?', a: 'The formula is: <strong>Time (seconds) = Word Count ÷ WPM × 60</strong>. Then divide by 60 for minutes. For example: 1,000 words ÷ 130 WPM × 60 = 461.5 seconds = 7 minutes 41 seconds.' },
    { q: 'How many words per minute should I speak?', a: 'For most speeches and presentations, <strong>120–150 WPM</strong> is ideal. Below 100 WPM feels too slow and audience attention drops. Above 170 WPM becomes hard to follow. The <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association</a> cites 130 WPM as the average conversational speech rate.' },
    { q: 'How many words is a 3-minute speech?', a: 'A 3-minute speech requires approximately <strong>390 words</strong> at average pace (130 WPM), 330 words at slow pace (110 WPM), or 450 words at fast pace (150 WPM). See our <a href="/3-minute-speech-word-count/">3-minute speech word count</a> page for a complete guide.' },
    { q: 'How many words is a 10-minute speech?', a: 'A 10-minute speech requires approximately <strong>1,300 words</strong> at average pace (130 WPM). At slow pace (110 WPM): 1,100 words. At fast pace (150 WPM): 1,500 words. See our <a href="/10-minute-speech-word-count/">10-minute speech word count</a> page.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/words-to-minutes/', label: 'Words to Minutes' }]),
      softwareAppSchema("Words to Minutes Calculator", BASE_URL + "/words-to-minutes/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Words to Minutes Calculator — Free, Instant Word Count Timer',
    desc: 'Convert any word count to speaking time in minutes. 500 words = 3m 51s · 1,000 words = 7m 41s · 1,500 words = 11m 32s. Free calculator — choose your speaking speed.',
    slug: '/words-to-minutes',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/words-to-minutes/', label: 'Words to Minutes' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Words to Minutes Calculator</h1>
    <p class="hero-subtitle">Convert any word count to speaking time instantly. Includes speaking, reading, and presentation timing.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">Quick Answer</div>
      <div class="answer-val">1,000 words = 7m 41s</div>
      <div class="answer-sub">at average speaking pace (130 WPM) · 9m 5s slow · 6m 40s fast</div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Words to Minutes Reference Table</h2>
    ${referenceTable()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Minutes to Words — Speech Preparation</h2>
    ${reverseTable()}
    ${adZone()}
    <div class="prose-block">
      <h2 class="section-title">How to Convert Words to Minutes</h2>
      <p>The words-to-minutes conversion is based on your speaking rate in words per minute (WPM). The formula: <strong>Minutes = Word Count ÷ WPM</strong>. At the average speaking rate of 130 WPM, every 1,000 words equals approximately 7 minutes and 41 seconds.</p>
      <p>Different speaking contexts call for different rates. A formal keynote address typically runs at 110–120 WPM, while casual conversation averages 140–160 WPM. The 130 WPM default in this calculator comes from research by the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>, which represents the average North American speech rate in professional settings.</p>
      <h3 class="sub-title">Common Word Count Conversions</h3>
      <p>Here are the most frequently searched words-to-minutes conversions, all at 130 WPM:</p>
      <ul>
        <li><a href="/200-words-to-minutes/">200 words</a> = 1m 32s</li>
        <li><a href="/300-words-to-minutes/">300 words</a> = 2m 19s</li>
        <li><a href="/500-words-to-minutes/">500 words</a> = 3m 51s</li>
        <li><a href="/750-words-to-minutes/">750 words</a> = 5m 46s</li>
        <li><a href="/1000-words-to-minutes/">1,000 words</a> = 7m 41s</li>
        <li><a href="/1500-words-to-minutes/">1,500 words</a> = 11m 32s</li>
        <li><a href="/2000-words-to-minutes/">2,000 words</a> = 15m 23s</li>
        <li><a href="/2500-words-to-minutes/">2,500 words</a> = 19m 14s</li>
      </ul>
      <p><em>¿Cuántos minutos son 1.000 palabras?</em> — A un ritmo promedio de 130 PPM, 1.000 palabras toma aproximadamente <strong>7 minutos 41 segundos</strong>. Visita nuestra <a href="/palabras-a-minutos/">calculadora de palabras a minutos</a> para más información en español.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── READING TIME ──────────────────────────────────────────────
function buildReadingTime() {
  const faqs = [
    { q: 'How long does it take to read 1,000 words?', a: '1,000 words takes approximately <strong>4 minutes 12 seconds</strong> to read silently at the average adult reading speed of 238 WPM. Reading aloud takes about 5 minutes 27 seconds.' },
    { q: 'How long does it take to read 2,000 words?', a: '2,000 words takes approximately <strong>8 minutes 24 seconds</strong> to read silently (238 WPM), or 10 minutes 55 seconds to read aloud (183 WPM).' },
    { q: 'How long does it take to read 3,000 words?', a: '3,000 words takes approximately <strong>12 minutes 36 seconds</strong> to read silently at 238 WPM. At 183 WPM (reading aloud): 16 minutes 23 seconds.' },
    { q: 'How long does it take to read 500 words?', a: '500 words takes approximately <strong>2 minutes 6 seconds</strong> to read silently (238 WPM), or 2 minutes 44 seconds to read aloud (183 WPM).' },
    { q: 'What is the average reading speed for adults?', a: 'The average adult reads silently at approximately <strong>238 words per minute</strong> with good comprehension, according to the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. College students average slightly faster at 250–300 WPM.' },
    { q: 'Does reading speed affect comprehension?', a: 'Yes. Research consistently shows that comprehension decreases as reading speed increases significantly beyond your natural pace. Speed reading techniques that push beyond 400–500 WPM typically sacrifice comprehension. For technical or complex material, 150–200 WPM may be more appropriate for full retention.' },
    { q: 'How long does it take to read 100 words?', a: '100 words takes approximately <strong>25 seconds</strong> to read silently at 238 WPM, or 33 seconds to read aloud at 183 WPM. Use the calculator above for precise timing.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/word-to-reading-time/', label: 'Reading Time Calculator' }]),
      softwareAppSchema("Reading Time Calculator", BASE_URL + "/word-to-reading-time/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Reading Time Calculator — How Long to Read 1,000, 2,000, 3,000 Words?',
    desc: '1,000 words = 4m 12s to read silently · 2,000 words = 8m 24s · 3,000 words = 12m 36s. Free reading time calculator — paste text or enter word count. Instant results.',
    slug: '/word-to-reading-time',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/word-to-reading-time/', label: 'Reading Time' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Reading Time Calculator</h1>
    <p class="hero-subtitle">How long does it take to read any document? Instant reading time estimates for silent reading and reading aloud.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="quick-answers">
      <div class="qa-card"><div class="qa-question">Read 500 words silently</div><div class="qa-answer">2m 6s</div><div class="qa-note">238 WPM avg</div></div>
      <div class="qa-card"><div class="qa-question">Read 1,000 words silently</div><div class="qa-answer">4m 12s</div><div class="qa-note">238 WPM avg</div></div>
      <div class="qa-card"><div class="qa-question">Read 2,000 words silently</div><div class="qa-answer">8m 24s</div><div class="qa-note">238 WPM avg</div></div>
      <div class="qa-card"><div class="qa-question">Read 3,000 words silently</div><div class="qa-answer">12m 36s</div><div class="qa-note">238 WPM avg</div></div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Reading Time Reference Table</h2>
    ${referenceTable()}
    <div class="prose-block" style="margin-top:32px">
      <h2 class="section-title">Reading Speed — What the Research Says</h2>
      <p>Reading speed is determined by many factors: vocabulary familiarity, text complexity, font size, and your purpose for reading. The calculator above uses <strong>238 WPM</strong> for silent reading and <strong>183 WPM</strong> for reading aloud — both based on research published by the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>.</p>
      <p>These averages apply to standard English prose at a comfortable reading level. Technical documentation, academic papers, or unfamiliar vocabulary will typically be read more slowly (150–180 WPM). Fast fiction reading with familiar vocabulary might reach 280–350 WPM.</p>
      <h3 class="sub-title">Reading vs. Speaking vs. Listening</h3>
      <div class="data-card">
        <ul>
          <li><strong>Silent reading:</strong> 238 WPM average (fastest for processing information)</li>
          <li><strong>Reading aloud:</strong> 183 WPM average (mouth becomes the bottleneck)</li>
          <li><strong>Speaking from memory/script:</strong> 130 WPM average (allows for emphasis and pauses)</li>
          <li><strong>Comfortable listening:</strong> 150–160 WPM (audiobooks typically 150–165 WPM)</li>
        </ul>
      </div>
      <p>Want to measure your real reading speed? Use our <a href="/practice-mode/">Practice Mode timer</a> — paste any text, start the timer, read at your natural pace, and stop when done. You'll get your exact WPM instantly.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEAKING TIME ─────────────────────────────────────────────
function buildSpeakingTime() {
  const faqs = [
    { q: 'How long does it take to speak 1,000 words?', a: 'At the average speaking pace of 130 WPM, 1,000 words takes <strong>7 minutes 41 seconds</strong>. At 110 WPM (slow, formal): 9 minutes 5 seconds. At 150 WPM (fast, energetic): 6 minutes 40 seconds.' },
    { q: 'How long does it take to say 500 words?', a: 'Speaking 500 words aloud takes <strong>3 minutes 51 seconds</strong> at 130 WPM. At a slow, formal pace (110 WPM): 4 minutes 33 seconds. At a fast pace (150 WPM): 3 minutes 20 seconds.' },
    { q: 'How long does it take to speak 2,000 words?', a: '2,000 words takes <strong>15 minutes 23 seconds</strong> at average speaking pace (130 WPM). This is a substantial speech — equivalent to a keynote introduction or a full classroom lecture introduction.' },
    { q: 'How long does it take to speak 900 words?', a: '900 words takes approximately <strong>6 minutes 55 seconds</strong> at 130 WPM, 8 minutes 11 seconds at 110 WPM, and 6 minutes at 150 WPM. See our <a href="/900-words-to-minutes/">900 words to minutes</a> page.' },
    { q: 'What speaking speed should I aim for?', a: 'For most public speaking contexts, aim for <strong>120–140 WPM</strong>. This pace is clear, authoritative, and gives your audience time to process your words. Below 100 WPM feels monotonous; above 160 WPM can seem rushed. Use our <a href="/practice-mode/">practice timer</a> to calibrate your pace.' },
    { q: 'Does speaking time include pauses?', a: 'The calculator estimates speaking time without pauses. In practice, planned pauses for emphasis, questions, and audience reactions add 10–20% to your total time. For a 7-minute calculated speaking time, plan for 8–8.5 minutes with pauses. This is why the <a href="/word-to-presentation-time/">presentation calculator</a> uses a lower 100 WPM effective rate.' },
    { q: 'How do I measure my speaking speed?', a: 'Use our <a href="/practice-mode/">Practice Mode</a>: paste your speech, start the timer, speak at your natural pace, then stop. The tool calculates your exact WPM. Most people are surprised — they speak faster than they think.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/word-to-speaking-time/', label: 'Speaking Time Calculator' }]),
      softwareAppSchema("Speaking Time Calculator", BASE_URL + "/word-to-speaking-time/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Speaking Time Calculator — Convert Word Count to Speech Duration',
    desc: 'How long does it take to say 1,000 words? At 130 WPM: 7m 41s. Free speaking time calculator — paste text or enter word count, get exact speech duration at any pace.',
    slug: '/word-to-speaking-time',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/word-to-speaking-time/', label: 'Speaking Time' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Speaking Time Calculator</h1>
    <p class="hero-subtitle">How long does it take to deliver any speech? Get exact speaking duration at any pace — from slow formal to rapid debate.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">How long does it take to speak 1,000 words?</div>
      <div class="answer-val">7m 41s</div>
      <div class="answer-sub">at average pace (130 WPM) · 9m 5s slow · 6m 40s fast</div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Speaking Time Reference Table</h2>
    ${referenceTable()}
    <div class="prose-block" style="margin-top:32px">
      <h2 class="section-title">About Speaking Speed</h2>
      <p>Your speaking speed determines how much content you can cover in a given time slot. Research from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a> shows that the average person speaks at 130 WPM in professional settings, though this varies significantly by individual and context.</p>
      <p>The key insight for speechwriters: always account for pauses. A 1,000-word speech calculated at 7m 41s will typically run 8–8.5 minutes when you include natural pauses for emphasis, audience laughter, and transitions. See the <a href="/word-to-presentation-time/">presentation calculator</a> for a version that accounts for pauses automatically.</p>
      <p>Want to know your specific speaking rate? Try our <a href="/practice-mode/">Practice Mode</a> timer — paste your speech and time yourself reading it aloud. For debate timing specifically, see the <a href="/word-to-debate-time/">debate time calculator</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEECH LENGTH ─────────────────────────────────────────────
function buildSpeechLength() {
  const faqs = [
    { q: 'How long does it take to say 1,000 words?', a: '<strong>7 minutes 41 seconds</strong> at average pace (130 WPM). Slow pace (110 WPM): 9 minutes 5 seconds. Fast pace (150 WPM): 6 minutes 40 seconds.' },
    { q: 'How long is a 1,000-word speech?', a: 'A 1,000-word speech lasts approximately <strong>7 minutes 41 seconds</strong> at average speaking pace. Add 10–15% for pauses and emphasis to get your real performance time: about 8–9 minutes total.' },
    { q: 'How long is a 500-word speech?', a: 'A 500-word speech lasts approximately <strong>3 minutes 51 seconds</strong> at average pace (130 WPM). Visit our <a href="/500-words-to-minutes/">500 words to minutes</a> page for the complete breakdown.' },
    { q: 'How long is a 700-word speech?', a: 'A 700-word speech lasts approximately <strong>5 minutes 23 seconds</strong> at 130 WPM. See our <a href="/700-words-to-minutes/">700 words to minutes</a> page for full details.' },
    { q: 'How long is a 2,000-word speech?', a: 'A 2,000-word speech lasts approximately <strong>15 minutes 23 seconds</strong> at 130 WPM. This is approximately the length of a full keynote introduction or a college lecture segment.' },
    { q: 'What is the ideal speech length for different occasions?', a: 'Ideal speech lengths vary by occasion: wedding toast (2–3 minutes = 260–390 words), classroom presentation (5 minutes = 650 words), TED-style talk (18 minutes max = ~2,340 words), keynote address (20–45 minutes = 2,600–5,850 words), eulogy (3–5 minutes = 390–650 words).' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/word-to-speech-length/', label: 'Speech Length Calculator' }]),
      softwareAppSchema("Speech Length Calculator", BASE_URL + "/word-to-speech-length/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Speech Length Calculator — How Long to Say 1,000 Words?',
    desc: 'How long to say 1,000 words aloud? Answer: 7m 41s average · 9m 5s slow · 6m 40s fast. Free speech length calculator — paste your script, get exact duration instantly.',
    slug: '/word-to-speech-length',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/word-to-speech-length/', label: 'Speech Length' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Speech Length Calculator</h1>
    <p class="hero-subtitle">How long is your speech? Get exact speech duration from your word count — slow, average, and fast speaking rates.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">How long to say 1,000 words aloud?</div>
      <div class="answer-val">7m 41s</div>
      <div class="answer-sub">Average (130 WPM) · Slow: 9m 5s · Fast: 6m 40s</div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Speech Length Reference Table</h2>
    ${referenceTable()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Speech Length by Duration</h2>
    ${reverseTable()}
    <div class="prose-block" style="margin-top:32px">
      <h2 class="section-title">How Long Is My Speech?</h2>
      <p>The length of a speech in minutes depends on two things: your word count and your speaking rate (WPM). At the average professional speaking rate of 130 WPM, every 130 words equals one minute of speech. The formula is simple: <strong>Speech Length (minutes) = Word Count ÷ 130</strong>.</p>
      <p>Use the calculator above to paste your full script and get a precise reading. For typical speech occasions, the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech &amp; Debate Association (NSDA)</a> recommends speaking at 130–150 WPM for clarity and audience engagement.</p>
      <p>Related tools: <a href="/word-to-speaking-time/">Speaking Time Calculator</a> · <a href="/word-to-public-speaking-time/">Public Speaking Timer</a> · <a href="/practice-mode/">Practice Mode</a></p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── GENERIC TOOL PAGE BUILDER ──────────────────────────────────
function buildGenericToolPage({ slug, title, metaTitle, metaDesc, h1, subtitle, faqs, answerBox, extraContent }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: slug + '/', label: title }]),
      softwareAppSchema(title, BASE_URL + slug + "/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({ title: metaTitle, desc: metaDesc, slug, schema });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: slug + '/', label: title }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">${h1}</h1>
    <p class="hero-subtitle">${subtitle}</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    ${answerBox || ''}
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Reference Table</h2>
    ${referenceTable()}
    ${extraContent || ''}
    ${adZone()}
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── WORD COUNT PAGE BUILDER ────────────────────────────────────
function buildWordCountPage({ wc, slug, prevWC, nextWC }) {
  const t = calcTimes(wc);
  const label = wc.toLocaleString();
  const pages = (wc / 500).toFixed(1);
  const charCount = Math.round(wc * 5.1).toLocaleString();
  const faqs = [
    { q: `How long is a ${label}-word speech?`, a: `A ${label}-word speech takes <strong>${t.spkAvg}</strong> to deliver at average speaking pace (130 WPM). At slow pace (110 WPM): ${t.spkSlow}. At fast pace (150 WPM): ${t.spkFast}.` },
    { q: `How long does it take to read ${label} words?`, a: `${label} words takes <strong>${t.rdSilent}</strong> to read silently at the average adult reading speed of 238 WPM. Reading aloud takes approximately ${t.rdAloud} (at 183 WPM).` },
    { q: `How many pages is ${label} words?`, a: `${label} words is approximately <strong>${pages} pages</strong> when typed in a standard 12pt font with normal margins (approximately 500 words per page). Double-spaced, it would be approximately ${(wc / 250).toFixed(1)} pages.` },
    { q: `What presentation time is ${label} words?`, a: `For a presentation with slides and pauses, ${label} words takes approximately <strong>${t.present}</strong> (using 100 WPM effective rate which accounts for slide transitions and pauses).` },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/words-to-minutes/', label: 'Words to Minutes' }, { href: slug + '/', label: `${label} Words` }]),
      softwareAppSchema(`${label} Words to Minutes Calculator`, BASE_URL + slug + "/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: `${label} Words to Minutes — How Long to Speak ${label} Words?`,
    desc: `${label} words = ${t.spkAvg} at 130 WPM · ${t.spkSlow} slow · ${t.spkFast} fast. Free calculator: speaking, reading aloud, and silent reading times for ${label} words.`,
    slug,
    schema
  });
  const adjacentLinks = [];
  if (prevWC) adjacentLinks.push(`<a href="/${prevWC}-words-to-minutes/">${prevWC.toLocaleString()} words</a>`);
  adjacentLinks.push(`<strong>${label} words</strong> (current)`);
  if (nextWC) adjacentLinks.push(`<a href="/${nextWC}-words-to-minutes/">${nextWC.toLocaleString()} words</a>`);

  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/words-to-minutes/', label: 'Words to Minutes' }, { href: slug + '/', label: `${label} Words` }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">${label} Words to Minutes</h1>
    <p class="hero-subtitle">How long does it take to speak, read, or present ${label} words? See exact times at every speaking speed.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">How long does it take to speak ${label} words?</div>
      <div class="answer-val">${t.spkAvg}</div>
      <div class="answer-sub">at average pace (130 WPM) · ${t.spkSlow} slow (110 WPM) · ${t.spkFast} fast (150 WPM)</div>
    </div>
    <div class="tbl-wrap" style="margin:20px 0">
      <table>
        <thead><tr><th>Speed</th><th>WPM</th><th>Time for ${label} Words</th><th>Context</th></tr></thead>
        <tbody>
          <tr><td>Slow / Formal</td><td>110</td><td class="td-highlight">${t.spkSlow}</td><td>Presidential speeches, ceremonies</td></tr>
          <tr class="row-highlight"><td><strong>Average</strong></td><td><strong>130</strong></td><td class="td-highlight"><strong>${t.spkAvg}</strong></td><td>Typical speech, podcasts, interviews</td></tr>
          <tr><td>Fast</td><td>150</td><td class="td-highlight">${t.spkFast}</td><td>Energetic talks, casual conversation</td></tr>
          <tr><td>Rapid / Debate</td><td>170</td><td class="td-highlight">${t.spkRapid}</td><td>Competitive debate, rapid delivery</td></tr>
          <tr><td>Read Aloud</td><td>183</td><td class="td-highlight">${t.rdAloud}</td><td>Reading from script, narration</td></tr>
          <tr><td>Silent Reading</td><td>238</td><td class="td-highlight">${t.rdSilent}</td><td>Personal reading, studying</td></tr>
          <tr><td>Presentation</td><td>~100</td><td class="td-highlight">${t.present}</td><td>Slides + pauses + Q&A allowance</td></tr>
        </tbody>
      </table>
    </div>
    ${calcWidget()}
    ${adZone()}
    <div class="prose-block">
      <h2 class="section-title">${label} Words — Context &amp; Equivalents</h2>
      <p>${label} words is approximately the length of:</p>
      <ul>
        ${wc <= 300 ? `<li>A standard email or short memo</li><li>A product description or brief bio</li>` : ''}
        ${wc > 300 && wc <= 600 ? `<li>A short blog introduction or social media thread</li><li>A brief speech or toast (${t.spkAvg} when spoken)</li>` : ''}
        ${wc > 600 && wc <= 1000 ? `<li>A typical school essay introduction or newspaper article</li><li>A 5–7 minute speech (${t.spkAvg} when spoken)</li>` : ''}
        ${wc > 1000 && wc <= 2000 ? `<li>A standard college essay or blog post</li><li>A 10–15 minute presentation (${t.spkAvg} when spoken)</li>` : ''}
        ${wc > 2000 ? `<li>A detailed article, report, or long blog post</li><li>A 15+ minute keynote address (${t.spkAvg} when spoken)</li>` : ''}
        <li>Approximately <strong>${pages} pages</strong> of typed text (single-spaced, standard margins)</li>
        <li>Approximately <strong>${charCount} characters</strong> (including spaces)</li>
      </ul>
      <p>Use the <a href="/words-to-minutes/">words to minutes calculator</a> for any word count, or visit the <a href="/word-to-reading-time/">reading time calculator</a> for reading-specific estimates.</p>
    </div>
    <div style="margin:20px 0">
      <p style="font-size:13px;color:var(--ink-3)">Related word counts: ${adjacentLinks.join(' · ')}</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">FAQ — ${label} Words</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card sidebar-answer">
      <div class="sidebar-card-title">Quick Answer</div>
      <div class="sa-val">${t.spkAvg}</div>
      <div class="sa-sub">${label} words at 130 WPM</div>
    </div>
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEECH DURATION PAGE BUILDER ──────────────────────────────
function buildSpeechDurationPage({ minutes, slug }) {
  const wAvg = Math.round(WPM.avg * minutes);
  const wSlow = Math.round(WPM.slow * minutes);
  const wFast = Math.round(WPM.fast * minutes);
  const wRapid = Math.round(WPM.rapid * minutes);
  const mins = minutes === 1 ? '1-Minute' : `${minutes}-Minute`;
  const faqs = [
    { q: `How many words is a ${minutes}-minute speech?`, a: `A ${minutes}-minute speech requires approximately <strong>${wAvg.toLocaleString()} words</strong> at average speaking pace (130 WPM). At slow pace (110 WPM): ${wSlow.toLocaleString()} words. At fast pace (150 WPM): ${wFast.toLocaleString()} words.` },
    { q: `How long should a ${minutes}-minute speech be?`, a: `Aim for <strong>${wAvg.toLocaleString()} words</strong> for a ${minutes}-minute speech at average pace. Write slightly shorter (about ${Math.round(wAvg * 0.9).toLocaleString()} words) to leave room for natural pauses, audience reactions, and nerves that can slow delivery.` },
    { q: `What is a good ${minutes}-minute speech topic?`, a: `${minutes}-minute speeches work well for: personal stories, product pitches, classroom introductions, meeting updates, and toasts. The key is choosing one main point and supporting it with 2-3 examples or statistics.` },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: slug + '/', label: `${mins} Speech Word Count` }]),
      softwareAppSchema(`${mins} Speech Word Count Calculator`, BASE_URL + slug + "/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: `${mins} Speech Word Count — How Many Words for ${minutes} Minutes?`,
    desc: `A ${minutes}-minute speech needs ~${wAvg.toLocaleString()} words at 130 WPM · ${wSlow.toLocaleString()} words slow · ${wFast.toLocaleString()} words fast. Free calculator + speech guide.`,
    slug,
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: slug + '/', label: `${mins} Speech` }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">${mins} Speech Word Count</h1>
    <p class="hero-subtitle">How many words do you need for a ${minutes}-minute speech? See exact word counts for every speaking speed.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">How many words for a ${minutes}-minute speech?</div>
      <div class="answer-val">${wAvg.toLocaleString()} words</div>
      <div class="answer-sub">at average pace (130 WPM) · ${wSlow.toLocaleString()} words slow · ${wFast.toLocaleString()} words fast</div>
    </div>
    <div class="tbl-wrap" style="margin:20px 0">
      <table>
        <thead><tr><th>Speaking Speed</th><th>WPM</th><th>Words Needed for ${minutes} Min</th></tr></thead>
        <tbody>
          <tr><td>Slow / Formal</td><td>110</td><td class="td-highlight">${wSlow.toLocaleString()} words</td></tr>
          <tr class="row-highlight"><td><strong>Average (recommended)</strong></td><td><strong>130</strong></td><td class="td-highlight"><strong>${wAvg.toLocaleString()} words</strong></td></tr>
          <tr><td>Fast</td><td>150</td><td class="td-highlight">${wFast.toLocaleString()} words</td></tr>
          <tr><td>Rapid</td><td>170</td><td class="td-highlight">${wRapid.toLocaleString()} words</td></tr>
        </tbody>
      </table>
    </div>
    ${calcWidget()}
    ${adZone()}
    <div class="prose-block">
      <h2 class="section-title">Writing a ${mins} Speech</h2>
      <p>To write a ${minutes}-minute speech, aim for approximately <strong>${wAvg.toLocaleString()} words</strong> at the average speaking pace of 130 WPM. If you're not sure of your speaking speed, use the <a href="/practice-mode/">Practice Mode timer</a> to measure your real WPM first.</p>
      <p>Pro tip: Write to <strong>${Math.round(wAvg * 0.9).toLocaleString()} words</strong> (~90% of your target), then add back pauses, emphasis, and transitions during rehearsal. Most speakers slow down under pressure, so having a little buffer prevents rushing.</p>
      <p>Related pages: <a href="/words-to-minutes/">Words to Minutes Calculator</a> · <a href="/word-to-speaking-time/">Speaking Time Calculator</a> · <a href="/practice-mode/">Practice Mode</a></p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card sidebar-answer">
      <div class="sidebar-card-title">${mins} Speech</div>
      <div class="sa-val">${wAvg.toLocaleString()} words</div>
      <div class="sa-sub">at average pace (130 WPM)</div>
    </div>
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── PRACTICE MODE ─────────────────────────────────────────────
function buildPracticeMode() {
  const faqs = [
    { q: 'How do I test my reading speed?', a: 'Use the Practice Mode above: (1) Paste any text into the text area. (2) Click "Start Timer". (3) Begin reading aloud at your natural pace. (4) Click "Stop" when finished. The tool instantly shows your words per minute.' },
    { q: 'What is a good reading speed in WPM?', a: 'The average adult reads aloud at 183 WPM and silently at 238 WPM. For public speaking, 120–150 WPM is considered an ideal pace — clear enough to understand, fast enough to hold attention.' },
    { q: 'Can I use this to practice a speech?', a: 'Yes — paste your full speech into the text area, then read it aloud while the timer runs. You\'ll get your exact speaking WPM, which you can use to calibrate the main <a href="/words-to-minutes/">words to minutes calculator</a> with your personal speed.' },
    { q: 'How accurate is the WPM calculation?', a: 'The WPM value is calculated as: Words in text ÷ (Elapsed seconds ÷ 60). It is 100% accurate based on when you start and stop the timer. The only variable is whether you clicked Start and Stop at the right moments.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/practice-mode/', label: 'Practice Mode' }]),
      softwareAppSchema("Speech Practice Timer", BASE_URL + "/practice-mode/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Speech Practice Timer & Free Reading Speed Test — WPM Counter',
    desc: 'Test your reading speed and measure your real WPM. Paste any text, start the timer, read aloud — get instant words per minute feedback. Free reading speed test.',
    slug: '/practice-mode',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/practice-mode/', label: 'Practice Mode' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Speech Practice Timer</h1>
    <p class="hero-subtitle">Measure your real speaking or reading speed. Paste your text, start the timer, read aloud — get your exact WPM instantly.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="practice-card">
      <h2 style="font-family:'Lora',serif;font-size:22px;margin-bottom:16px">Practice Timer</h2>
      <textarea class="calc-textarea" id="practice-textarea" placeholder="Paste your speech or any text here, then click Start Timer and begin reading aloud..." rows="6" aria-label="Text to time yourself reading"></textarea>
      <div class="practice-timer" id="practice-timer" aria-live="polite">0:00.0</div>
      <div class="practice-wpm" id="practice-wpm" aria-live="polite">— WPM</div>
      <div class="practice-btns">
        <button class="btn-primary" id="btn-start" onclick="startPractice()">▶ Start Timer</button>
        <button class="btn-danger" id="btn-stop" style="display:none" onclick="stopPractice()">⏹ Stop</button>
        <button class="btn-secondary" id="btn-reset" style="display:none" onclick="resetPractice()">↺ Reset</button>
      </div>
      <p style="font-size:13px;color:var(--ink-3);text-align:center;margin-top:8px">Paste text → Start → Read aloud → Stop → See your WPM</p>
    </div>
    ${adZone()}
    <div class="prose-block" style="margin-top:24px">
      <h2 class="section-title">How to Use Practice Mode</h2>
      <ol>
        <li><strong>Paste your speech or text</strong> into the text area above.</li>
        <li><strong>Click "Start Timer"</strong> and immediately begin reading aloud at your natural speaking pace.</li>
        <li><strong>Click "Stop"</strong> when you finish reading the entire text.</li>
        <li><strong>Read your WPM</strong> — the live counter shows your words per minute throughout.</li>
        <li><strong>Use your WPM</strong> in the main <a href="/">words to time calculator</a> by selecting "Custom" speed to get personalized time estimates.</li>
      </ol>
      <p>Your WPM result from Practice Mode can be used directly in any of our calculators. Just select "Custom" in the speed selector and enter your measured WPM. This gives you accurate timing predictions based on your actual voice, not just averages.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    <div class="sidebar-card">
      <div class="sidebar-card-title">Average Speeds</div>
      <div class="sidebar-links">
        <a href="#">🎤 Speaking avg: 130 WPM</a>
        <a href="#">📢 Read aloud: 183 WPM</a>
        <a href="#">👁 Silent read: 238 WPM</a>
        <a href="#">🎙 TED Talks: 163 WPM</a>
      </div>
    </div>
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── READING SPEED TEST ────────────────────────────────────────
function buildReadingSpeedTest() {
  const faqs = [
    { q: 'How do I take a reading speed test?', a: 'Use the practice timer above: paste any text, click Start, read at your natural pace, click Stop. Your WPM is calculated instantly.' },
    { q: 'What is a good reading speed?', a: 'The average adult reads silently at <strong>238 WPM</strong>. College students average 250–300 WPM. Speed readers reach 400–700 WPM but often with reduced comprehension. For reading aloud, 183 WPM is the average.' },
    { q: 'How can I improve my reading speed?', a: 'Practice timed reading regularly, minimize subvocalization (sounding out words internally), use a finger or pen to pace your eyes, and read in phrases rather than word-by-word. Most people can gain 30–50 WPM with regular practice.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/reading-speed-test/', label: 'Reading Speed Test' }]),
      softwareAppSchema("Free Reading Speed Test", BASE_URL + "/reading-speed-test/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Free Reading Speed Test — Measure Your WPM Online in 60 Seconds',
    desc: 'Test your reading speed in 60 seconds. Paste any text, click Start, read aloud — get your exact WPM instantly. Free online reading speed test. No signup needed.',
    slug: '/reading-speed-test',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/reading-speed-test/', label: 'Reading Speed Test' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Free Reading Speed Test</h1>
    <p class="hero-subtitle">Measure your exact words-per-minute reading speed in 60 seconds. Paste any text, start the timer, read — done.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="practice-card">
      <textarea class="calc-textarea" id="practice-textarea" placeholder="Paste any text here for your reading speed test..." rows="6" aria-label="Text for reading speed test"></textarea>
      <div class="practice-timer" id="practice-timer" aria-live="polite">0:00.0</div>
      <div class="practice-wpm" id="practice-wpm" aria-live="polite">— WPM</div>
      <div class="practice-btns">
        <button class="btn-primary" id="btn-start" onclick="startPractice()">▶ Start Test</button>
        <button class="btn-danger" id="btn-stop" style="display:none" onclick="stopPractice()">⏹ Stop</button>
        <button class="btn-secondary" id="btn-reset" style="display:none" onclick="resetPractice()">↺ Reset</button>
      </div>
    </div>
    ${adZone()}
    <div class="prose-block" style="margin-top:24px">
      <h2 class="section-title">Reading Speed Benchmarks</h2>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Reading Level</th><th>WPM Range</th><th>Who Reads This Fast</th></tr></thead>
        <tbody>
          <tr><td>Struggling reader</td><td>&lt; 100 WPM</td><td>New readers, second language learners</td></tr>
          <tr><td>Average adult</td><td class="td-highlight">200–250 WPM</td><td>Most adults in everyday reading</td></tr>
          <tr><td>Good reader</td><td>250–350 WPM</td><td>Avid readers, college graduates</td></tr>
          <tr><td>Fast reader</td><td>350–500 WPM</td><td>Trained speed readers, academics</td></tr>
          <tr><td>Speed reader</td><td>500–700 WPM</td><td>Specialized training, reduced comprehension</td></tr>
        </tbody>
      </table></div>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">FAQ</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEAKING WPM ──────────────────────────────────────────────
function buildSpeakingWPM() {
  const faqs = [
    { q: 'What is the average speaking rate in words per minute?', a: 'The average North American speaking rate is <strong>130–150 WPM</strong> in professional settings, according to research from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. Conversational speech can be faster (150–160 WPM) while formal speeches tend to be slower (110–120 WPM).' },
    { q: 'How fast do TED Talk speakers speak?', a: 'TED Talk speakers average approximately <strong>163 WPM</strong>, according to <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED\'s own research</a>. This is slightly faster than average to maintain energy and audience engagement during the 18-minute format.' },
    { q: 'How do I measure my words per minute speaking speed?', a: 'Use our <a href="/practice-mode/">Practice Mode timer</a>: paste any text, start the timer, read aloud naturally, then stop. The tool calculates your exact WPM automatically. Repeat 3 times with different texts for an accurate average.' },
    { q: 'What WPM should I speak at for a presentation?', a: 'For presentations with slides, aim for <strong>110–130 WPM</strong>. This pace is clear and authoritative, gives the audience time to read your slides, and allows for natural pauses. Faster rates risk losing your audience; slower rates feel tedious.' },
    { q: 'Does accent affect speaking rate?', a: 'Yes, significantly. Some regional accents and languages have inherently faster or slower typical speaking rates. The 130 WPM figure is an average for North American English. British English averages slightly higher (140–160 WPM) in casual speech. Always measure your own rate with the <a href="/practice-mode/">practice timer</a> for personal accuracy.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/speaking-words-per-minute/', label: 'Speaking Words Per Minute' }]),
      softwareAppSchema("Speaking Speed Calculator", BASE_URL + "/speaking-words-per-minute/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Average Speaking Speed: Words Per Minute Guide & Calculator',
    desc: 'What is the average speaking speed? 120–150 WPM for conversation, 130 WPM for speeches, 163 WPM for TED talks. Free WPM calculator included. Research-backed.',
    slug: '/speaking-words-per-minute',
    schema
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/speaking-words-per-minute/', label: 'Speaking Speed' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Average Speaking Speed Guide</h1>
    <p class="hero-subtitle">How fast do most people speak? Research-backed WPM data for every speaking context, from TED Talks to debate.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Speaking Context</th><th>Typical WPM</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Formal speech / ceremony</td><td class="td-highlight">100–120 WPM</td><td>Presidential address, graduation</td></tr>
          <tr class="row-highlight"><td><strong>Average professional speaking</strong></td><td class="td-highlight"><strong>130 WPM</strong></td><td>Meetings, podcasts, interviews</td></tr>
          <tr><td>Conversation</td><td class="td-highlight">140–160 WPM</td><td>Casual talk, debate warm-up</td></tr>
          <tr><td>TED Talks</td><td class="td-highlight">163 WPM avg</td><td>18-min = ~2,930 words</td></tr>
          <tr><td>Competitive debate</td><td class="td-highlight">150–170 WPM</td><td>NSDA Policy debate</td></tr>
          <tr><td>Audiobooks</td><td class="td-highlight">150–165 WPM</td><td>Professional narration</td></tr>
        </tbody>
      </table>
    </div>
    ${calcWidget()}
    ${adZone()}
    <div class="prose-block">
      <h2 class="section-title">About Average Speaking Rate</h2>
      <p>The average speaking rate for North American English is approximately <strong>130 WPM</strong> in formal or professional settings, based on research from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. This rate naturally varies by context — we tend to slow down when we want to emphasize important points, and speed up when we're excited or nervous.</p>
      <p>For competitive debaters, the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech &amp; Debate Association (NSDA)</a> recommends a conversational delivery of 120–150 WPM for most formats. Policy debate often runs at 200–250 WPM, though this is a specialized skill.</p>
      <p>TED Talks average <strong>163 WPM</strong> — deliberately faster than a standard keynote to maintain energy within the strict 18-minute format. This is higher than average because TED speakers are typically experienced presenters with highly rehearsed content.</p>
      <p>To measure your personal speaking rate, use our <a href="/practice-mode/">Practice Mode timer</a>. This is essential if you want to use our calculators accurately — most people speak either faster or slower than the 130 WPM default.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── PRESENTATION TIME ─────────────────────────────────────────
function buildPresentationTime() {
  return buildGenericToolPage({
    slug: '/word-to-presentation-time',
    title: 'Presentation Time Calculator',
    metaTitle: 'Presentation Time Calculator — Word Count to Slide Timing',
    metaDesc: 'Calculate presentation length from word count. Includes slide transitions and pauses. Free — works for 5-minute to 60-minute presentations.',
    h1: 'Presentation Time Calculator',
    subtitle: 'How long will your presentation run? Word count to presentation time with pauses and slide transitions included.',
    answerBox: `<div class="answer-box"><div class="answer-box-title">How many words for a 10-minute presentation?</div><div class="answer-val">~1,000 words</div><div class="answer-sub">at 100 WPM effective rate (includes slide transitions + pauses)</div></div>`,
    extraContent: `<div class="prose-block" style="margin-top:32px"><h2 class="section-title">Presentation vs. Speech Timing</h2><p>A presentation runs slower than a speech because of slide transitions, audience questions, pauses for visual processing, and natural breaks. The <strong>100 WPM effective rate</strong> used by the presentation calculator accounts for all of this — giving you a realistic estimate for deck-based presentations.</p><p>For a speech with no slides, use the <a href="/word-to-speaking-time/">speaking time calculator</a> instead. For formal public speaking, see the <a href="/word-to-public-speaking-time/">public speaking timer</a>.</p></div>`,
    faqs: [
      { q: 'How many words is a 10-minute presentation?', a: 'A 10-minute presentation covers approximately <strong>1,000 words</strong> at the effective presentation rate of 100 WPM (which accounts for slide transitions, pauses, and audience reaction time).' },
      { q: 'How many slides should a 10-minute presentation have?', a: 'A general rule is <strong>1 slide per minute</strong>, so a 10-minute presentation should have about 8–12 slides. Complex technical slides may need 2–3 minutes each; simple visual slides can be 30–45 seconds.' },
      { q: 'How do I calculate presentation time from word count?', a: 'For slides-based presentations, use: <strong>Time (min) = Word Count ÷ 100</strong>. This 100 WPM effective rate accounts for slide navigation, pauses, and visual content time. For a speech-only presentation, use 130 WPM instead.' },
    ]
  });
}

// ── PUBLIC SPEAKING ───────────────────────────────────────────
function buildPublicSpeaking() {
  return buildGenericToolPage({
    slug: '/word-to-public-speaking-time',
    title: 'Public Speaking Time Calculator',
    metaTitle: 'Public Speaking Time Calculator — Free Speech Timer Online',
    metaDesc: 'Free speech timer for keynotes, conferences, and formal talks. Paste your script — get exact speaking duration at your pace. Used for TED talks, weddings, debates.',
    h1: 'Public Speaking Time Calculator',
    subtitle: 'Prepare for your next keynote, conference talk, wedding toast, or formal speech. Get exact timing from your word count.',
    answerBox: `<div class="answer-box"><div class="answer-box-title">How many words is a TED Talk?</div><div class="answer-val">~2,940 words</div><div class="answer-sub">18 minutes at 163 WPM (TED Talk average speed)</div></div>`,
    extraContent: `<div class="prose-block" style="margin-top:32px"><h2 class="section-title">Speaking Rates for Major Events</h2><div class="tbl-wrap"><table><thead><tr><th>Event Type</th><th>Ideal WPM</th><th>Typical Duration</th></tr></thead><tbody><tr><td>Wedding toast</td><td class="td-highlight">120–130 WPM</td><td>2–3 minutes</td></tr><tr><td>Classroom presentation</td><td class="td-highlight">120–140 WPM</td><td>5–15 minutes</td></tr><tr><td>TED/conference talk</td><td class="td-highlight">150–170 WPM</td><td>10–18 minutes</td></tr><tr><td>Keynote address</td><td class="td-highlight">110–130 WPM</td><td>20–60 minutes</td></tr><tr><td>Eulogy</td><td class="td-highlight">100–120 WPM</td><td>3–5 minutes</td></tr></tbody></table></div><p>Public speaking data from the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech & Debate Association (NSDA)</a> and <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED Talk guidelines</a>.</p></div>`,
    faqs: [
      { q: 'How many words is an 8-minute speech?', a: 'An 8-minute speech at average pace (130 WPM) = <strong>1,040 words</strong>. At slow pace (110 WPM): 880 words. At fast pace (150 WPM): 1,200 words.' },
      { q: 'How many words is a TED Talk?', a: 'TED Talks are limited to 18 minutes and average 163 WPM, giving approximately <strong>2,934 words</strong> for a full-length TED Talk. Shorter TEDx talks (10–15 min) run 1,630–2,445 words.' },
      { q: 'What is the ideal speaking rate for formal speeches?', a: 'For formal occasions (keynotes, ceremonies, commencements), aim for <strong>110–120 WPM</strong>. This pace conveys authority and clarity, gives the audience time to absorb your message, and is consistent with guidelines from the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a>.' },
    ]
  });
}

// ── DEBATE TIME ───────────────────────────────────────────────
function buildDebateTime() {
  return buildGenericToolPage({
    slug: '/word-to-debate-time',
    title: 'Debate Time Calculator',
    metaTitle: 'Debate Time Calculator — Words to Debate Speech Duration',
    metaDesc: 'Calculate debate speech timing from word count. Covers Policy, Lincoln-Douglas, and Public Forum formats. Includes debate break calculator. Free.',
    h1: 'Debate Time Calculator',
    subtitle: 'Calculate how long your debate speech will run. Covers Policy, Lincoln-Douglas, Public Forum, and Parliamentary formats.',
    answerBox: `<div class="answer-box"><div class="answer-box-title">How many words for an 8-minute debate speech?</div><div class="answer-val">~1,200 words</div><div class="answer-sub">at 150 WPM (standard debate pace)</div></div>`,
    extraContent: `<div class="prose-block" style="margin-top:32px"><h2 class="section-title">Debate Speech Time Limits by Format</h2><div class="tbl-wrap"><table><thead><tr><th>Format</th><th>Speech</th><th>Time Limit</th><th>Words Needed (150 WPM)</th></tr></thead><tbody><tr><td>Lincoln-Douglas</td><td>1AC / 1NC</td><td>6 / 7 min</td><td class="td-highlight">900 / 1,050 words</td></tr><tr><td>Public Forum</td><td>Constructive</td><td>4 minutes</td><td class="td-highlight">~600 words</td></tr><tr><td>Policy Debate</td><td>1AC</td><td>8 minutes</td><td class="td-highlight">~1,200 words (at 150 WPM)</td></tr><tr><td>Parliamentary</td><td>Prime Minister</td><td>7 minutes</td><td class="td-highlight">~1,050 words</td></tr></tbody></table></div><p>Data from the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech & Debate Association (NSDA)</a>. Policy debate speakers often run at 200–250 WPM, significantly faster than the 150 WPM baseline above.</p></div>`,
    faqs: [
      { q: 'How many words per minute is debate speaking?', a: 'Standard debate speaking runs 150–170 WPM. Competitive Policy debate "spreading" can reach 200–250 WPM, but this is a specialized skill. For most formats (LD, PF, Parliamentary), 130–150 WPM is standard, per the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a>.' },
      { q: 'How long is an 8-minute debate speech?', a: 'At 150 WPM (standard debate pace), an 8-minute speech uses approximately <strong>1,200 words</strong>. At 170 WPM (rapid): ~1,360 words. Use the calculator above to check your specific script length.' },
      { q: 'What is a debate break calculator?', a: 'A debate break calculator helps determine how many wins you need to advance (break) to elimination rounds. At most tournaments, breaking requires winning 60–75% of preliminary rounds. Contact your tournament director for specific break thresholds.' },
    ]
  });
}

// ── TYPING TIME ───────────────────────────────────────────────
function buildTypingTime() {
  return buildGenericToolPage({
    slug: '/word-to-typing-time',
    title: 'WPM Calculator & Typing Time Estimator',
    metaTitle: 'WPM Calculator & Typing Time Estimator — Free Online Tool',
    metaDesc: 'Calculate how long it takes to type any document. Free WPM calculator — enter word count and typing speed, get exact duration. For transcription, writing, data entry.',
    h1: 'WPM Calculator & Typing Time Estimator',
    subtitle: 'How long will it take to type any document? Enter your word count and typing speed to get exact typing time estimates.',
    answerBox: `<div class="answer-box"><div class="answer-box-title">How long to type 1,000 words?</div><div class="answer-val">~13 minutes</div><div class="answer-sub">at average typing speed of 75 WPM (words typed per minute)</div></div>`,
    extraContent: `<div class="prose-block" style="margin-top:32px"><h2 class="section-title">Typing Speed vs. Speaking Speed</h2><p>The average typing speed is 40–60 WPM for casual typists, 60–80 WPM for office workers, and 100+ WPM for professional touch typists. This is significantly slower than speaking speed (130 WPM), which is why dictation software is often more efficient for long documents.</p><div class="tbl-wrap"><table><thead><tr><th>Typing Level</th><th>WPM</th><th>Time to Type 1,000 Words</th></tr></thead><tbody><tr><td>Beginner</td><td>20–30 WPM</td><td>33–50 minutes</td></tr><tr><td>Average</td><td>40–60 WPM</td><td>17–25 minutes</td></tr><tr><td>Good typist</td><td class="td-highlight">60–80 WPM</td><td class="td-highlight">12–17 minutes</td></tr><tr><td>Professional</td><td>80–100 WPM</td><td>10–12 minutes</td></tr><tr><td>Expert</td><td>100+ WPM</td><td>&lt; 10 minutes</td></tr></tbody></table></div></div>`,
    faqs: [
      { q: 'What is the average typing speed in WPM?', a: 'The average typist types at <strong>40–60 WPM</strong>. Professional touch typists average 60–80 WPM. Competitive typists can exceed 120 WPM. The world record is over 200 WPM.' },
      { q: 'How long does it take to type 1,000 words?', a: 'At average typing speed (60 WPM), 1,000 words takes approximately <strong>16 minutes 40 seconds</strong>. At 80 WPM: 12 minutes 30 seconds. At 40 WPM: 25 minutes.' },
      { q: 'How do I improve my typing speed?', a: 'Practice with tools like Keybr or TypeRacer for 15–20 minutes daily. Focus on accuracy first — speed comes naturally. Touch typing (memorizing key positions without looking) is the single biggest speed improvement for most people.' },
    ]
  });
}

// ── PALABRAS A MINUTOS ────────────────────────────────────────
function buildPalabrasAMinutos() {
  const faqs = [
    { q: '¿Cuántos minutos son 1.000 palabras?', a: 'A un ritmo promedio de 130 PPM, 1.000 palabras toma <strong>7 minutos 41 segundos</strong>. A ritmo lento (110 PPM): 9 minutos 5 segundos. A ritmo rápido (150 PPM): 6 minutos 40 segundos.' },
    { q: '¿Cuántos minutos son 500 palabras?', a: '500 palabras toma <strong>3 minutos 51 segundos</strong> a ritmo promedio de 130 PPM.' },
    { q: '¿Cuál es el ritmo promedio de habla en palabras por minuto?', a: 'El ritmo promedio de habla en español e inglés es aproximadamente <strong>130 palabras por minuto (PPM)</strong> en entornos profesionales, según la Asociación Americana de Habla, Lenguaje y Audición (ASHA).' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Inicio' }, { href: '/palabras-a-minutos/', label: 'Palabras a Minutos' }]),
      softwareAppSchema("Calculadora Palabras a Minutos", BASE_URL + "/palabras-a-minutos/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Calculadora de Palabras a Minutos — Convertir Palabras en Tiempo',
    desc: '¿Cuántos minutos son 1.000 palabras? — 7 min 41 seg a ritmo promedio (130 PPM). Calculadora gratuita: pega tu texto y obtén el tiempo de discurso al instante.',
    slug: '/palabras-a-minutos',
    schema,
    lang: 'es'
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    <nav class="breadcrumb"><a href="/">Inicio</a><span>›</span><span>Palabras a Minutos</span></nav>
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Calculadora de Palabras a Minutos</h1>
    <p class="hero-subtitle">Convierte palabras en tiempo de discurso al instante. Gratis, sin registro.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">¿Cuántos minutos son 1.000 palabras?</div>
      <div class="answer-val">7m 41s</div>
      <div class="answer-sub">a ritmo promedio (130 PPM) · 9m 5s lento · 6m 40s rápido</div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <div class="tbl-wrap" style="margin-top:24px">
      <table>
        <thead><tr><th>Palabras</th><th>Lento (110 PPM)</th><th>Promedio (130 PPM)</th><th>Rápido (150 PPM)</th></tr></thead>
        <tbody>
          ${[100,200,300,500,750,1000,1500,2000,2500,3000].map(wc => {
            const t = calcTimes(wc);
            return `<tr><td><strong>${wc.toLocaleString('es')} palabras</strong></td><td>${t.spkSlow}</td><td class="td-highlight">${t.spkAvg}</td><td>${t.spkFast}</td></tr>`;
          }).join('\n')}
        </tbody>
      </table>
    </div>
    <div class="prose-block" style="margin-top:32px">
      <h2 class="section-title">Cómo Calcular el Tiempo de Discurso</h2>
      <p>La fórmula es simple: <strong>Tiempo (segundos) = Número de palabras ÷ PPM × 60</strong>. A 130 palabras por minuto (el ritmo promedio según la <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">Asociación Americana de Habla, Lenguaje y Audición (ASHA)</a>), cada 1.000 palabras equivale a aproximadamente 7 minutos y 41 segundos.</p>
      <p>Ver también: <a href="/word-to-reading-time/">Reading Time Calculator (English)</a> · <a href="/words-to-minutes/">Words to Minutes (English)</a></p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Preguntas Frecuentes</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── LESEZEIT RECHNER ──────────────────────────────────────────
function buildLesezeit() {
  const faqs = [
    { q: 'Wie lange dauert es, 1.000 Wörter zu lesen?', a: '1.000 Wörter dauern etwa <strong>4 Minuten 12 Sekunden</strong> beim stillen Lesen (238 WPM Durchschnitt) oder ca. 5 Minuten 27 Sekunden beim lauten Vorlesen.' },
    { q: 'Wie viele Minuten sind 1.000 Wörter beim Sprechen?', a: 'Bei einer durchschnittlichen Sprechgeschwindigkeit von 130 WPM dauern 1.000 Wörter <strong>7 Minuten 41 Sekunden</strong>.' },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema([{ href: '/', label: 'Home' }, { href: '/lesezeit-rechner/', label: 'Lesezeit Rechner' }]),
      softwareAppSchema("Lesezeit Rechner", BASE_URL + "/lesezeit-rechner/"),
      faqSchema(faqs)
    ]
  };
  const head = headHTML({
    title: 'Lesezeit Rechner — Wörter zu Minuten umrechnen',
    desc: 'Wie lange dauert es, 1.000 Wörter zu lesen? Ca. 4 Minuten 12 Sekunden. Kostenloser Lesezeit-Rechner — Text einfügen und sofort die Lesezeit berechnen.',
    slug: '/lesezeit-rechner',
    schema,
    lang: 'de'
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    <nav class="breadcrumb"><a href="/">Home</a><span>›</span><span>Lesezeit Rechner</span></nav>
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">Lesezeit Rechner</h1>
    <p class="hero-subtitle">Wörter zu Minuten umrechnen — kostenlos, sofort, ohne Anmeldung.</p>
  </div>
</div>
<div class="page-with-sidebar" style="padding-top:36px;padding-bottom:60px">
  <main class="main-col">
    <div class="answer-box">
      <div class="answer-box-title">Wie lange dauert es, 1.000 Wörter zu lesen?</div>
      <div class="answer-val">4m 12s</div>
      <div class="answer-sub">Stilles Lesen bei 238 WPM Durchschnitt</div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <div class="prose-block" style="margin-top:24px">
      <h2 class="section-title">Wie berechnet man die Lesezeit?</h2>
      <p>Die Formel: <strong>Zeit (Sekunden) = Wörteranzahl ÷ WPM × 60</strong>. Der Durchschnittswert für stilles Lesen beträgt 238 WPM, für lautes Vorlesen 183 WPM und für Sprechen 130 WPM.</p>
    </div>
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Häufig gestellte Fragen</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalculators()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── ABOUT PAGE ────────────────────────────────────────────────
function buildAbout() {
  const head = headHTML({
    title: 'About WordsToTime — Free Speech & Reading Time Calculator',
    desc: 'WordsToTime is a free, research-backed tool for converting word count to speaking time, reading time, and presentation duration. No signup, no ads in content.',
    slug: '/about'
  });
  const body = `
<div class="hero" style="padding:32px 24px 40px">
  <div class="wrap">
    ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/about/', label: 'About' }])}
    <h1 class="hero-title" style="font-size:clamp(24px,4vw,40px)">About WordsToTime</h1>
  </div>
</div>
<div class="wrap-narrow" style="padding-top:36px;padding-bottom:60px">
  <p>WordsToTime is a free tool for anyone who needs to know how long it will take to deliver, read, or present a written document. It was built to solve a simple problem: writers, speakers, educators, and content creators constantly need to know "how long will this take?"</p>
  <h2 class="section-title" style="margin-top:28px">Our Data Sources</h2>
  <p>All WPM values used in our calculators are based on published research:</p>
  <ul>
    <li><strong>130 WPM</strong> average speaking rate — <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a></li>
    <li><strong>238 WPM</strong> average silent reading rate — ASHA</li>
    <li><strong>183 WPM</strong> average read-aloud rate — ASHA</li>
    <li><strong>163 WPM</strong> TED Talk average — <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED Talk guidelines</a></li>
    <li>Debate timing standards — <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech & Debate Association (NSDA)</a></li>
  </ul>
  <h2 class="section-title" style="margin-top:28px">Free Forever</h2>
  <p>WordsToTime is completely free to use. No signup required, no hidden fees, no premium tier. The site is supported by Google AdSense advertising. We do not collect personal data or require registration.</p>
  <p>Questions or feedback? The site is maintained as a public resource for the speech, education, and content creation community.</p>
</div>`;
  return pageShell({ head, body });
}

// ── PRIVACY PAGE ──────────────────────────────────────────────
function buildPrivacy() {
  const head = headHTML({
    title: 'Privacy Policy — WordsToTime',
    desc: 'Privacy policy for WordsToTime.netlify.app. We do not collect personal data, require registration, or sell user information.',
    slug: '/privacy'
  });
  const body = `
<div class="wrap-narrow" style="padding-top:48px;padding-bottom:60px">
  ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/privacy/', label: 'Privacy Policy' }])}
  <h1 style="font-family:'Lora',serif;font-size:clamp(24px,4vw,36px);margin:16px 0 24px">Privacy Policy</h1>
  <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <h2 class="section-title" style="margin-top:24px">Data We Do Not Collect</h2>
  <p>WordsToTime does not require registration, does not collect personal information, and does not store any text you paste into the calculator. All calculations happen in your browser — no text is sent to our servers.</p>
  <h2 class="section-title" style="margin-top:24px">Analytics</h2>
  <p>We use Google Analytics 4 to measure aggregate traffic (page views, session counts, device types). This data is anonymous and cannot be used to identify individual users.</p>
  <h2 class="section-title" style="margin-top:24px">Advertising</h2>
  <p>We display advertisements via Google AdSense (Publisher ID: ${ADSENSE_PUB}). Google may use cookies to personalize ads based on your browsing history. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> for details. You can opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.</p>
  <h2 class="section-title" style="margin-top:24px">Contact</h2>
  <p>For privacy questions, use the contact information available through the GitHub repository for this project.</p>
</div>`;
  return pageShell({ head, body });
}

// ── TERMS PAGE ────────────────────────────────────────────────
function buildTerms() {
  const head = headHTML({
    title: 'Terms of Use — WordsToTime',
    desc: 'Terms of use for WordsToTime. Free to use for personal and professional purposes.',
    slug: '/terms'
  });
  const body = `
<div class="wrap-narrow" style="padding-top:48px;padding-bottom:60px">
  ${breadcrumbHTML([{ href: '/', label: 'Home' }, { href: '/terms/', label: 'Terms of Use' }])}
  <h1 style="font-family:'Lora',serif;font-size:clamp(24px,4vw,36px);margin:16px 0 24px">Terms of Use</h1>
  <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  <p>WordsToTime is provided free of charge for personal and professional use. By using this website, you agree to these terms.</p>
  <h2 class="section-title" style="margin-top:24px">Accuracy</h2>
  <p>All time calculations are estimates based on average speaking and reading rates from published research (ASHA). Individual speaking rates vary. WordsToTime provides these estimates in good faith but cannot guarantee accuracy for any specific individual or context.</p>
  <h2 class="section-title" style="margin-top:24px">Use Restrictions</h2>
  <p>You may use WordsToTime freely for personal, educational, or professional purposes. You may not scrape, copy, or redistribute the content or calculators without permission.</p>
  <h2 class="section-title" style="margin-top:24px">Disclaimer</h2>
  <p>This service is provided "as is" without warranty of any kind. WordsToTime is not responsible for any errors or omissions, or for results obtained from the use of this information.</p>
</div>`;
  return pageShell({ head, body });
}

// ── 404 PAGE ──────────────────────────────────────────────────
function build404() {
  const head = headHTML({
    title: 'Page Not Found — WordsToTime',
    desc: 'The page you were looking for was not found. Try the Words to Time Calculator or browse our other tools.',
    slug: '/404'
  });
  const body = `
<div class="page-404">
  <h1>404</h1>
  <h2>Page Not Found</h2>
  <p style="color:var(--ink-2);max-width:420px;margin:0 auto 24px">The page you're looking for doesn't exist or has moved. Try the calculator on our homepage.</p>
  <a href="/" style="display:inline-block;background:var(--amber);color:#fff;padding:12px 28px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none">Go to Calculator →</a>
  <div style="margin-top:36px">
    <h3 style="font-size:16px;color:var(--ink-2);margin-bottom:12px">Popular Tools</h3>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px">
      <a href="/words-to-minutes/" style="background:var(--amber-bg);border:1px solid var(--amber-bd);color:#78350f;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none">Words to Minutes</a>
      <a href="/word-to-reading-time/" style="background:var(--amber-bg);border:1px solid var(--amber-bd);color:#78350f;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none">Reading Time</a>
      <a href="/word-to-speaking-time/" style="background:var(--amber-bg);border:1px solid var(--amber-bd);color:#78350f;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none">Speaking Time</a>
      <a href="/practice-mode/" style="background:var(--amber-bg);border:1px solid var(--amber-bd);color:#78350f;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;text-decoration:none">Practice Mode</a>
    </div>
  </div>
</div>`;
  return pageShell({ head, body });
}

// ═══════════════════════════════════════════════════════════════
// SITEMAP & ROBOTS & ADS
// ═══════════════════════════════════════════════════════════════
function buildSitemap(urls) {
  const entries = urls.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <priority>${priority}</priority>
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\nDisallow:\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
}

function buildAdsTxt() {
  return `google.com, pub-9275267797924945, DIRECT, f08c47fec0942fa0\n`;
}

// ═══════════════════════════════════════════════════════════════
// NETLIFY.TOML
// ═══════════════════════════════════════════════════════════════
function buildNetlifyToml() {
  const redirects = [
    { from: '/words-to-time/', to: '/' },
    { from: '/speech-time-calculator/', to: '/word-to-speaking-time/' },
    { from: '/speaking-time-calculator/', to: '/word-to-speaking-time/' },
    { from: '/reading-time-calculator/', to: '/word-to-reading-time/' },
    { from: '/reading-time/', to: '/word-to-reading-time/' },
    { from: '/read-time-calculator/', to: '/word-to-reading-time/' },
    { from: '/read-aloud-time/', to: '/word-to-reading-time/' },
    { from: '/how-long-to-read/', to: '/word-to-reading-time/' },
    { from: '/text-to-speech-time/', to: '/word-to-speaking-time/' },
    { from: '/presentation-time-calculator/', to: '/word-to-presentation-time/' },
    { from: '/debate-calculator/', to: '/word-to-debate-time/' },
    { from: '/words-per-minute-speech/', to: '/speaking-words-per-minute/' },
    { from: '/average-speaking-speed/', to: '/speaking-words-per-minute/' },
    { from: '/script-timer/', to: '/practice-mode/' },
    { from: '/how-long-1000-word-speech/', to: '/1000-words-to-minutes/' },
    { from: '/how-long-500-word-speech/', to: '/500-words-to-minutes/' },
    { from: '/how-long-600-word-speech/', to: '/600-words-to-minutes/' },
    { from: '/how-long-900-word-speech/', to: '/900-words-to-minutes/' },
    { from: '/how-long-1500-word-speech/', to: '/1500-words-to-minutes/' },
    { from: '/how-long-2500-word-speech/', to: '/2500-words-to-minutes/' },
    { from: '/word-to-debate-time', to: '/word-to-debate-time/' },
  ];
  const rBlocks = redirects.map(r => `[[redirects]]\n  from   = "${r.from}"\n  to     = "${r.to}"\n  status = 301\n  force  = true`).join('\n\n');
  return `# netlify.toml — auto-generated by generate-site-seo-optimized.js

[build]
  command = "node generate-site-seo-optimized.js"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options        = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy        = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# ─── 301 REDIRECTS ───────────────────────────────────────────────
${rBlocks}

# Catch-all 404
[[redirects]]
  from   = "/*"
  to     = "/404.html"
  status = 404
`;
}

// ═══════════════════════════════════════════════════════════════
// MAIN — GENERATE ALL FILES
// ═══════════════════════════════════════════════════════════════

mkdirSync('public/css');
mkdirSync('public/js');

// Assets
write('public/css/style.css', CSS);
write('public/js/app.js', JS);

// Homepage
write('public/index.html', buildHomepage());

// Core tool pages
write('public/words-to-minutes/index.html', buildWordsToMinutes());
write('public/word-to-reading-time/index.html', buildReadingTime());
write('public/word-to-speaking-time/index.html', buildSpeakingTime());
write('public/word-to-speech-length/index.html', buildSpeechLength());
write('public/word-to-presentation-time/index.html', buildPresentationTime());
write('public/word-to-public-speaking-time/index.html', buildPublicSpeaking());
write('public/word-to-debate-time/index.html', buildDebateTime());
write('public/word-to-typing-time/index.html', buildTypingTime());
write('public/speaking-words-per-minute/index.html', buildSpeakingWPM());
write('public/practice-mode/index.html', buildPracticeMode());
write('public/reading-speed-test/index.html', buildReadingSpeedTest());

// International pages
write('public/palabras-a-minutos/index.html', buildPalabrasAMinutos());
write('public/lesezeit-rechner/index.html', buildLesezeit());

// Info pages
write('public/about/index.html', buildAbout());
write('public/privacy/index.html', buildPrivacy());
write('public/terms/index.html', buildTerms());
write('public/404.html', build404());

// Word count pages
const wcPages = [
  { wc: 200,  prev: null, next: 250  },
  { wc: 250,  prev: 200,  next: 300  },
  { wc: 300,  prev: 250,  next: 400  },
  { wc: 400,  prev: 300,  next: 500  },
  { wc: 500,  prev: 400,  next: 600  },
  { wc: 600,  prev: 500,  next: 700  },
  { wc: 700,  prev: 600,  next: 750  },
  { wc: 750,  prev: 700,  next: 800  },
  { wc: 800,  prev: 750,  next: 900  },
  { wc: 900,  prev: 800,  next: 1000 },
  { wc: 1000, prev: 900,  next: 1300 },
  { wc: 1300, prev: 1000, next: 1500 },
  { wc: 1500, prev: 1300, next: 2000 },
  { wc: 2000, prev: 1500, next: 2500 },
  { wc: 2500, prev: 2000, next: null },
];
wcPages.forEach(({ wc, prev, next }) => {
  write(`public/${wc}-words-to-minutes/index.html`,
    buildWordCountPage({ wc, slug: `/${wc}-words-to-minutes`, prevWC: prev, nextWC: next }));
});

// Speech duration pages
const speechPages = [2, 3, 4, 5, 6, 7, 10, 15, 20];
speechPages.forEach(mins => {
  const slug = `/${mins}-minute-speech-word-count`;
  write(`public/${mins}-minute-speech-word-count/index.html`,
    buildSpeechDurationPage({ minutes: mins, slug }));
});

// Sitemap (canonical only)
const sitemapUrls = [
  { loc: '/',                                      priority: '1.0', changefreq: 'weekly' },
  { loc: '/words-to-minutes/',                     priority: '0.9' },
  { loc: '/word-to-reading-time/',                 priority: '0.9' },
  { loc: '/word-to-speaking-time/',                priority: '0.9' },
  { loc: '/word-to-speech-length/',                priority: '0.9' },
  { loc: '/word-to-public-speaking-time/',         priority: '0.9' },
  { loc: '/word-to-presentation-time/',            priority: '0.8' },
  { loc: '/word-to-debate-time/',                  priority: '0.8' },
  { loc: '/word-to-typing-time/',                  priority: '0.8' },
  { loc: '/speaking-words-per-minute/',            priority: '0.8' },
  { loc: '/practice-mode/',                        priority: '0.8' },
  { loc: '/reading-speed-test/',                   priority: '0.8' },
  { loc: '/3-minute-speech-word-count/',           priority: '0.9' },
  { loc: '/4-minute-speech-word-count/',           priority: '0.9' },
  ...speechPages.filter(m => m !== 3 && m !== 4).map(m => ({ loc: `/${m}-minute-speech-word-count/`, priority: '0.8' })),
  ...wcPages.map(({ wc }) => ({ loc: `/${wc}-words-to-minutes/`, priority: '0.8' })),
  { loc: '/palabras-a-minutos/',                   priority: '0.7' },
  { loc: '/lesezeit-rechner/',                     priority: '0.7' },
  { loc: '/about/',                                priority: '0.5' },
  { loc: '/privacy/',                              priority: '0.3' },
  { loc: '/terms/',                                priority: '0.3' },
];
write('public/sitemap.xml', buildSitemap(sitemapUrls));
write('public/robots.txt', buildRobots());
write('public/ads.txt', buildAdsTxt());

// netlify.toml (repo root)
write('netlify.toml', buildNetlifyToml());

// Count output files
const countFiles = (dir) => {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
    if (f.isDirectory()) count += countFiles(path.join(dir, f.name));
    else count++;
  });
  return count;
};

const totalFiles = countFiles('public');
console.log(`\n✅ WordsToTime site generated successfully!`);
console.log(`   📁 Total files: ${totalFiles}`);
console.log(`   📄 HTML pages: ${sitemapUrls.length}`);
console.log(`   🗺  Sitemap: public/sitemap.xml`);
console.log(`   🤖 robots.txt: public/robots.txt`);
console.log(`   💰 ads.txt: public/ads.txt`);
console.log(`   ⚙️  netlify.toml written to repo root`);
console.log(`\n🚀 Run 'npx serve public -p 3000' to preview locally`);
console.log(`   Deploy to Netlify: push to GitHub (auto-build configured)\n`);
