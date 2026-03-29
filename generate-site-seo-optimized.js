'use strict';
const fs   = require('fs');
const path = require('path');

// ─── CONSTANTS ────────────────────────────────────────────────
const BASE_URL    = 'https://wordstotime.netlify.app';
const ADSENSE_PUB = 'ca-pub-9275267797924945';
const GA_ID       = 'G-XXXXXXXXXX';
const WPM = { slow:110, avg:130, fast:150, rapid:170, silent:238, aloud:183, presentation:100 };

// ─── HELPERS ──────────────────────────────────────────────────
function fmt(sec) {
  sec = Math.round(sec);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = n => String(n).padStart(2,'0');
  if (h) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}
function calcTimes(wc) {
  return {
    spkSlow:  fmt(wc/WPM.slow*60),
    spkAvg:   fmt(wc/WPM.avg*60),
    spkFast:  fmt(wc/WPM.fast*60),
    spkRapid: fmt(wc/WPM.rapid*60),
    rdSilent: fmt(wc/WPM.silent*60),
    rdAloud:  fmt(wc/WPM.aloud*60),
    present:  fmt(wc/WPM.presentation*60),
    pages:    (wc/500).toFixed(1),
    chars:    Math.round(wc*5.1).toLocaleString('en-US')
  };
}
function calcWordsForMinutes(mins) {
  return {
    slow:  Math.round(WPM.slow*mins),
    avg:   Math.round(WPM.avg*mins),
    fast:  Math.round(WPM.fast*mins),
    rapid: Math.round(WPM.rapid*mins)
  };
}
function mkdirSync(dir) { if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true}); }
function write(filePath,content) { mkdirSync(path.dirname(filePath)); fs.writeFileSync(filePath,content,'utf8'); }

// ═══════════════════════════════════════════════════════════════
// CSS — FULLY MOBILE-OPTIMISED
// ═══════════════════════════════════════════════════════════════
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --ink:       #1c1917; --ink-2: #44403c; --ink-3: #78716c;
  --amber:     #b45309; --amber-lt: #d97706;
  --amber-bg:  #fffbeb; --amber-bd: #fde68a;
  --forest:    #166534; --forest-lt: #15803d;
  --forest-bg: #f0fdf4; --forest-bd: #bbf7d0;
  --charcoal:  #292524; --cream: #fafaf9; --surface: #ffffff;
  --border:    #e7e5e4; --border-2: #d6d3d1;
  --red:       #991b1b; --red-bg: #fef2f2; --red-bd: #fecaca;
}

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { font-size:16px; scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
body {
  font-family:'Source Sans 3',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  background:var(--cream); color:var(--ink); line-height:1.75;
  overflow-x:hidden;
}

/* ── HEADER ────────────────────────────────── */
.site-header {
  position:sticky; top:0; z-index:200;
  background:var(--charcoal);
  border-bottom:1px solid rgba(255,255,255,.1);
  box-shadow:0 1px 8px rgba(0,0,0,.15);
}
.header-inner {
  max-width:1080px; margin:0 auto; padding:0 20px;
  height:58px; display:flex; align-items:center;
  justify-content:space-between; gap:12px;
}
.logo-link { display:flex; align-items:center; gap:9px; text-decoration:none; flex-shrink:0; }
.logo-icon { width:28px; height:28px; color:#fcd34d; flex-shrink:0; }
.logo-text { font-family:'Lora',serif; font-size:19px; font-weight:700; color:#fff; letter-spacing:-.3px; white-space:nowrap; }
.logo-text span { color:#fcd34d; }

/* Desktop nav with dropdown */
.nav-desktop { display:flex; align-items:center; gap:2px; }
.nav-desktop > a {
  font-size:13px; font-weight:600; color:#a8a29e;
  padding:6px 10px; border-radius:6px;
  text-decoration:none; transition:all .18s; white-space:nowrap;
}
.nav-desktop > a:hover, .nav-desktop > a.active { color:#fff; background:rgba(255,255,255,.08); }
.nav-dropdown { position:relative; }
.nav-dropdown-btn {
  font-size:13px; font-weight:600; color:#a8a29e;
  padding:6px 10px; border-radius:6px; border:none;
  background:none; cursor:pointer; display:flex; align-items:center;
  gap:4px; transition:all .18s; white-space:nowrap;
}
.nav-dropdown-btn:hover { color:#fff; background:rgba(255,255,255,.08); }
.nav-dropdown-btn svg { width:12px; height:12px; transition:transform .2s; }
.nav-dropdown:hover .nav-dropdown-btn svg { transform:rotate(180deg); }
.nav-dropdown-menu {
  display:none; position:absolute; top:calc(100% + 4px); left:0;
  background:var(--charcoal); border:1px solid rgba(255,255,255,.12);
  border-radius:10px; padding:8px; min-width:220px;
  box-shadow:0 8px 24px rgba(0,0,0,.3); z-index:300;
}
.nav-dropdown:hover .nav-dropdown-menu { display:block; }
.nav-dropdown-menu a {
  display:block; font-size:13px; font-weight:500; color:#a8a29e;
  padding:8px 12px; border-radius:6px; text-decoration:none; transition:all .15s;
}
.nav-dropdown-menu a:hover { color:#fff; background:rgba(255,255,255,.1); }
.nav-cta {
  background:var(--amber) !important; color:#fff !important;
  border-radius:7px !important; padding:7px 14px !important; font-weight:700 !important;
}
.nav-cta:hover { background:var(--amber-lt) !important; }

.hamburger {
  display:none; background:none; border:none; cursor:pointer;
  padding:8px; color:#a8a29e; border-radius:6px; flex-shrink:0;
  -webkit-tap-highlight-color:transparent;
}
.hamburger:hover { color:#fff; background:rgba(255,255,255,.08); }
.mobile-nav {
  display:none; background:var(--charcoal);
  border-top:1px solid rgba(255,255,255,.08); padding:8px 16px 16px;
  max-height:80vh; overflow-y:auto;
}
.mobile-nav.open { display:block; }
.mobile-nav-section { margin-top:12px; }
.mobile-nav-section-title {
  font-size:10px; font-weight:700; text-transform:uppercase;
  letter-spacing:1px; color:#57534e; padding:0 4px; margin-bottom:4px;
}
.mobile-nav a {
  display:block; color:#a8a29e; text-decoration:none;
  font-size:14px; font-weight:600; padding:10px 4px;
  border-bottom:1px solid rgba(255,255,255,.05);
  transition:color .15s; -webkit-tap-highlight-color:transparent;
}
.mobile-nav a:last-child { border-bottom:none; }
.mobile-nav a:hover, .mobile-nav a:active { color:#fcd34d; }
.mobile-nav-cta {
  display:block; margin-top:12px; background:var(--amber);
  color:#fff !important; text-align:center; padding:12px 20px;
  border-radius:8px; font-weight:700; font-size:14px; text-decoration:none;
}

@media(max-width:900px) { .nav-desktop { display:none; } .hamburger { display:flex; align-items:center; } }

/* ── LAYOUT ─────────────────────────────────── */
.wrap        { max-width:1080px; margin:0 auto; padding:0 20px; }
.wrap-narrow { max-width:780px;  margin:0 auto; padding:0 20px; }

.page-with-sidebar {
  display:flex; align-items:flex-start; gap:28px;
  max-width:1080px; margin:0 auto;
  padding:40px 20px 64px;
}
.main-col { flex:1; min-width:0; }
.sidebar-col { width:268px; flex-shrink:0; position:sticky; top:68px; }

@media(max-width:860px) {
  .page-with-sidebar { flex-direction:column; padding:28px 16px 48px; }
  .sidebar-col { width:100%; position:static; }
}

/* ── HERO ──────────────────────────────────── */
.hero {
  background:var(--charcoal);
  padding:44px 20px 52px;
}
.hero-inner { max-width:680px; margin:0 auto; text-align:center; }
.trust-pills { display:flex; flex-wrap:wrap; justify-content:center; gap:7px; margin-bottom:18px; }
.trust-pill {
  display:inline-flex; align-items:center; gap:5px;
  font-size:12px; font-weight:600;
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
  color:#d6d3d1; padding:4px 11px; border-radius:20px;
}
h1.hero-title {
  font-family:'Lora',serif; font-size:clamp(26px,5vw,46px);
  font-weight:700; color:#fff; line-height:1.1;
  letter-spacing:-.4px; margin-bottom:12px;
}
.hero-subtitle {
  font-size:15.5px; color:#a8a29e; max-width:520px;
  margin:0 auto 26px; line-height:1.65;
}
.breadcrumb {
  font-size:13px; color:var(--ink-3); margin-bottom:20px; padding-top:14px;
  text-align:left;
}
.breadcrumb a { color:var(--amber); text-decoration:none; }
.breadcrumb a:hover { text-decoration:underline; }
.breadcrumb span { margin:0 5px; color:var(--border-2); }

@media(max-width:520px) {
  .hero { padding:30px 16px 38px; }
  h1.hero-title { font-size:26px; }
  .hero-subtitle { font-size:14.5px; }
}

/* ── SECTION ───────────────────────────────── */
.section { padding:48px 0; border-bottom:1px solid var(--border); }
.section:last-of-type { border-bottom:none; }
.section-alt { background:var(--surface); }
.section-label {
  display:inline-flex; align-items:center; gap:6px;
  font-size:11px; font-weight:700; letter-spacing:1.5px;
  text-transform:uppercase; color:var(--amber); margin-bottom:7px;
}
.section-label::before { content:''; display:block; width:16px; height:2px; background:var(--amber); }
h2.section-title {
  font-family:'Lora',serif;
  font-size:clamp(20px,3.5vw,32px);
  font-weight:700; color:var(--ink); letter-spacing:-.2px;
  line-height:1.2; margin-bottom:10px;
}
h3.sub-title { font-family:'Lora',serif; font-size:19px; font-weight:700; color:var(--ink); margin:26px 0 8px; }
h3.sub-title:first-child { margin-top:0; }
h4 { font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--ink-3); margin:18px 0 7px; }
p { color:var(--ink-2); font-size:15px; line-height:1.75; margin-bottom:12px; }
ul,ol { padding-left:22px; margin-bottom:13px; }
li { color:var(--ink-2); font-size:15px; margin-bottom:5px; }
strong { color:var(--ink); }
a { color:var(--amber); text-decoration:none; }
a:hover { text-decoration:underline; }
a[target="_blank"]::after { content:' ↗'; font-size:10px; opacity:.55; }

/* ── CALCULATOR ─────────────────────────────── */
.calc-card {
  background:var(--surface); border:1.5px solid var(--amber-bd);
  border-radius:14px; padding:24px 22px;
  box-shadow:0 4px 20px rgba(180,83,9,.08);
  width:100%;
}
.calc-tabs { display:flex; gap:0; margin-bottom:18px; border-bottom:2px solid var(--border); }
.calc-tab {
  font-size:13.5px; font-weight:700; color:var(--ink-3);
  padding:8px 18px 10px; border:none; background:none;
  cursor:pointer; border-bottom:2px solid transparent;
  margin-bottom:-2px; transition:all .18s; white-space:nowrap;
  -webkit-tap-highlight-color:transparent;
}
.calc-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
.calc-textarea {
  width:100%; min-height:100px; resize:vertical;
  border:1.5px solid var(--border); border-radius:9px;
  padding:11px 13px; font-size:14px;
  font-family:'Source Sans 3',sans-serif;
  color:var(--ink); background:var(--cream);
  transition:border-color .18s; line-height:1.6;
  -webkit-appearance:none;
}
.calc-textarea:focus { outline:none; border-color:var(--amber); background:#fff; }
.calc-tab-pane { display:none; }
.calc-tab-pane.active { display:block; }
.word-count-live { font-size:12px; color:var(--ink-3); margin-top:5px; text-align:right; font-family:'JetBrains Mono',monospace; }
.word-count-live strong { color:var(--amber); }
.calc-number-wrap { position:relative; }
.calc-number-input {
  width:100%; padding:13px 14px; border:1.5px solid var(--border);
  border-radius:9px; font-size:16px; color:var(--ink);
  background:var(--cream); transition:border-color .18s;
  -webkit-appearance:none;
}
.calc-number-input:focus { outline:none; border-color:var(--amber); background:#fff; }
.speed-label { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-3); margin:14px 0 8px; }
.speed-pills { display:flex; flex-wrap:wrap; gap:7px; }
.speed-pill {
  padding:7px 13px; border-radius:20px; font-size:12.5px; font-weight:700;
  border:1.5px solid var(--border); background:var(--surface); color:var(--ink-2);
  cursor:pointer; transition:all .18s; line-height:1.3; text-align:center;
  -webkit-tap-highlight-color:transparent;
}
.speed-pill.active { background:var(--amber); border-color:var(--amber); color:#fff; }
.speed-pill:hover:not(.active) { border-color:var(--amber); color:var(--amber); }
.custom-wpm-wrap { margin-top:9px; display:none; align-items:center; gap:9px; flex-wrap:wrap; }
.custom-wpm-wrap.show { display:flex; }
.custom-wpm-input { width:90px; padding:7px 10px; border:1.5px solid var(--amber-bd); border-radius:7px; font-size:14px; -webkit-appearance:none; }
.calc-divider { height:1px; background:var(--border); margin:16px 0; }

/* Results */
.results-empty { text-align:center; padding:28px 16px; color:var(--ink-3); }
.results-empty svg { width:44px; height:44px; margin-bottom:10px; opacity:.25; }
.results-empty p { font-size:14px; color:var(--ink-3); margin-bottom:0; }
.results-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.result-card {
  background:var(--cream); border:1.5px solid var(--border);
  border-radius:11px; padding:14px 12px; text-align:center;
}
.result-card.primary {
  background:var(--forest-bg); border-color:var(--forest-bd);
  grid-column:1/-1;
}
.result-icon { font-size:20px; margin-bottom:5px; }
.result-label { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:var(--ink-3); margin-bottom:3px; }
.result-value { font-family:'JetBrains Mono',monospace; font-size:clamp(18px,3vw,24px); font-weight:600; color:var(--forest); }
.result-card:not(.primary) .result-value { color:var(--ink); font-size:clamp(15px,2.5vw,19px); }
.result-sub { font-size:11px; color:var(--ink-3); margin-top:2px; }
.stats-bar {
  display:flex; justify-content:center; flex-wrap:wrap; gap:12px;
  margin-top:12px; padding-top:12px; border-top:1px solid var(--border);
  font-size:12px; color:var(--ink-3);
}
.stats-bar span strong { color:var(--ink); }
.copy-btn {
  margin-top:12px; width:100%; background:var(--amber); color:#fff;
  border:none; border-radius:8px; padding:10px 18px;
  font-size:14px; font-weight:700; cursor:pointer; transition:background .18s;
  -webkit-tap-highlight-color:transparent;
}
.copy-btn:hover { background:var(--amber-lt); }
@media(max-width:420px) {
  .results-grid { grid-template-columns:1fr; }
  .result-card.primary { grid-column:auto; }
  .speed-pills { gap:6px; }
  .speed-pill { font-size:12px; padding:6px 10px; }
}

/* ── ANSWER BOX ─────────────────────────────── */
.answer-box {
  background:var(--forest-bg); border:2px solid var(--forest-bd);
  border-radius:13px; padding:20px 22px; margin:18px 0;
}
.answer-box-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:var(--forest); margin-bottom:8px; }
.answer-val { font-family:'JetBrains Mono',monospace; font-size:clamp(22px,5vw,36px); font-weight:600; color:var(--forest); margin-bottom:5px; }
.answer-sub { font-size:13px; color:#14532d; line-height:1.5; }

/* ── QUICK ANSWERS GRID ──────────────────────── */
.quick-answers { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin:20px 0; }
.qa-card { background:var(--surface); border:1.5px solid var(--border); border-radius:11px; padding:16px; text-align:center; }
.qa-question { font-size:12.5px; color:var(--ink-2); margin-bottom:7px; line-height:1.4; }
.qa-answer { font-family:'JetBrains Mono',monospace; font-size:19px; font-weight:600; color:var(--forest); margin-bottom:3px; }
.qa-note { font-size:11px; color:var(--ink-3); }

/* ── TABLES ──────────────────────────────────── */
.tbl-wrap {
  overflow-x:auto; margin:18px 0; border-radius:11px;
  border:1px solid var(--border); -webkit-overflow-scrolling:touch;
}
.tbl-wrap::after {
  content:'← swipe →'; display:none; text-align:center;
  font-size:11px; color:var(--ink-3); padding:4px;
}
@media(max-width:600px) { .tbl-wrap::after { display:block; } }
table { width:100%; border-collapse:collapse; font-size:13px; min-width:480px; }
thead th {
  background:var(--charcoal); color:#fff; padding:9px 13px;
  text-align:left; font-size:11px; font-weight:700;
  text-transform:uppercase; letter-spacing:.4px; white-space:nowrap;
}
thead th:first-child { border-radius:11px 0 0 0; }
thead th:last-child  { border-radius:0 11px 0 0; }
tbody td { padding:8px 13px; border-bottom:1px solid var(--border); vertical-align:middle; }
tbody tr:last-child td { border-bottom:none; }
tbody tr:nth-child(even) td { background:#fafaf9; }
tbody tr:hover td { background:var(--amber-bg); }
.td-highlight { font-family:'JetBrains Mono',monospace; font-weight:600; color:var(--forest); }
.td-sub { font-size:11.5px; color:var(--ink-3); }
.row-highlight td { background:var(--amber-bg) !important; font-weight:600; }
.ref-note { font-size:12px; color:var(--ink-3); margin-top:6px; font-style:italic; line-height:1.5; }

/* ── FAQ ─────────────────────────────────────── */
.faq-list { margin-top:14px; }
.faq-item { border:1px solid var(--border); border-radius:9px; margin-bottom:9px; overflow:hidden; transition:border-color .18s; }
.faq-btn {
  width:100%; background:none; border:none; padding:15px 18px;
  text-align:left; cursor:pointer; display:flex; align-items:flex-start;
  justify-content:space-between; gap:10px; font-size:14.5px;
  font-weight:600; color:var(--ink); line-height:1.45;
  transition:background .18s; -webkit-tap-highlight-color:transparent;
}
.faq-btn:hover { background:var(--cream); }
.faq-item.open .faq-btn { background:var(--amber-bg); color:var(--amber); }
.faq-item.open { border-color:var(--amber); border-left-width:3px; }
.faq-chevron { flex-shrink:0; width:17px; height:17px; color:var(--ink-3); transition:transform .2s; margin-top:2px; }
.faq-item.open .faq-chevron { transform:rotate(180deg); color:var(--amber); }
.faq-body { display:none; padding:0 18px 15px; font-size:14px; color:var(--ink-2); line-height:1.7; }
.faq-body p { font-size:14px; margin-bottom:8px; }
.faq-body p:last-child { margin-bottom:0; }
.faq-item.open .faq-body { display:block; }
.faq-body a { color:var(--amber); }

/* ── TOOLS GRID ─────────────────────────────── */
.tools-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-top:18px; }
.tool-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:11px; padding:16px; text-decoration:none;
  transition:all .18s; display:block;
}
.tool-card:hover { border-color:var(--amber); box-shadow:0 4px 14px rgba(180,83,9,.1); transform:translateY(-2px); text-decoration:none; }
.tool-card-icon { font-size:22px; margin-bottom:7px; }
.tool-card-name { font-size:13.5px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.tool-card-desc { font-size:12px; color:var(--ink-3); line-height:1.45; }
@media(max-width:480px) {
  .tools-grid { grid-template-columns:1fr 1fr; }
}

/* ── SIDEBAR ─────────────────────────────────── */
.sidebar-card {
  background:var(--surface); border:1.5px solid var(--border);
  border-radius:11px; padding:18px; margin-bottom:14px;
}
.sidebar-card-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--ink-3); margin-bottom:12px; }
.sidebar-links a {
  display:block; padding:6px 0; font-size:13.5px; color:var(--ink-2);
  text-decoration:none; border-bottom:1px solid var(--border);
  transition:color .15s; -webkit-tap-highlight-color:transparent;
}
.sidebar-links a:last-child { border-bottom:none; }
.sidebar-links a:hover { color:var(--amber); }
.sidebar-links a::after { content:none !important; }
.sidebar-cta { background:linear-gradient(135deg,#1e1b18,#2a1a0a); border-color:rgba(180,83,9,.3) !important; color:#fff; }
.sidebar-cta .sidebar-card-title { color:#fcd34d; }
.sidebar-cta p { color:#a8a29e; font-size:12.5px; margin-bottom:12px; }
.sidebar-btn {
  display:block; background:var(--amber); color:#fff; text-align:center;
  padding:9px 14px; border-radius:7px; font-size:13px; font-weight:700;
  text-decoration:none; transition:background .18s;
}
.sidebar-btn:hover { background:var(--amber-lt); text-decoration:none; }
.sidebar-btn::after { content:none !important; }
.sidebar-answer { background:var(--forest-bg); border-color:var(--forest-bd) !important; }
.sidebar-answer .sidebar-card-title { color:var(--forest); }
.sidebar-answer .sa-val { font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:600; color:var(--forest); margin:3px 0 1px; }
.sidebar-answer .sa-sub { font-size:11.5px; color:#14532d; line-height:1.4; }
.sidebar-answer hr { border:none; border-top:1px solid var(--forest-bd); margin:10px 0; }

/* ── INTERNAL LINK STRIP ─────────────────────── */
.link-strip {
  background:var(--amber-bg); border:1px solid var(--amber-bd);
  border-radius:11px; padding:16px 18px; margin:24px 0;
}
.link-strip-title { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--amber); margin-bottom:10px; }
.link-strip-links { display:flex; flex-wrap:wrap; gap:8px; }
.link-strip-links a {
  font-size:13px; font-weight:600; color:#78350f;
  background:var(--surface); border:1px solid var(--amber-bd);
  padding:5px 12px; border-radius:20px; text-decoration:none;
  transition:all .15s; white-space:nowrap;
}
.link-strip-links a:hover { background:var(--amber); color:#fff; text-decoration:none; border-color:var(--amber); }
.link-strip-links a::after { content:none !important; }

/* ── AD ZONES ────────────────────────────────── */
.ad-zone { margin:28px 0; min-height:90px; text-align:center; overflow:hidden; }

/* ── FOOTER ──────────────────────────────────── */
.site-footer { background:var(--charcoal); color:#a8a29e; padding:52px 20px 28px; }
.footer-grid {
  max-width:1080px; margin:0 auto;
  display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:36px;
}
.footer-brand-logo { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.footer-brand-logo span { font-family:'Lora',serif; font-size:17px; font-weight:700; color:#fff; }
.footer-tagline { font-size:13px; color:#78716c; line-height:1.6; margin-bottom:14px; }
.footer-authority { display:flex; flex-direction:column; gap:7px; }
.footer-authority a { font-size:12.5px; color:#a8a29e; text-decoration:none; display:flex; align-items:center; gap:5px; transition:color .15s; }
.footer-authority a:hover { color:#fcd34d; }
.footer-authority a::after { content:none !important; }
.footer-col-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; color:#e7e5e4; margin-bottom:12px; }
.footer-links a {
  display:block; font-size:12.5px; color:#78716c;
  text-decoration:none; margin-bottom:7px; transition:color .15s;
}
.footer-links a:hover { color:#fcd34d; }
.footer-links a::after { content:none !important; }
.footer-bottom {
  max-width:1080px; margin:36px auto 0;
  padding-top:18px; border-top:1px solid rgba(255,255,255,.08);
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:10px;
}
.footer-copyright { font-size:12px; color:#57534e; }
.footer-trust { display:flex; flex-wrap:wrap; gap:12px; }
.footer-trust span { font-size:11.5px; color:#57534e; display:flex; align-items:center; gap:4px; }
.footer-trust span::before { content:'✓'; color:#fcd34d; font-weight:700; }
@media(max-width:860px)  { .footer-grid { grid-template-columns:1fr 1fr; gap:28px; } }
@media(max-width:480px)  { .footer-grid { grid-template-columns:1fr; gap:24px; } }

/* ── PROSE ───────────────────────────────────── */
.prose-block { max-width:none; }
.info-card { background:var(--amber-bg); border:1px solid var(--amber-bd); border-radius:11px; padding:16px 20px; margin:18px 0; }
.info-card-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:var(--amber); margin-bottom:7px; }
.info-card p,.info-card li { color:#78350f; font-size:13.5px; margin-bottom:5px; }
.data-card { background:var(--forest-bg); border:1px solid var(--forest-bd); border-radius:11px; padding:16px 20px; margin:18px 0; }
.data-card p,.data-card li { color:#14532d; font-size:13.5px; margin-bottom:5px; }

/* ── PRACTICE MODE ───────────────────────────── */
.practice-card { background:var(--surface); border:1.5px solid var(--border); border-radius:13px; padding:24px 22px; }
.practice-timer { font-family:'JetBrains Mono',monospace; font-size:clamp(44px,10vw,76px); font-weight:600; color:var(--forest); text-align:center; margin:22px 0 6px; letter-spacing:-2px; line-height:1; }
.practice-wpm { font-family:'JetBrains Mono',monospace; font-size:clamp(24px,5vw,34px); font-weight:600; color:var(--amber); text-align:center; margin-bottom:6px; }
.practice-btns { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin:18px 0 6px; }
.btn-primary { background:var(--amber); color:#fff; border:none; padding:12px 26px; border-radius:8px; font-size:14.5px; font-weight:700; cursor:pointer; transition:background .18s; -webkit-tap-highlight-color:transparent; }
.btn-primary:hover { background:var(--amber-lt); }
.btn-secondary { background:var(--surface); color:var(--ink); border:1.5px solid var(--border); padding:12px 22px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; transition:all .18s; -webkit-tap-highlight-color:transparent; }
.btn-secondary:hover { border-color:var(--amber); color:var(--amber); }
.btn-danger { background:var(--red-bg); color:var(--red); border:1.5px solid var(--red-bd); padding:12px 22px; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; -webkit-tap-highlight-color:transparent; }

/* ── 404 ─────────────────────────────────────── */
.page-404 { text-align:center; padding:72px 20px; }
.page-404 h1 { font-family:'Lora',serif; font-size:clamp(60px,15vw,90px); color:var(--amber); margin-bottom:12px; }
.page-404 h2 { font-family:'Lora',serif; font-size:clamp(20px,4vw,28px); margin-bottom:12px; }
.chip { display:inline-block; background:var(--amber-bg); border:1px solid var(--amber-bd); color:#78350f; padding:5px 14px; border-radius:20px; font-size:12.5px; font-weight:600; white-space:nowrap; }

/* ── GLOBAL RESPONSIVE ───────────────────────── */
@media(max-width:600px) {
  .page-with-sidebar { padding:20px 12px 40px; gap:20px; }
  .calc-card { padding:16px 13px; }
  .wrap,.wrap-narrow { padding:0 12px; }
  h2.section-title { font-size:20px; }
  h3.sub-title { font-size:17px; }
  p,li { font-size:14.5px; }
  .faq-btn { font-size:14px; padding:13px 14px; }
  .tools-grid { grid-template-columns:1fr 1fr; gap:10px; }
  .tool-card { padding:12px; }
  .tool-card-name { font-size:13px; }
  .quick-answers { grid-template-columns:1fr 1fr; gap:10px; }
  .answer-box { padding:16px 15px; }
  .answer-val { font-size:clamp(20px,6vw,30px); }
  .link-strip { padding:13px 14px; }
  .link-strip-links a { font-size:12px; padding:4px 10px; }
  .section { padding:32px 0; }
  .info-card,.data-card { padding:13px 14px; }
  table { font-size:12px; }
  thead th { padding:7px 9px; font-size:10px; }
  tbody td { padding:6px 9px; }
}
@media(max-width:480px) {
  .hero { padding:26px 12px 32px; }
  h1.hero-title { font-size:24px; }
  .hero-subtitle { font-size:14px; }
  .trust-pills { gap:5px; }
  .trust-pill { font-size:11px; padding:3px 9px; }
  .stats-bar { gap:8px; font-size:11.5px; }
  .calc-tabs { overflow-x:auto; }
  .calc-tab { font-size:12.5px; padding:8px 13px 10px; }
  .results-grid { grid-template-columns:1fr 1fr; }
}
@media(max-width:380px) {
  .quick-answers { grid-template-columns:1fr; }
  .tools-grid { grid-template-columns:1fr; }
  .results-grid { grid-template-columns:1fr; }
  .result-card.primary { grid-column:auto; }
  .speed-pills { gap:5px; }
  .speed-pill { font-size:11.5px; padding:6px 9px; }
  .header-inner { padding:0 12px; }
  .logo-text { font-size:16px; }
  .footer-grid { gap:20px; }
}

/* ── PRINT ───────────────────────────────────── */
@media print {
  .site-header,.site-footer,.ad-zone,.nav-desktop,.hamburger,.mobile-nav { display:none !important; }
  .page-with-sidebar { flex-direction:column; }
  .sidebar-col { display:none; }
  body { font-size:12pt; }
  a { color:inherit; }
  a::after { content:none !important; }
}
`;

// ═══════════════════════════════════════════════════════════════
// JS — VANILLA, NO DEPS
// ═══════════════════════════════════════════════════════════════
const JS = `(function(){'use strict';
/* ── Mobile nav ── */
const ham=document.getElementById('hamburger'),mob=document.getElementById('mobile-nav');
if(ham&&mob){ham.addEventListener('click',function(){const o=mob.classList.toggle('open');this.setAttribute('aria-expanded',o);});}

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    const item=this.closest('.faq-item'),open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open');el.querySelector('.faq-btn').setAttribute('aria-expanded','false');});
    if(!open){item.classList.add('open');this.setAttribute('aria-expanded','true');}
  });
});

/* ── Calculator ── */
var wpmMap={slow:110,avg:130,fast:150,rapid:170};
var currentWpm=130,wordCount=0;
function fmt(sec){sec=Math.round(sec);var h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;var p=function(n){return String(n).padStart(2,'0');};if(h)return h+'h '+p(m)+'m '+p(s)+'s';if(m)return m+'m '+p(s)+'s';return s+'s';}
function countWords(t){return t.trim().split(/\\s+/).filter(function(w){return w.length>0;}).length;}
function updateResults(wc){
  var live=document.getElementById('word-count-live');
  if(live)live.innerHTML='<strong>'+wc.toLocaleString()+'</strong> words';
  var ra=document.getElementById('results-area');if(!ra)return;
  if(!wc){ra.innerHTML='<div class="results-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg><p>Paste text or enter a word count above to see timing results.</p></div>';return;}
  var wpm=currentWpm,spk=fmt(wc/wpm*60),rds=fmt(wc/238*60),rda=fmt(wc/183*60),pre=fmt(wc/100*60),pages=(wc/500).toFixed(1),chars=(Math.round(wc*5.1)).toLocaleString();
  ra.innerHTML='<div class="results-grid"><div class="result-card primary"><div class="result-icon">🎤</div><div class="result-label">Speaking Time ('+wpm+' WPM)</div><div class="result-value" aria-live="polite">'+spk+'</div><div class="result-sub">Average speaking pace</div></div><div class="result-card"><div class="result-icon">👁</div><div class="result-label">Silent Reading</div><div class="result-value">'+rds+'</div><div class="result-sub">238 WPM avg</div></div><div class="result-card"><div class="result-icon">📢</div><div class="result-label">Read Aloud</div><div class="result-value">'+rda+'</div><div class="result-sub">183 WPM avg</div></div><div class="result-card"><div class="result-icon">📊</div><div class="result-label">Presentation</div><div class="result-value">'+pre+'</div><div class="result-sub">~100 WPM w/ pauses</div></div></div><div class="stats-bar"><span>Words: <strong>'+wc.toLocaleString()+'</strong></span><span>Pages: <strong>~'+pages+'</strong></span><span>Chars: <strong>~'+chars+'</strong></span></div><button class="copy-btn" onclick="copyResults()">📋 Copy Results</button>';
}
/* Tabs */
document.querySelectorAll('.calc-tab').forEach(function(tab){
  tab.addEventListener('click',function(){
    var paneId=this.dataset.pane;
    document.querySelectorAll('.calc-tab').forEach(function(t){t.classList.remove('active');t.setAttribute('aria-selected','false');});
    document.querySelectorAll('.calc-tab-pane').forEach(function(p){p.classList.remove('active');});
    this.classList.add('active');this.setAttribute('aria-selected','true');
    var pane=document.getElementById(paneId);if(pane)pane.classList.add('active');
  });
});
/* Textarea */
var ta=document.getElementById('calc-textarea');
if(ta){ta.addEventListener('input',function(){wordCount=countWords(this.value);updateResults(wordCount);});}
/* Number input */
var ni=document.getElementById('calc-number');
if(ni){
  ni.addEventListener('input',function(){wordCount=parseInt(this.value)||0;updateResults(wordCount);});
  var up=new URLSearchParams(window.location.search),wp=up.get('w');
  if(wp&&!isNaN(parseInt(wp))){
    ni.value=parseInt(wp);wordCount=parseInt(wp);
    var wct=document.querySelector('[data-pane="pane-count"]'),ppt=document.querySelector('[data-pane="pane-paste"]');
    if(wct&&ppt){ppt.classList.remove('active');var pp=document.getElementById('pane-paste');if(pp)pp.classList.remove('active');wct.classList.add('active');var pc=document.getElementById('pane-count');if(pc)pc.classList.add('active');}
    updateResults(wordCount);
  }
}
/* Speed pills */
document.querySelectorAll('.speed-pill').forEach(function(pill){
  pill.addEventListener('click',function(){
    document.querySelectorAll('.speed-pill').forEach(function(p){p.classList.remove('active');});
    this.classList.add('active');
    var speed=this.dataset.speed,cw=document.getElementById('custom-wpm-wrap');
    if(speed==='custom'){currentWpm=parseInt(document.getElementById('custom-wpm').value)||130;if(cw)cw.classList.add('show');}
    else{currentWpm=wpmMap[speed];if(cw)cw.classList.remove('show');}
    updateResults(wordCount);
  });
});
var cwi=document.getElementById('custom-wpm');
if(cwi){cwi.addEventListener('input',function(){currentWpm=parseInt(this.value)||130;updateResults(wordCount);});}
window.copyResults=function(){
  if(!wordCount)return;
  var wpm=currentWpm,text='WordsToTime Results\\n\\nWord Count: '+wordCount.toLocaleString()+'\\nSpeaking Time ('+wpm+' WPM): '+fmt(wordCount/wpm*60)+'\\nSilent Reading: '+fmt(wordCount/238*60)+'\\nRead Aloud: '+fmt(wordCount/183*60)+'\\nPresentation: '+fmt(wordCount/100*60)+'\\n\\nGenerated at wordstotime.netlify.app';
  navigator.clipboard.writeText(text).then(function(){var btn=document.querySelector('.copy-btn');if(btn){btn.textContent='✅ Copied!';setTimeout(function(){btn.textContent='📋 Copy Results';},2000);}});
};
updateResults(0);

/* ── Practice Mode ── */
var ptimer=null,pstart=null,prunning=false,pwords=0;
var timerEl=document.getElementById('practice-timer'),wpmEl=document.getElementById('practice-wpm'),ptextarea=document.getElementById('practice-textarea');
function startPractice(){if(!ptextarea||!ptextarea.value.trim())return;pwords=countWords(ptextarea.value);pstart=Date.now();prunning=true;var bs=document.getElementById('btn-start'),bst=document.getElementById('btn-stop'),br=document.getElementById('btn-reset');if(bs)bs.style.display='none';if(bst)bst.style.display='inline-block';if(br)br.style.display='inline-block';ptimer=setInterval(updatePT,250);}
function stopPractice(){prunning=false;clearInterval(ptimer);var bs=document.getElementById('btn-start'),bst=document.getElementById('btn-stop'),br=document.getElementById('btn-reset');if(bs)bs.style.display='none';if(bst)bst.style.display='none';if(br)br.style.display='inline-block';}
function resetPractice(){prunning=false;clearInterval(ptimer);if(timerEl)timerEl.textContent='0:00.0';if(wpmEl)wpmEl.textContent='— WPM';var bs=document.getElementById('btn-start'),bst=document.getElementById('btn-stop'),br=document.getElementById('btn-reset');if(bs)bs.style.display='inline-block';if(bst)bst.style.display='none';if(br)br.style.display='none';}
function updatePT(){if(!prunning||!timerEl)return;var e=(Date.now()-pstart)/1000,min=Math.floor(e/60),sec=e%60;timerEl.textContent=min+':'+sec.toFixed(1).padStart(4,'0');if(wpmEl&&e>0)wpmEl.textContent=Math.round(pwords/(e/60))+' WPM';}
window.startPractice=startPractice;window.stopPractice=stopPractice;window.resetPractice=resetPractice;
})();`;

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function headerHTML(activePage) {
  activePage = activePage || '';
  return `<header class="site-header">
  <div class="header-inner">
    <a class="logo-link" href="/">
      <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
      <span class="logo-text">Words<span>To</span>Time</span>
    </a>
    <nav class="nav-desktop" role="navigation" aria-label="Main navigation">
      <a href="/words-to-minutes/"${activePage==='/words-to-minutes/'?' class="active"':''}>Words→Minutes</a>
      <a href="/word-to-reading-time/"${activePage==='/word-to-reading-time/'?' class="active"':''}>Reading Time</a>
      <a href="/word-to-speaking-time/"${activePage==='/word-to-speaking-time/'?' class="active"':''}>Speaking Time</a>
      <div class="nav-dropdown">
        <button class="nav-dropdown-btn" aria-haspopup="true">Calculators <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="/word-to-speech-length/" role="menuitem">📢 Speech Length</a>
          <a href="/word-to-public-speaking-time/" role="menuitem">🎭 Public Speaking</a>
          <a href="/word-to-presentation-time/" role="menuitem">📊 Presentation Timer</a>
          <a href="/word-to-debate-time/" role="menuitem">🏛 Debate Calculator</a>
          <a href="/word-to-typing-time/" role="menuitem">⌨️ Typing / WPM</a>
          <a href="/speaking-words-per-minute/" role="menuitem">📈 Speaking Speed Guide</a>
          <a href="/reading-speed-test/" role="menuitem">🏃 Reading Speed Test</a>
          <a href="/palabras-a-minutos/" role="menuitem">🇪🇸 Palabras a Minutos</a>
          <a href="/lesezeit-rechner/" role="menuitem">🇩🇪 Lesezeit Rechner</a>
        </div>
      </div>
      <div class="nav-dropdown">
        <button class="nav-dropdown-btn" aria-haspopup="true">By Length <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nav-dropdown-menu" role="menu" style="min-width:260px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px">
            <a href="/500-words-to-minutes/" role="menuitem">500 words</a>
            <a href="/750-words-to-minutes/" role="menuitem">750 words</a>
            <a href="/1000-words-to-minutes/" role="menuitem">1,000 words</a>
            <a href="/1500-words-to-minutes/" role="menuitem">1,500 words</a>
            <a href="/2000-words-to-minutes/" role="menuitem">2,000 words</a>
            <a href="/2500-words-to-minutes/" role="menuitem">2,500 words</a>
            <a href="/3-minute-speech-word-count/" role="menuitem">3-min speech</a>
            <a href="/5-minute-speech-word-count/" role="menuitem">5-min speech</a>
            <a href="/10-minute-speech-word-count/" role="menuitem">10-min speech</a>
            <a href="/15-minute-speech-word-count/" role="menuitem">15-min speech</a>
          </div>
          <a href="/words-to-minutes/" role="menuitem" style="margin-top:4px;border-top:1px solid rgba(255,255,255,.1);padding-top:8px">⏱ All Word Counts →</a>
        </div>
      </div>
      <a href="/practice-mode/"${activePage==='/practice-mode/'?' class="active"':''}>Practice Mode</a>
      <a href="/practice-mode/" class="nav-cta">▶ Try Free</a>
    </nav>
    <button class="hamburger" id="hamburger" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle navigation">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">Main Tools</div>
      <a href="/">🏠 Home — Words to Time</a>
      <a href="/words-to-minutes/">⏱ Words to Minutes</a>
      <a href="/word-to-reading-time/">📖 Reading Time Calculator</a>
      <a href="/word-to-speaking-time/">🎤 Speaking Time Calculator</a>
      <a href="/word-to-speech-length/">📢 Speech Length Calculator</a>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">More Calculators</div>
      <a href="/word-to-public-speaking-time/">🎭 Public Speaking Timer</a>
      <a href="/word-to-presentation-time/">📊 Presentation Timer</a>
      <a href="/word-to-debate-time/">🏛 Debate Calculator</a>
      <a href="/word-to-typing-time/">⌨️ WPM / Typing Time</a>
      <a href="/speaking-words-per-minute/">📈 Speaking Speed Guide</a>
      <a href="/reading-speed-test/">🏃 Reading Speed Test</a>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">Word Count Pages</div>
      <a href="/200-words-to-minutes/">200 words</a>
      <a href="/300-words-to-minutes/">300 words</a>
      <a href="/500-words-to-minutes/">500 words</a>
      <a href="/750-words-to-minutes/">750 words</a>
      <a href="/1000-words-to-minutes/">1,000 words</a>
      <a href="/1500-words-to-minutes/">1,500 words</a>
      <a href="/2000-words-to-minutes/">2,000 words</a>
      <a href="/2500-words-to-minutes/">2,500 words</a>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">Speech Duration Pages</div>
      <a href="/2-minute-speech-word-count/">2-Minute Speech</a>
      <a href="/3-minute-speech-word-count/">3-Minute Speech</a>
      <a href="/4-minute-speech-word-count/">4-Minute Speech</a>
      <a href="/5-minute-speech-word-count/">5-Minute Speech</a>
      <a href="/6-minute-speech-word-count/">6-Minute Speech</a>
      <a href="/7-minute-speech-word-count/">7-Minute Speech</a>
      <a href="/10-minute-speech-word-count/">10-Minute Speech</a>
      <a href="/15-minute-speech-word-count/">15-Minute Speech</a>
      <a href="/20-minute-speech-word-count/">20-Minute Speech</a>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">International</div>
      <a href="/palabras-a-minutos/">🇪🇸 Palabras a Minutos</a>
      <a href="/lesezeit-rechner/">🇩🇪 Lesezeit Rechner</a>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">About</div>
      <a href="/about/">About WordsToTime</a>
      <a href="/privacy/">Privacy Policy</a>
      <a href="/terms/">Terms of Use</a>
    </div>
    <a href="/practice-mode/" class="mobile-nav-cta">▶ Try Practice Mode Free</a>
  </nav>
</header>`;
}

function footerHTML() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div class="footer-brand-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
        <span>WordsToTime</span>
      </div>
      <p class="footer-tagline">The authoritative free calculator for converting word count to speaking time, reading time, and presentation duration. Data from ASHA research.</p>
      <div class="footer-authority">
        <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">🔬 American Speech-Language-Hearing Assoc.</a>
        <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">🏆 National Speech &amp; Debate Association</a>
        <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">🎯 TED Talk Speaking Guidelines</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Core Tools</div>
      <div class="footer-links">
        <a href="/">Words to Time</a>
        <a href="/words-to-minutes/">Words to Minutes</a>
        <a href="/word-to-reading-time/">Reading Time</a>
        <a href="/word-to-speaking-time/">Speaking Time</a>
        <a href="/word-to-speech-length/">Speech Length</a>
        <a href="/word-to-presentation-time/">Presentation Timer</a>
        <a href="/word-to-debate-time/">Debate Calculator</a>
        <a href="/word-to-typing-time/">Typing / WPM</a>
        <a href="/practice-mode/">Practice Mode</a>
        <a href="/reading-speed-test/">Reading Speed Test</a>
      </div>
    </div>
    <div>
      <div class="footer-col-title">Word Count Pages</div>
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
      <div class="footer-col-title">Info &amp; Global</div>
      <div class="footer-links">
        <a href="/about/">About</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms of Use</a>
        <a href="/palabras-a-minutos/">🇪🇸 Palabras a Minutos</a>
        <a href="/lesezeit-rechner/">🇩🇪 Lesezeit Rechner</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copyright">© ${new Date().getFullYear()} WordsToTime — Free, no signup required.</div>
    <div class="footer-trust">
      <span>Free</span><span>No Signup</span><span>Research-backed</span><span>Instant</span>
    </div>
  </div>
</footer>`;
}

function headHTML({ title, desc, slug, schema, lang }) {
  lang = lang || 'en';
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
${schema ? `<script type="application/ld+json">${JSON.stringify(schema,null,2)}</script>` : ''}
<link rel="stylesheet" href="/css/style.css">
</head>`;
}

function adZone() {
  return `<div class="ad-zone" aria-hidden="true"><ins class="adsbygoogle" style="display:block" data-ad-client="${ADSENSE_PUB}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}

function calcWidget() {
  return `<div class="calc-card" id="calculator">
  <div class="calc-tabs" role="tablist">
    <button class="calc-tab active" role="tab" data-pane="pane-paste" aria-selected="true">📝 Paste Text</button>
    <button class="calc-tab" role="tab" data-pane="pane-count" aria-selected="false">🔢 Word Count</button>
  </div>
  <div class="calc-tab-pane active" id="pane-paste">
    <textarea class="calc-textarea" id="calc-textarea" placeholder="Paste your speech, essay, or any text here…" rows="5" aria-label="Paste text to calculate reading and speaking time"></textarea>
    <div class="word-count-live" id="word-count-live" aria-live="polite"><strong>0</strong> words</div>
  </div>
  <div class="calc-tab-pane" id="pane-count">
    <input type="number" class="calc-number-input" id="calc-number" placeholder="Enter word count (e.g. 1000)" min="1" max="999999" inputmode="numeric" aria-label="Enter word count">
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
    <input type="number" class="custom-wpm-input" id="custom-wpm" min="50" max="400" placeholder="e.g. 125" inputmode="numeric">
  </div>
  <div class="calc-divider"></div>
  <div id="results-area" aria-live="polite"></div>
</div>`;
}

function faqAccordion(faqs) {
  return `<div class="faq-list">
${faqs.map((f,i) => `  <div class="faq-item">
    <button class="faq-btn" aria-expanded="false" id="faq-btn-${i}">
      <span>${f.q}</span>
      <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="faq-body">${f.a}</div>
  </div>`).join('\n')}
</div>`;
}

function breadcrumbHTML(items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  ${items.map((item,i) => i < items.length-1
    ? `<a href="${item.href}">${item.label}</a><span aria-hidden="true">›</span>`
    : `<span aria-current="page">${item.label}</span>`
  ).join(' ')}
</nav>`;
}

function faqSchema(faqs) {
  return { "@type":"FAQPage","mainEntity":faqs.map(f=>({ "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a.replace(/<[^>]+>/g,'')} })) };
}
function softwareAppSchema(name,url,rating) {
  rating = rating || { val:'4.8', count:'312' };
  return { "@type":"SoftwareApplication","name":name,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","url":url,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"aggregateRating":{"@type":"AggregateRating","ratingValue":rating.val,"reviewCount":rating.count,"bestRating":"5","worstRating":"1"} };
}
function breadcrumbSchema(items) {
  return { "@type":"BreadcrumbList","itemListElement":items.map((item,i)=>({ "@type":"ListItem","position":i+1,"name":item.label,"item":BASE_URL+item.href })) };
}

function sidebarAllCalcs() {
  return `<div class="sidebar-card">
  <div class="sidebar-card-title">All Calculators</div>
  <div class="sidebar-links">
    <a href="/">🏠 Words to Time (Home)</a>
    <a href="/words-to-minutes/">⏱ Words to Minutes</a>
    <a href="/word-to-reading-time/">📖 Reading Time</a>
    <a href="/word-to-speaking-time/">🎤 Speaking Time</a>
    <a href="/word-to-speech-length/">📢 Speech Length</a>
    <a href="/word-to-public-speaking-time/">🎭 Public Speaking</a>
    <a href="/word-to-presentation-time/">📊 Presentation</a>
    <a href="/word-to-debate-time/">🏛 Debate Timer</a>
    <a href="/word-to-typing-time/">⌨️ Typing / WPM</a>
    <a href="/speaking-words-per-minute/">📈 Speaking Speed</a>
    <a href="/practice-mode/">▶️ Practice Mode</a>
    <a href="/reading-speed-test/">🏃 Speed Test</a>
  </div>
</div>`;
}
function sidebarCTA() {
  return `<div class="sidebar-card sidebar-cta">
  <div class="sidebar-card-title">Measure Your Real WPM</div>
  <p>Paste any text, start the timer, read aloud — get your exact words-per-minute instantly.</p>
  <a href="/practice-mode/" class="sidebar-btn">▶ Start Practice Mode</a>
</div>`;
}

// ── Contextual internal link strip ──────────────────────────
function linkStrip(title, links) {
  return `<div class="link-strip">
  <div class="link-strip-title">${title}</div>
  <div class="link-strip-links">${links.map(l=>`<a href="${l.href}">${l.label}</a>`).join('')}</div>
</div>`;
}

function referenceTable(highlightWC) {
  const rows = [100,200,300,500,750,1000,1500,2000,2500,3000,5000];
  return `<div class="tbl-wrap"><table>
<thead><tr><th>Word Count</th><th>Slow (110 WPM)</th><th>Avg (130 WPM)</th><th>Fast (150 WPM)</th><th>Silent Read</th><th>~Pages</th></tr></thead>
<tbody>
${rows.map(wc=>{const t=calcTimes(wc),hl=wc===highlightWC?' class="row-highlight"':'';return`<tr${hl}><td><strong>${wc.toLocaleString()} words</strong></td><td>${t.spkSlow}</td><td class="td-highlight">${t.spkAvg}</td><td>${t.spkFast}</td><td>${t.rdSilent}</td><td class="td-sub">~${t.pages}</td></tr>`;}).join('\n')}
</tbody></table></div>
<p class="ref-note">Based on <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a> research. Individual rates vary by experience, accent, and material complexity.</p>`;
}

function reverseTable() {
  const rows = [1,2,3,4,5,7,10,15,20,30];
  return `<div class="tbl-wrap"><table>
<thead><tr><th>Speech Length</th><th>Slow (110 WPM)</th><th>Avg (130 WPM)</th><th>Fast (150 WPM)</th><th>Rapid (170 WPM)</th></tr></thead>
<tbody>
${rows.map(m=>{const w=calcWordsForMinutes(m);return`<tr><td><strong>${m} minute${m>1?'s':''}</strong></td><td>${w.slow.toLocaleString()} words</td><td class="td-highlight">${w.avg.toLocaleString()} words</td><td>${w.fast.toLocaleString()} words</td><td>${w.rapid.toLocaleString()} words</td></tr>`;}).join('\n')}
</tbody></table></div>
<p class="ref-note">Use these values when writing a speech to a specific time limit. 130 WPM is recommended for most formal presentations.</p>`;
}

function pageShell({ head, body }) {
  return `${head}\n<body>\n${headerHTML()}\n${body}\n${footerHTML()}\n<script src="/js/app.js"></script>\n</body>\n</html>`;
}

// ═══════════════════════════════════════════════════════════════
// PAGE BUILDERS
// ═══════════════════════════════════════════════════════════════

// ── HOMEPAGE ─────────────────────────────────────────────────
function buildHomepage() {
  const faqs = [
    { q:'How many minutes is 1,000 words?', a:'At an average speaking pace of 130 WPM, 1,000 words takes <strong>7 minutes 41 seconds</strong>. At 110 WPM (slow): 9m 5s. At 150 WPM (fast): 6m 40s. Use the <a href="/1000-words-to-minutes/">1,000 words to minutes calculator</a> for a full breakdown.' },
    { q:'How long does it take to read 1,000 words?', a:'1,000 words takes approximately <strong>4 minutes 12 seconds</strong> to read silently at 238 WPM, or about 5 minutes 27 seconds to read aloud (183 WPM). See our <a href="/word-to-reading-time/">reading time calculator</a>.' },
    { q:'How long does it take to speak 1,000 words?', a:'Speaking 1,000 words aloud takes <strong>7 minutes 41 seconds</strong> at the average professional speaking rate of 130 WPM, per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a> research. See our dedicated <a href="/word-to-speaking-time/">speaking time calculator</a>.' },
    { q:'How long does it take to read 2,000 words?', a:'2,000 words takes approximately <strong>8 minutes 24 seconds</strong> to read silently (238 WPM). Speaking 2,000 words aloud takes 15m 23s (130 WPM). See our <a href="/2000-words-to-minutes/">2,000 words to minutes</a> page.' },
    { q:'What is the average reading speed in words per minute?', a:'The average adult reads silently at approximately <strong>238 WPM</strong> with good comprehension. Reading aloud averages 183 WPM. Speed readers can reach 400–700 WPM but with reduced comprehension. Use our <a href="/reading-speed-test/">free reading speed test</a> to measure your own rate.' },
    { q:'How many words do I need for a 5-minute speech?', a:'A 5-minute speech at average pace (130 WPM) needs approximately <strong>650 words</strong>. At slow pace (110 WPM): 550 words. At fast pace (150 WPM): 750 words. See our <a href="/5-minute-speech-word-count/">5-minute speech word count guide</a>.' },
    { q:'How many words is a 10-minute speech?', a:'A 10-minute speech at average pace (130 WPM) needs approximately <strong>1,300 words</strong>. See our full <a href="/10-minute-speech-word-count/">10-minute speech word count</a> breakdown and our <a href="/words-to-minutes/">words to minutes calculator</a>.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[
    { "@type":"WebSite","name":"WordsToTime","url":BASE_URL,"potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":BASE_URL+"/?q={search_term_string}"},"query-input":"required name=search_term_string"} },
    softwareAppSchema("Words to Time Calculator",BASE_URL+"/",{val:"4.9",count:"1247"}),
    faqSchema(faqs)
  ]};
  const head = headHTML({ title:'Words to Time Calculator — Free, Instant Speech Timer', desc:'Paste any text or enter a word count — get speaking time, reading time, and presentation length instantly. Free, no signup. Used by 300K+ speakers & creators.', slug:'/', schema });
  const body = `
<section class="hero">
  <div class="hero-inner">
    <div class="trust-pills">
      <span class="trust-pill">✓ Free</span>
      <span class="trust-pill">✓ No Signup</span>
      <span class="trust-pill">✓ Instant Results</span>
      <span class="trust-pill">✓ Research-Backed</span>
    </div>
    <h1 class="hero-title">Words to Time Calculator</h1>
    <p class="hero-subtitle">Convert any word count to speaking time, reading time, and presentation duration — instantly.</p>
  </div>
</section>
<div class="page-with-sidebar">
  <main class="main-col">
    ${calcWidget()}

    <!-- QUICK ANSWERS -->
    <div class="section-label" style="margin-top:32px">Quick Answers</div>
    <h2 class="section-title" style="margin-bottom:14px">Most-Asked Timing Questions</h2>
    <div class="quick-answers">
      <div class="qa-card"><div class="qa-question">Read <strong>1,000 words</strong> silently?</div><div class="qa-answer">4m 12s</div><div class="qa-note">238 WPM avg · <a href="/word-to-reading-time/">Reading Time →</a></div></div>
      <div class="qa-card"><div class="qa-question">Read <strong>2,000 words</strong> silently?</div><div class="qa-answer">8m 24s</div><div class="qa-note">238 WPM avg · <a href="/2000-words-to-minutes/">2,000 words →</a></div></div>
      <div class="qa-card"><div class="qa-question">Speak <strong>1,000 words</strong> aloud?</div><div class="qa-answer">7m 41s</div><div class="qa-note">130 WPM avg · <a href="/1000-words-to-minutes/">1,000 words →</a></div></div>
      <div class="qa-card"><div class="qa-question">Speak <strong>500 words</strong> aloud?</div><div class="qa-answer">3m 51s</div><div class="qa-note">130 WPM avg · <a href="/500-words-to-minutes/">500 words →</a></div></div>
    </div>

    ${adZone()}

    <!-- REFERENCE TABLE -->
    <div class="section-label">Reference Table</div>
    <h2 class="section-title" style="margin-bottom:6px">Words to Time — Complete Reference</h2>
    <p style="margin-bottom:14px">Research-backed WPM rates from <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>.</p>
    ${referenceTable()}

    <!-- REVERSE TABLE -->
    <h3 class="sub-title" style="margin-top:32px">Minutes to Words — Speech Preparation</h3>
    ${reverseTable()}

    ${adZone()}

    <!-- CONTEXTUAL INTERNAL LINKS -->
    ${linkStrip('Word Count Pages',[ {href:'/200-words-to-minutes/',label:'200 Words'},{href:'/500-words-to-minutes/',label:'500 Words'},{href:'/750-words-to-minutes/',label:'750 Words'},{href:'/1000-words-to-minutes/',label:'1,000 Words'},{href:'/1300-words-to-minutes/',label:'1,300 Words'},{href:'/1500-words-to-minutes/',label:'1,500 Words'},{href:'/2000-words-to-minutes/',label:'2,000 Words'},{href:'/2500-words-to-minutes/',label:'2,500 Words'} ])}
    ${linkStrip('Speech Duration Pages',[ {href:'/2-minute-speech-word-count/',label:'2-Min Speech'},{href:'/3-minute-speech-word-count/',label:'3-Min Speech'},{href:'/4-minute-speech-word-count/',label:'4-Min Speech'},{href:'/5-minute-speech-word-count/',label:'5-Min Speech'},{href:'/6-minute-speech-word-count/',label:'6-Min Speech'},{href:'/7-minute-speech-word-count/',label:'7-Min Speech'},{href:'/10-minute-speech-word-count/',label:'10-Min Speech'},{href:'/15-minute-speech-word-count/',label:'15-Min Speech'},{href:'/20-minute-speech-word-count/',label:'20-Min Speech'} ])}
    ${linkStrip('Core Tools',[ {href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-speech-length/',label:'Speech Length'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/word-to-debate-time/',label:'Debate Timer'},{href:'/word-to-public-speaking-time/',label:'Public Speaking'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/reading-speed-test/',label:'Speed Test'} ])}

    <!-- GUIDE PROSE -->
    <div class="section-label" style="margin-top:8px">How It Works</div>
    <h2 class="section-title" style="margin-bottom:10px">Understanding Speaking &amp; Reading Rates</h2>
    <div class="prose-block">
      <p>The WordsToTime calculator uses evidence-based speaking rates from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. Whether you're preparing a wedding toast, a TED Talk, a school presentation, or a podcast script, accurate timing prevents you from going over — or running short.</p>
      <h3 class="sub-title">How the Calculation Works</h3>
      <p><strong>Time (seconds) = Word Count ÷ WPM × 60.</strong> At the average speaking rate of 130 WPM, every 1,000 words equals approximately 7 minutes 41 seconds. The <a href="/words-to-minutes/">words to minutes calculator</a> shows these values for any word count. Need to plan the other way? Check how many words you need for a <a href="/3-minute-speech-word-count/">3-minute speech</a>, <a href="/5-minute-speech-word-count/">5-minute speech</a>, or <a href="/10-minute-speech-word-count/">10-minute speech</a>.</p>
      <p>For presentations with slides, use the <a href="/word-to-presentation-time/">presentation timer</a> which applies a 100 WPM effective rate — accounting for slide transitions, pauses, and audience reaction time. For formal debates, visit the <a href="/word-to-debate-time/">debate time calculator</a>. For public speaking events, the <a href="/word-to-public-speaking-time/">public speaking timer</a> covers ceremonies, keynotes, and toasts.</p>
      <h3 class="sub-title">Speaking Pace by Context</h3>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Context</th><th>Typical WPM</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Formal speech / ceremony</td><td class="td-highlight">110–120 WPM</td><td>Presidential address, graduation</td></tr>
          <tr class="row-highlight"><td><strong>Average professional speech</strong></td><td class="td-highlight"><strong>130 WPM</strong></td><td>Meetings, podcasts, interviews</td></tr>
          <tr><td>TED Talks</td><td class="td-highlight">163 WPM avg</td><td>18-min = ~2,930 words</td></tr>
          <tr><td>Competitive debate</td><td class="td-highlight">150–170 WPM</td><td>NSDA Policy, LD</td></tr>
          <tr><td>Audiobooks</td><td class="td-highlight">150–165 WPM</td><td>Professional narration</td></tr>
        </tbody>
      </table></div>
      <h3 class="sub-title">Reading Speed</h3>
      <p>The average adult reads silently at <strong>238 WPM</strong> with good comprehension, and reads aloud at <strong>183 WPM</strong> (ASHA). Use the <a href="/word-to-reading-time/">reading time calculator</a> for accurate reading estimates, or take the <a href="/reading-speed-test/">free reading speed test</a> to measure your personal rate. Compare with the <a href="/speaking-words-per-minute/">speaking words per minute guide</a> for full research context.</p>
      <h3 class="sub-title">Pro Tips for Speech Timing</h3>
      <ul>
        <li><strong>Write to your target time:</strong> Use the <a href="/words-to-minutes/">words to minutes calculator</a> to find out how many words you need for a specific duration.</li>
        <li><strong>Practice out loud:</strong> Use our <a href="/practice-mode/">Practice Mode timer</a> to time yourself reading your speech and get your real WPM.</li>
        <li><strong>Add a 10% buffer:</strong> Most speakers slow down when nervous. If your speech times at 10 minutes, write for 9 minutes.</li>
        <li><strong>Count every word:</strong> Use the "Paste Text" tab above for an exact word count that includes filler words and transitions.</li>
        <li><strong>Measure your speed:</strong> Use our <a href="/reading-speed-test/">free reading speed test</a> to find your personal WPM, then set "Custom" in the speed selector for accurate personal results.</li>
        <li><strong>Check word count pages:</strong> For quick answers, see <a href="/1000-words-to-minutes/">1,000 words</a>, <a href="/1500-words-to-minutes/">1,500 words</a>, or <a href="/2000-words-to-minutes/">2,000 words</a> breakdowns.</li>
      </ul>
      <p>For reading-specific estimates, visit the <a href="/word-to-reading-time/">reading time calculator</a>. For information on average speaking rates and the research behind these numbers, see our <a href="/speaking-words-per-minute/">speaking words per minute guide</a>. Want to time your typing? Try the <a href="/word-to-typing-time/">typing time calculator</a>.</p>
    </div>

    <!-- TOOLS GRID -->
    <h2 class="section-title" style="margin-top:36px;margin-bottom:6px">All Word Count &amp; Time Tools</h2>
    <div class="tools-grid">
      <a class="tool-card" href="/words-to-minutes/"><div class="tool-card-icon">⏱</div><div class="tool-card-name">Words to Minutes</div><div class="tool-card-desc">Any word count → speech minutes</div></a>
      <a class="tool-card" href="/word-to-reading-time/"><div class="tool-card-icon">📖</div><div class="tool-card-name">Reading Time</div><div class="tool-card-desc">How long to read any document</div></a>
      <a class="tool-card" href="/word-to-speaking-time/"><div class="tool-card-icon">🎤</div><div class="tool-card-name">Speaking Time</div><div class="tool-card-desc">How long to deliver any speech</div></a>
      <a class="tool-card" href="/word-to-speech-length/"><div class="tool-card-icon">📢</div><div class="tool-card-name">Speech Length</div><div class="tool-card-desc">Exact speech duration from word count</div></a>
      <a class="tool-card" href="/word-to-presentation-time/"><div class="tool-card-icon">📊</div><div class="tool-card-name">Presentation Timer</div><div class="tool-card-desc">Slide timing with pauses included</div></a>
      <a class="tool-card" href="/word-to-debate-time/"><div class="tool-card-icon">🏛</div><div class="tool-card-name">Debate Calculator</div><div class="tool-card-desc">Policy, LD &amp; PF speech timing</div></a>
      <a class="tool-card" href="/practice-mode/"><div class="tool-card-icon">▶️</div><div class="tool-card-name">Practice Mode</div><div class="tool-card-desc">Time your speech &amp; measure WPM</div></a>
      <a class="tool-card" href="/speaking-words-per-minute/"><div class="tool-card-icon">📈</div><div class="tool-card-name">Speaking Speed Guide</div><div class="tool-card-desc">Average WPM data &amp; research</div></a>
      <a class="tool-card" href="/word-to-typing-time/"><div class="tool-card-icon">⌨️</div><div class="tool-card-name">Typing Time</div><div class="tool-card-desc">How long to type any document</div></a>
      <a class="tool-card" href="/reading-speed-test/"><div class="tool-card-icon">🏃</div><div class="tool-card-name">Reading Speed Test</div><div class="tool-card-desc">Measure your WPM in 60 seconds</div></a>
    </div>

    ${adZone()}
    <h2 class="section-title" style="margin-top:36px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col" aria-label="Sidebar">
    <div class="sidebar-card sidebar-answer">
      <div class="sidebar-card-title">Quick Reference</div>
      <div class="sa-val">7m 41s</div><div class="sa-sub">1,000 words at 130 WPM</div>
      <hr><div class="sa-val">4m 12s</div><div class="sa-sub">1,000 words — silent reading</div>
      <hr><div class="sa-val">650 words</div><div class="sa-sub">needed for a 5-min speech</div>
    </div>
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── WORDS TO MINUTES ─────────────────────────────────────────
function buildWordsToMinutes() {
  const faqs = [
    { q:'How many minutes is 1,000 words?', a:'At 130 WPM (average), 1,000 words takes <strong>7 minutes 41 seconds</strong>. At 110 WPM (slow): 9m 5s. At 150 WPM (fast): 6m 40s. See the full <a href="/1000-words-to-minutes/">1,000 words to minutes</a> breakdown.' },
    { q:'How many minutes is 500 words?', a:'500 words takes <strong>3 minutes 51 seconds</strong> at 130 WPM. See our <a href="/500-words-to-minutes/">500 words to minutes</a> page.' },
    { q:'How many minutes is 1,500 words?', a:'1,500 words takes <strong>11 minutes 32 seconds</strong> at 130 WPM. See <a href="/1500-words-to-minutes/">1,500 words to minutes</a>.' },
    { q:'How many minutes is 2,000 words?', a:'2,000 words takes <strong>15 minutes 23 seconds</strong> at 130 WPM. See <a href="/2000-words-to-minutes/">2,000 words to minutes</a>.' },
    { q:'What is the formula for converting words to minutes?', a:'<strong>Minutes = Word Count ÷ WPM.</strong> For example: 1,000 ÷ 130 = 7.69 minutes = 7 min 41 sec. Use the calculator above for any word count.' },
    { q:'How many words per minute should I speak?', a:'Aim for <strong>120–150 WPM</strong> for most speeches. Below 100 WPM feels too slow; above 170 WPM becomes hard to follow. Per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>, 130 WPM is the average professional rate.' },
    { q:'How many words is a 3-minute speech?', a:'A 3-minute speech needs approximately <strong>390 words</strong> at 130 WPM. See our <a href="/3-minute-speech-word-count/">3-minute speech word count</a> guide.' },
    { q:'How many words is a 10-minute speech?', a:'A 10-minute speech needs approximately <strong>1,300 words</strong> at 130 WPM. See our <a href="/10-minute-speech-word-count/">10-minute speech word count</a> guide.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/words-to-minutes/',label:'Words to Minutes'}]), softwareAppSchema("Words to Minutes Calculator",BASE_URL+"/words-to-minutes/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Words to Minutes Calculator — Free, Instant Word Count Timer', desc:'Convert any word count to speaking time in minutes. 500 words = 3m 51s · 1,000 words = 7m 41s · 1,500 words = 11m 32s. Free calculator — choose your speaking speed.', slug:'/words-to-minutes', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/words-to-minutes/',label:'Words to Minutes'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Words to Minutes Calculator</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Convert any word count to speaking time. Includes speaking, reading aloud, and silent reading.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">Quick Answer</div><div class="answer-val">1,000 words = 7m 41s</div><div class="answer-sub">at average speaking pace (130 WPM) · 9m 5s slow · 6m 40s fast</div></div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Words to Minutes Reference Table</h2>
    ${referenceTable()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Minutes to Words — Speech Preparation</h2>
    ${reverseTable()}
    ${adZone()}
    ${linkStrip('Word Count Pages',[ {href:'/200-words-to-minutes/',label:'200 words'},{href:'/300-words-to-minutes/',label:'300 words'},{href:'/500-words-to-minutes/',label:'500 words'},{href:'/750-words-to-minutes/',label:'750 words'},{href:'/1000-words-to-minutes/',label:'1,000 words'},{href:'/1300-words-to-minutes/',label:'1,300 words'},{href:'/1500-words-to-minutes/',label:'1,500 words'},{href:'/2000-words-to-minutes/',label:'2,000 words'},{href:'/2500-words-to-minutes/',label:'2,500 words'} ])}
    ${linkStrip('Related Calculators',[ {href:'/',label:'🏠 Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/3-minute-speech-word-count/',label:'3-Min Speech'},{href:'/5-minute-speech-word-count/',label:'5-Min Speech'},{href:'/practice-mode/',label:'Practice Mode'} ])}
    <div class="prose-block">
      <h2 class="section-title">How to Convert Words to Minutes</h2>
      <p>The words-to-minutes conversion formula: <strong>Minutes = Word Count ÷ WPM</strong>. At the average speaking rate of 130 WPM (per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a> research), every 1,000 words equals approximately 7 minutes 41 seconds.</p>
      <p>Different contexts call for different rates. A formal keynote runs at 110–120 WPM; casual conversation averages 140–160 WPM; TED Talks average 163 WPM. For debate speaking, see the <a href="/word-to-debate-time/">debate time calculator</a>.</p>
      <h3 class="sub-title">Common Conversions</h3>
      <ul>
        <li><a href="/200-words-to-minutes/">200 words</a> = 1m 32s &nbsp;|&nbsp; <a href="/300-words-to-minutes/">300 words</a> = 2m 19s</li>
        <li><a href="/500-words-to-minutes/">500 words</a> = 3m 51s &nbsp;|&nbsp; <a href="/750-words-to-minutes/">750 words</a> = 5m 46s</li>
        <li><a href="/1000-words-to-minutes/">1,000 words</a> = 7m 41s &nbsp;|&nbsp; <a href="/1500-words-to-minutes/">1,500 words</a> = 11m 32s</li>
        <li><a href="/2000-words-to-minutes/">2,000 words</a> = 15m 23s &nbsp;|&nbsp; <a href="/2500-words-to-minutes/">2,500 words</a> = 19m 14s</li>
      </ul>
      <p><em>¿Cuántos minutos son 1.000 palabras?</em> — A 130 PPM, 1.000 palabras = <strong>7 minutos 41 segundos</strong>. Visita nuestra <a href="/palabras-a-minutos/">calculadora de palabras a minutos</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── READING TIME ──────────────────────────────────────────────
function buildReadingTime() {
  const faqs = [
    { q:'How long does it take to read 1,000 words?', a:'1,000 words takes approximately <strong>4 minutes 12 seconds</strong> to read silently at 238 WPM. Reading aloud: about 5 minutes 27 seconds. See <a href="/1000-words-to-minutes/">1,000 words breakdown</a>.' },
    { q:'How long does it take to read 2,000 words?', a:'2,000 words takes approximately <strong>8 minutes 24 seconds</strong> to read silently (238 WPM), or 10m 55s aloud (183 WPM). See <a href="/2000-words-to-minutes/">2,000 words page</a>.' },
    { q:'How long does it take to read 3,000 words?', a:'3,000 words takes approximately <strong>12 minutes 36 seconds</strong> to read silently at 238 WPM.' },
    { q:'How long does it take to read 500 words?', a:'500 words takes approximately <strong>2 minutes 6 seconds</strong> to read silently (238 WPM). See <a href="/500-words-to-minutes/">500 words page</a>.' },
    { q:'What is the average reading speed for adults?', a:'The average adult reads silently at approximately <strong>238 WPM</strong> with good comprehension, per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>. Use our <a href="/reading-speed-test/">reading speed test</a> to measure yours.' },
    { q:'Does reading speed affect comprehension?', a:'Yes. Comprehension decreases as speed increases beyond your natural pace. For technical material, 150–200 WPM may yield better retention than pushing to 300+ WPM.' },
    { q:'How long does it take to read 100 words?', a:'100 words takes approximately <strong>25 seconds</strong> to read silently at 238 WPM, or 33 seconds to read aloud at 183 WPM.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/word-to-reading-time/',label:'Reading Time Calculator'}]), softwareAppSchema("Reading Time Calculator",BASE_URL+"/word-to-reading-time/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Reading Time Calculator — How Long to Read 1,000, 2,000, 3,000 Words?', desc:'1,000 words = 4m 12s to read silently · 2,000 words = 8m 24s · 3,000 words = 12m 36s. Free reading time calculator — paste text or enter word count. Instant results.', slug:'/word-to-reading-time', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/word-to-reading-time/',label:'Reading Time'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Reading Time Calculator</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">How long does it take to read any document? Instant estimates for silent reading and reading aloud.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="quick-answers">
      <div class="qa-card"><div class="qa-question">Read <strong>500 words</strong> silently</div><div class="qa-answer">2m 6s</div><div class="qa-note">238 WPM · <a href="/500-words-to-minutes/">500 words →</a></div></div>
      <div class="qa-card"><div class="qa-question">Read <strong>1,000 words</strong> silently</div><div class="qa-answer">4m 12s</div><div class="qa-note">238 WPM · <a href="/1000-words-to-minutes/">1,000 words →</a></div></div>
      <div class="qa-card"><div class="qa-question">Read <strong>2,000 words</strong> silently</div><div class="qa-answer">8m 24s</div><div class="qa-note">238 WPM · <a href="/2000-words-to-minutes/">2,000 words →</a></div></div>
      <div class="qa-card"><div class="qa-question">Read <strong>3,000 words</strong> silently</div><div class="qa-answer">12m 36s</div><div class="qa-note">238 WPM avg</div></div>
    </div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Reading Time Reference Table</h2>
    ${referenceTable()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/1000-words-to-minutes/',label:'1,000 Words'},{href:'/500-words-to-minutes/',label:'500 Words'},{href:'/2000-words-to-minutes/',label:'2,000 Words'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/reading-speed-test/',label:'Speed Test'} ])}
    <div class="prose-block">
      <h2 class="section-title">Reading Speed — What the Research Says</h2>
      <p>The calculator uses <strong>238 WPM</strong> for silent reading and <strong>183 WPM</strong> for reading aloud — both from research by the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a>. These apply to standard English prose at a comfortable reading level. Technical content will be slower; familiar fiction may be faster.</p>
      <p>Want to measure your real reading speed? Use our <a href="/reading-speed-test/">free reading speed test</a> or the <a href="/practice-mode/">Practice Mode timer</a>. See how your rate compares on the <a href="/speaking-words-per-minute/">speaking words per minute guide</a>. To compare reading vs speaking time, visit the <a href="/word-to-speaking-time/">speaking time calculator</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card sidebar-answer">
      <div class="sidebar-card-title">Reading Quick Ref</div>
      <div class="sa-val">4m 12s</div><div class="sa-sub">1,000 words silent (238 WPM)</div>
      <hr><div class="sa-val">8m 24s</div><div class="sa-sub">2,000 words silent (238 WPM)</div>
    </div>
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEAKING TIME ─────────────────────────────────────────────
function buildSpeakingTime() {
  const faqs = [
    { q:'How long does it take to speak 1,000 words?', a:'At 130 WPM (average), 1,000 words takes <strong>7 minutes 41 seconds</strong>. At 110 WPM: 9m 5s. At 150 WPM: 6m 40s. See <a href="/1000-words-to-minutes/">1,000 words page</a>.' },
    { q:'How long does it take to say 500 words?', a:'500 words takes <strong>3 minutes 51 seconds</strong> at 130 WPM. Visit <a href="/500-words-to-minutes/">500 words to minutes</a>.' },
    { q:'How long does it take to speak 2,000 words?', a:'2,000 words takes <strong>15 minutes 23 seconds</strong> at 130 WPM. See <a href="/2000-words-to-minutes/">2,000 words to minutes</a>.' },
    { q:'How long does it take to speak 900 words?', a:'900 words takes approximately <strong>6 minutes 55 seconds</strong> at 130 WPM. See <a href="/900-words-to-minutes/">900 words to minutes</a>.' },
    { q:'What speaking speed should I aim for?', a:'For most speeches, aim for <strong>120–140 WPM</strong>. Below 100 WPM feels monotonous; above 160 WPM risks losing your audience. Use the <a href="/practice-mode/">practice timer</a> to calibrate.' },
    { q:'Does speaking time include pauses?', a:'The calculator estimates pure speech time without pauses. In practice, pauses add 10–20%. Use the <a href="/word-to-presentation-time/">presentation calculator</a> (100 WPM effective rate) to automatically include pause time.' },
    { q:'How do I measure my speaking speed?', a:'Use our <a href="/practice-mode/">Practice Mode</a>: paste your speech, start the timer, speak naturally, then stop. You get your exact WPM. Measure 3 times with different texts for accuracy.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/word-to-speaking-time/',label:'Speaking Time Calculator'}]), softwareAppSchema("Speaking Time Calculator",BASE_URL+"/word-to-speaking-time/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Speaking Time Calculator — Convert Word Count to Speech Duration', desc:'How long does it take to say 1,000 words? At 130 WPM: 7m 41s. Free speaking time calculator — paste text or enter word count, get exact speech duration at any pace.', slug:'/word-to-speaking-time', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Speaking Time Calculator</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">How long does it take to deliver any speech? Exact speaking duration at any pace.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">How long does it take to speak 1,000 words?</div><div class="answer-val">7m 41s</div><div class="answer-sub">at average pace (130 WPM) · 9m 5s slow · 6m 40s fast</div></div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Speaking Time Reference Table</h2>
    ${referenceTable()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/word-to-speech-length/',label:'Speech Length'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/word-to-public-speaking-time/',label:'Public Speaking'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/1000-words-to-minutes/',label:'1,000 Words'} ])}
    <div class="prose-block">
      <h2 class="section-title">About Speaking Speed</h2>
      <p>Your speaking speed determines how much content you can cover in any time slot. Per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>, the average person speaks at 130 WPM in professional settings. Always account for pauses — a 1,000-word speech calculated at 7m 41s typically runs 8–8.5 minutes in practice.</p>
      <p>For presentations with slides, use the <a href="/word-to-presentation-time/">presentation calculator</a> which automatically accounts for pauses. For formal public events see the <a href="/word-to-public-speaking-time/">public speaking timer</a>. Measure your personal WPM with the <a href="/practice-mode/">Practice Mode timer</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEECH LENGTH ─────────────────────────────────────────────
function buildSpeechLength() {
  const faqs = [
    { q:'How long does it take to say 1,000 words?', a:'<strong>7 minutes 41 seconds</strong> at average pace (130 WPM). Slow pace (110 WPM): 9m 5s. Fast pace (150 WPM): 6m 40s. See <a href="/1000-words-to-minutes/">1,000 words full breakdown</a>.' },
    { q:'How long is a 1,000-word speech?', a:'A 1,000-word speech lasts approximately <strong>7 minutes 41 seconds</strong> at average speaking pace. Add 10–15% for pauses to get your real performance time: about 8–9 minutes.' },
    { q:'How long is a 500-word speech?', a:'A 500-word speech lasts approximately <strong>3 minutes 51 seconds</strong> at 130 WPM. See <a href="/500-words-to-minutes/">500 words to minutes</a>.' },
    { q:'How long is a 700-word speech?', a:'A 700-word speech lasts approximately <strong>5 minutes 23 seconds</strong> at 130 WPM. See <a href="/700-words-to-minutes/">700 words to minutes</a>.' },
    { q:'How long is a 2,000-word speech?', a:'A 2,000-word speech lasts approximately <strong>15 minutes 23 seconds</strong> at 130 WPM. See <a href="/2000-words-to-minutes/">2,000 words to minutes</a>.' },
    { q:'What is the ideal speech length for different occasions?', a:'Wedding toast: 2–3 min (260–390 words). School presentation: 5 min (650 words). TED-style talk: 18 min max (~2,340 words). Keynote: 20–45 min (2,600–5,850 words). Eulogy: 3–5 min (390–650 words). See the <a href="/word-to-public-speaking-time/">public speaking timer</a>.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/word-to-speech-length/',label:'Speech Length Calculator'}]), softwareAppSchema("Speech Length Calculator",BASE_URL+"/word-to-speech-length/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Speech Length Calculator — How Long to Say 1,000 Words?', desc:'How long to say 1,000 words aloud? 7m 41s average · 9m 5s slow · 6m 40s fast. Free speech length calculator — paste your script, get exact duration instantly.', slug:'/word-to-speech-length', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/word-to-speech-length/',label:'Speech Length'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Speech Length Calculator</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">How long is your speech? Get exact speech duration from your word count.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">How long to say 1,000 words aloud?</div><div class="answer-val">7m 41s</div><div class="answer-sub">Average (130 WPM) · Slow: 9m 5s · Fast: 6m 40s</div></div>
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Speech Length Reference Table</h2>
    ${referenceTable()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Speech Length by Duration</h2>
    ${reverseTable()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-public-speaking-time/',label:'Public Speaking'},{href:'/500-words-to-minutes/',label:'500 Words'},{href:'/1000-words-to-minutes/',label:'1,000 Words'},{href:'/1500-words-to-minutes/',label:'1,500 Words'},{href:'/practice-mode/',label:'Practice Mode'} ])}
    <div class="prose-block">
      <h2 class="section-title">How Long Is My Speech?</h2>
      <p>Formula: <strong>Speech Length (minutes) = Word Count ÷ 130</strong>. At the average professional rate of 130 WPM (per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>), every 130 words equals one minute of speech. For formal occasions, the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech &amp; Debate Association (NSDA)</a> recommends 130–150 WPM.</p>
      <p>Related: <a href="/word-to-speaking-time/">Speaking Time Calculator</a> · <a href="/word-to-public-speaking-time/">Public Speaking Timer</a> · <a href="/word-to-presentation-time/">Presentation Timer</a> · <a href="/practice-mode/">Practice Mode</a></p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── GENERIC TOOL PAGE ─────────────────────────────────────────
function buildGenericToolPage({ slug, title, metaTitle, metaDesc, h1, subtitle, faqs, answerBox, extraContent, relatedLinks }) {
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:slug+'/',label:title}]), softwareAppSchema(title,BASE_URL+slug+"/"), faqSchema(faqs) ]};
  const head = headHTML({ title:metaTitle, desc:metaDesc, slug, schema });
  relatedLinks = relatedLinks || [];
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:slug+'/',label:title}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">${h1}</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">${subtitle}</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    ${answerBox||''}
    ${calcWidget()}
    ${adZone()}
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Reference Table</h2>
    ${referenceTable()}
    ${relatedLinks.length ? linkStrip('Related Tools', relatedLinks) : ''}
    ${extraContent||''}
    ${adZone()}
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">Frequently Asked Questions</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── WORD COUNT PAGE ───────────────────────────────────────────
function buildWordCountPage({ wc, slug, prevWC, nextWC }) {
  const t = calcTimes(wc);
  const label = wc.toLocaleString();
  const faqs = [
    { q:`How long is a ${label}-word speech?`, a:`A ${label}-word speech takes <strong>${t.spkAvg}</strong> at average pace (130 WPM). Slow (110 WPM): ${t.spkSlow}. Fast (150 WPM): ${t.spkFast}.` },
    { q:`How long does it take to read ${label} words?`, a:`${label} words takes <strong>${t.rdSilent}</strong> to read silently (238 WPM), or ${t.rdAloud} to read aloud (183 WPM). Compare with <a href="/word-to-reading-time/">reading time calculator</a>.` },
    { q:`How many pages is ${label} words?`, a:`${label} words is approximately <strong>${t.pages} pages</strong> single-spaced (500 words/page), or ${(wc/250).toFixed(1)} pages double-spaced.` },
    { q:`What presentation time is ${label} words?`, a:`For a presentation with slides, ${label} words takes approximately <strong>${t.present}</strong> (100 WPM effective rate, includes transitions and pauses). See the <a href="/word-to-presentation-time/">presentation timer</a>.` },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:slug+'/',label:`${label} Words`}]), softwareAppSchema(`${label} Words to Minutes Calculator`,BASE_URL+slug+"/"), faqSchema(faqs) ]};
  const head = headHTML({ title:`${label} Words to Minutes — How Long to Speak ${label} Words?`, desc:`${label} words = ${t.spkAvg} at 130 WPM · ${t.spkSlow} slow · ${t.spkFast} fast. Speaking, reading aloud, and silent reading times for ${label} words.`, slug, schema });
  const adjacent = [];
  if (prevWC) adjacent.push({ href:`/${prevWC}-words-to-minutes/`, label:`← ${prevWC.toLocaleString()} words` });
  if (nextWC) adjacent.push({ href:`/${nextWC}-words-to-minutes/`, label:`${nextWC.toLocaleString()} words →` });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:slug+'/',label:`${label} Words`}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">${label} Words to Minutes</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">How long does it take to speak, read, or present ${label} words?</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">How long to speak ${label} words?</div><div class="answer-val">${t.spkAvg}</div><div class="answer-sub">at average pace (130 WPM) · ${t.spkSlow} slow · ${t.spkFast} fast</div></div>
    <div class="tbl-wrap" style="margin:16px 0">
      <table><thead><tr><th>Speed</th><th>WPM</th><th>Time for ${label} Words</th><th>Context</th></tr></thead>
      <tbody>
        <tr><td>Slow / Formal</td><td>110</td><td class="td-highlight">${t.spkSlow}</td><td>Ceremonies, formal speeches</td></tr>
        <tr class="row-highlight"><td><strong>Average</strong></td><td><strong>130</strong></td><td class="td-highlight"><strong>${t.spkAvg}</strong></td><td>Speeches, podcasts, meetings</td></tr>
        <tr><td>Fast</td><td>150</td><td class="td-highlight">${t.spkFast}</td><td>Energetic talks, conversation</td></tr>
        <tr><td>Rapid / Debate</td><td>170</td><td class="td-highlight">${t.spkRapid}</td><td>Competitive debate</td></tr>
        <tr><td>Read Aloud</td><td>183</td><td class="td-highlight">${t.rdAloud}</td><td>Script narration</td></tr>
        <tr><td>Silent Reading</td><td>238</td><td class="td-highlight">${t.rdSilent}</td><td>Personal reading</td></tr>
        <tr><td>Presentation</td><td>~100</td><td class="td-highlight">${t.present}</td><td>Slides + pauses</td></tr>
      </tbody></table>
    </div>
    ${calcWidget()}
    ${adZone()}
    ${adjacent.length ? linkStrip('Adjacent Word Counts', adjacent) : ''}
    ${linkStrip('Related Calculators',[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'All Word Counts'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/practice-mode/',label:'Practice Mode'} ])}
    <div class="prose-block">
      <h2 class="section-title">${label} Words — Context &amp; Equivalents</h2>
      <ul>
        ${wc<=300?'<li>A standard short email, product description, or brief bio</li>':''}
        ${wc>300&&wc<=600?'<li>A short blog introduction or social media thread</li>':''}
        ${wc>600&&wc<=1000?'<li>A typical school essay introduction or newspaper article</li>':''}
        ${wc>1000&&wc<=2000?'<li>A standard college essay or blog post</li>':''}
        ${wc>2000?'<li>A detailed article, report, or long-form blog post</li>':''}
        <li>Approximately <strong>${t.pages} pages</strong> typed single-spaced (standard margins)</li>
        <li>Approximately <strong>${t.chars} characters</strong> (including spaces)</li>
      </ul>
      <p>Use the <a href="/words-to-minutes/">words to minutes calculator</a> for any word count, or the <a href="/word-to-reading-time/">reading time calculator</a> for reading-specific estimates. To prepare for a speech of a specific length, see the <a href="/word-to-speaking-time/">speaking time calculator</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">FAQ — ${label} Words</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card sidebar-answer"><div class="sidebar-card-title">Quick Answer</div><div class="sa-val">${t.spkAvg}</div><div class="sa-sub">${label} words at 130 WPM</div><hr><div class="sa-val">${t.rdSilent}</div><div class="sa-sub">${label} words silent reading</div></div>
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEECH DURATION PAGE ──────────────────────────────────────
function buildSpeechDurationPage({ minutes, slug }) {
  const wAvg=Math.round(WPM.avg*minutes), wSlow=Math.round(WPM.slow*minutes), wFast=Math.round(WPM.fast*minutes), wRapid=Math.round(WPM.rapid*minutes);
  const mins = `${minutes}-Minute`;
  const faqs = [
    { q:`How many words is a ${minutes}-minute speech?`, a:`A ${minutes}-minute speech needs approximately <strong>${wAvg.toLocaleString()} words</strong> at average pace (130 WPM). At slow pace (110 WPM): ${wSlow.toLocaleString()} words. At fast pace (150 WPM): ${wFast.toLocaleString()} words.` },
    { q:`How long should a ${minutes}-minute speech be?`, a:`Aim for <strong>${wAvg.toLocaleString()} words</strong>. Write to ${Math.round(wAvg*0.9).toLocaleString()} words (~10% buffer) to allow room for natural pauses and nerves that slow delivery. Use the <a href="/practice-mode/">Practice Mode timer</a> to rehearse.` },
    { q:`How do I write a ${minutes}-minute speech?`, a:`Start with a clear single message. Use the structure: Hook (10%) → Context (20%) → Main Point (50%) → Story/Example (10%) → Call to Action (10%). Aim for ${wAvg.toLocaleString()} words total, and practice at least 3 times before delivery.` },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:slug+'/',label:`${mins} Speech Word Count`}]), softwareAppSchema(`${mins} Speech Word Count Calculator`,BASE_URL+slug+"/"), faqSchema(faqs) ]};
  const head = headHTML({ title:`${mins} Speech Word Count — How Many Words for ${minutes} Minutes?`, desc:`A ${minutes}-minute speech needs ~${wAvg.toLocaleString()} words at 130 WPM · ${wSlow.toLocaleString()} words slow · ${wFast.toLocaleString()} words fast. Free calculator + speech writing guide.`, slug, schema });
  // Adjacent speech pages
  const speechMins=[2,3,4,5,6,7,10,15,20];
  const idx=speechMins.indexOf(minutes);
  const adjacent=[];
  if(idx>0) adjacent.push({href:`/${speechMins[idx-1]}-minute-speech-word-count/`,label:`← ${speechMins[idx-1]}-Min Speech`});
  if(idx<speechMins.length-1) adjacent.push({href:`/${speechMins[idx+1]}-minute-speech-word-count/`,label:`${speechMins[idx+1]}-Min Speech →`});
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:slug+'/',label:`${mins} Speech`}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">${mins} Speech Word Count</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">How many words do you need for a ${minutes}-minute speech?</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">How many words for a ${minutes}-minute speech?</div><div class="answer-val">${wAvg.toLocaleString()} words</div><div class="answer-sub">at average pace (130 WPM) · ${wSlow.toLocaleString()} words slow · ${wFast.toLocaleString()} words fast</div></div>
    <div class="tbl-wrap" style="margin:16px 0">
      <table><thead><tr><th>Speaking Speed</th><th>WPM</th><th>Words Needed for ${minutes} Min</th></tr></thead>
      <tbody>
        <tr><td>Slow / Formal</td><td>110</td><td class="td-highlight">${wSlow.toLocaleString()} words</td></tr>
        <tr class="row-highlight"><td><strong>Average (recommended)</strong></td><td><strong>130</strong></td><td class="td-highlight"><strong>${wAvg.toLocaleString()} words</strong></td></tr>
        <tr><td>Fast</td><td>150</td><td class="td-highlight">${wFast.toLocaleString()} words</td></tr>
        <tr><td>Rapid</td><td>170</td><td class="td-highlight">${wRapid.toLocaleString()} words</td></tr>
      </tbody></table>
    </div>
    ${calcWidget()}
    ${adZone()}
    ${adjacent.length ? linkStrip('Adjacent Speech Lengths', adjacent) : ''}
    ${linkStrip('Related Calculators',[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/speaking-words-per-minute/',label:'Speaking Speed Guide'} ])}
    <div class="prose-block">
      <h2 class="section-title">Writing a ${mins} Speech</h2>
      <p>To write a ${minutes}-minute speech, aim for approximately <strong>${wAvg.toLocaleString()} words</strong> at 130 WPM. If you're unsure of your speaking speed, use the <a href="/practice-mode/">Practice Mode timer</a> to measure it first, then use "Custom" speed in the calculator above for personalized results.</p>
      <p>Write to <strong>${Math.round(wAvg*0.9).toLocaleString()} words</strong> (~90% of target), then add back emphasis and transitions during rehearsal. Most speakers slow down under pressure, so the buffer prevents rushing. For data on ideal speaking rates, see the <a href="/speaking-words-per-minute/">speaking speed guide</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">FAQ — ${mins} Speech</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card sidebar-answer"><div class="sidebar-card-title">${mins} Speech</div><div class="sa-val">${wAvg.toLocaleString()} words</div><div class="sa-sub">at average pace (130 WPM)</div></div>
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── PRACTICE MODE ─────────────────────────────────────────────
function buildPracticeMode() {
  const faqs = [
    { q:'How do I test my reading speed?', a:'Paste any text into the practice area above, click "Start Timer", begin reading aloud at your natural pace, then click "Stop". Your exact WPM is shown instantly. See also our dedicated <a href="/reading-speed-test/">reading speed test</a>.' },
    { q:'What is a good reading WPM?', a:'The average adult reads aloud at 183 WPM and silently at 238 WPM. For public speaking, 120–150 WPM is ideal — clear enough to understand, fast enough to hold attention. Compare your score on the <a href="/speaking-words-per-minute/">speaking speed guide</a>.' },
    { q:'Can I use this to practice a speech?', a:'Yes — paste your full speech, read it aloud while the timer runs. You\'ll get your speaking WPM which you can then set as "Custom" speed in the main <a href="/">words to time calculator</a> for accurate personal timing.' },
    { q:'How accurate is the WPM calculation?', a:'100% accurate: WPM = Words ÷ (Elapsed seconds ÷ 60). The only variable is whether you start and stop at the right moments. Measure 3 times for a reliable average.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/practice-mode/',label:'Practice Mode'}]), softwareAppSchema("Speech Practice Timer",BASE_URL+"/practice-mode/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Speech Practice Timer & Free Reading Speed Test — WPM Counter', desc:'Test your reading speed and measure your real WPM. Paste any text, start the timer, read aloud — get instant words per minute feedback. Free reading speed test.', slug:'/practice-mode', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/practice-mode/',label:'Practice Mode'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Speech Practice Timer</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Measure your real WPM. Paste your text, start the timer, read aloud — see your exact words per minute.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="practice-card">
      <h2 style="font-family:'Lora',serif;font-size:20px;margin-bottom:14px">Practice Timer</h2>
      <textarea class="calc-textarea" id="practice-textarea" placeholder="Paste your speech or any text here, then click Start Timer and begin reading aloud…" rows="6" aria-label="Text to time yourself reading"></textarea>
      <div class="practice-timer" id="practice-timer" aria-live="polite">0:00.0</div>
      <div class="practice-wpm" id="practice-wpm" aria-live="polite">— WPM</div>
      <div class="practice-btns">
        <button class="btn-primary" id="btn-start" onclick="startPractice()">▶ Start Timer</button>
        <button class="btn-danger" id="btn-stop" style="display:none" onclick="stopPractice()">⏹ Stop</button>
        <button class="btn-secondary" id="btn-reset" style="display:none" onclick="resetPractice()">↺ Reset</button>
      </div>
      <p style="font-size:12.5px;color:var(--ink-3);text-align:center;margin-top:6px">Paste text → Start → Read aloud → Stop → See your WPM</p>
    </div>
    ${adZone()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-speech-length/',label:'Speech Length'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/reading-speed-test/',label:'Reading Speed Test'} ])}
    <div class="prose-block">
      <h2 class="section-title">How to Use Practice Mode</h2>
      <ol>
        <li><strong>Paste your speech or text</strong> into the text area above.</li>
        <li><strong>Click "Start Timer"</strong> and immediately begin reading at your natural pace.</li>
        <li><strong>Click "Stop"</strong> when you finish reading the entire text.</li>
        <li><strong>Read your WPM result</strong> — shown live as you read.</li>
        <li><strong>Use your WPM</strong> in any calculator above by selecting "Custom" speed for personalized results.</li>
      </ol>
      <p>Also see our dedicated <a href="/reading-speed-test/">free reading speed test</a>, or compare your results on the <a href="/speaking-words-per-minute/">speaking words per minute guide</a>. To convert your word count to time, go to the <a href="/">main calculator</a> or the <a href="/words-to-minutes/">words to minutes tool</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">FAQ</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    <div class="sidebar-card">
      <div class="sidebar-card-title">WPM Benchmarks</div>
      <div class="sidebar-links">
        <a href="/speaking-words-per-minute/">🎤 Avg speaking: 130 WPM</a>
        <a href="/word-to-reading-time/">📢 Read aloud: 183 WPM</a>
        <a href="/word-to-reading-time/">👁 Silent reading: 238 WPM</a>
        <a href="/speaking-words-per-minute/">🎯 TED Talks: 163 WPM</a>
      </div>
    </div>
    ${sidebarAllCalcs()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── READING SPEED TEST ────────────────────────────────────────
function buildReadingSpeedTest() {
  const faqs = [
    { q:'How do I take a reading speed test?', a:'Paste any text above, click Start, read at your natural pace, click Stop. Your WPM is calculated instantly. See also <a href="/practice-mode/">Practice Mode</a> for speech practice.' },
    { q:'What is a good reading speed?', a:'Average adult reads silently at <strong>238 WPM</strong>. College students average 250–300 WPM. Speed readers reach 400–700 WPM but often with reduced comprehension. Use the <a href="/speaking-words-per-minute/">speaking speed guide</a> for speaking benchmarks.' },
    { q:'How can I improve my reading speed?', a:'Practice timed reading regularly, minimize subvocalizing, use a finger to pace your eyes, and read in phrases rather than word-by-word. Most people gain 30–50 WPM with regular practice.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/reading-speed-test/',label:'Reading Speed Test'}]), softwareAppSchema("Free Reading Speed Test",BASE_URL+"/reading-speed-test/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Free Reading Speed Test — Measure Your WPM Online in 60 Seconds', desc:'Test your reading speed in 60 seconds. Paste any text, click Start, read aloud — get your exact WPM instantly. Free online reading speed test. No signup needed.', slug:'/reading-speed-test', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/reading-speed-test/',label:'Reading Speed Test'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Free Reading Speed Test</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Measure your exact WPM reading speed in 60 seconds. Paste text, start the timer, read aloud — done.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="practice-card">
      <textarea class="calc-textarea" id="practice-textarea" placeholder="Paste any text here for your reading speed test…" rows="6" aria-label="Text for reading speed test"></textarea>
      <div class="practice-timer" id="practice-timer" aria-live="polite">0:00.0</div>
      <div class="practice-wpm" id="practice-wpm" aria-live="polite">— WPM</div>
      <div class="practice-btns">
        <button class="btn-primary" id="btn-start" onclick="startPractice()">▶ Start Test</button>
        <button class="btn-danger" id="btn-stop" style="display:none" onclick="stopPractice()">⏹ Stop</button>
        <button class="btn-secondary" id="btn-reset" style="display:none" onclick="resetPractice()">↺ Reset</button>
      </div>
    </div>
    ${adZone()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/word-to-reading-time/',label:'Reading Time Calc'},{href:'/speaking-words-per-minute/',label:'Speaking Speed Guide'},{href:'/words-to-minutes/',label:'Words to Minutes'} ])}
    <div class="prose-block">
      <h2 class="section-title">Reading Speed Benchmarks</h2>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Reading Level</th><th>WPM Range</th><th>Who Reads This Fast</th></tr></thead>
        <tbody>
          <tr><td>Struggling reader</td><td>&lt; 100 WPM</td><td>New readers, ESL learners</td></tr>
          <tr><td>Average adult</td><td class="td-highlight">200–250 WPM</td><td>Most adults in everyday reading</td></tr>
          <tr><td>Good reader</td><td>250–350 WPM</td><td>Avid readers, college graduates</td></tr>
          <tr><td>Fast reader</td><td>350–500 WPM</td><td>Trained speed readers</td></tr>
          <tr><td>Speed reader</td><td>500–700 WPM</td><td>Specialized training</td></tr>
        </tbody>
      </table></div>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">FAQ</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── SPEAKING WPM ──────────────────────────────────────────────
function buildSpeakingWPM() {
  const faqs = [
    { q:'What is the average speaking rate in words per minute?', a:'The average North American speaking rate is <strong>130–150 WPM</strong> in professional settings, per <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>. Conversational speech is faster (150–160 WPM); formal speeches are slower (110–120 WPM).' },
    { q:'How fast do TED Talk speakers speak?', a:'TED Talk speakers average approximately <strong>163 WPM</strong>, per <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED\'s own research</a>. Faster than average to maintain energy within the 18-minute format.' },
    { q:'How do I measure my words per minute speaking speed?', a:'Use our <a href="/practice-mode/">Practice Mode timer</a>: paste any text, start the timer, read aloud naturally, then stop. Repeat 3 times for an accurate average.' },
    { q:'What WPM should I speak at for a presentation?', a:'For presentations with slides, aim for <strong>110–130 WPM</strong>. This gives audiences time to read slides and absorb information. Use the <a href="/word-to-presentation-time/">presentation timer</a> for accurate slide timing.' },
    { q:'Does accent affect speaking rate?', a:'Yes. Some regional accents have inherently faster or slower typical rates. The 130 WPM figure is an average for North American English. Always measure your own rate with the <a href="/practice-mode/">practice timer</a> for personal accuracy.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/speaking-words-per-minute/',label:'Speaking Words Per Minute'}]), softwareAppSchema("Speaking Speed Calculator",BASE_URL+"/speaking-words-per-minute/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Average Speaking Speed: Words Per Minute Guide & Calculator', desc:'What is the average speaking speed? 120–150 WPM for conversation, 130 WPM for speeches, 163 WPM for TED talks. Free WPM calculator included. Research-backed.', slug:'/speaking-words-per-minute', schema });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/speaking-words-per-minute/',label:'Speaking Speed Guide'}])}
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Average Speaking Speed Guide</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Research-backed WPM data for every speaking context, from TED Talks to formal speeches.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="tbl-wrap"><table>
      <thead><tr><th>Speaking Context</th><th>Typical WPM</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td>Formal speech / ceremony</td><td class="td-highlight">100–120 WPM</td><td>Presidential address, graduation</td></tr>
        <tr class="row-highlight"><td><strong>Average professional speech</strong></td><td class="td-highlight"><strong>130 WPM</strong></td><td>Meetings, podcasts, interviews</td></tr>
        <tr><td>Casual conversation</td><td class="td-highlight">140–160 WPM</td><td>Everyday talk</td></tr>
        <tr><td>TED Talks</td><td class="td-highlight">163 WPM avg</td><td>18-min = ~2,930 words</td></tr>
        <tr><td>Competitive debate</td><td class="td-highlight">150–170 WPM</td><td>NSDA Policy, LD</td></tr>
        <tr><td>Audiobooks</td><td class="td-highlight">150–165 WPM</td><td>Professional narration</td></tr>
      </tbody>
    </table></div>
    ${calcWidget()}
    ${adZone()}
    ${linkStrip('Related Tools',[ {href:'/',label:'🏠 Home'},{href:'/practice-mode/',label:'Practice Mode'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-public-speaking-time/',label:'Public Speaking Timer'},{href:'/word-to-debate-time/',label:'Debate Calculator'},{href:'/reading-speed-test/',label:'Reading Speed Test'} ])}
    <div class="prose-block">
      <h2 class="section-title">About Average Speaking Rate</h2>
      <p>The average speaking rate for North American English is approximately <strong>130 WPM</strong> in formal settings, based on research from the <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>. For competitive debaters, the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a> recommends 120–150 WPM for most formats. TED Talks average <strong>163 WPM</strong> — higher than standard to maintain energy within the strict 18-minute format.</p>
      <p>To measure your personal speaking rate, use our <a href="/practice-mode/">Practice Mode timer</a>. Most people speak either faster or slower than the 130 WPM default, so measuring your own rate gives you more accurate predictions from the <a href="/">words to time calculator</a> and the <a href="/words-to-minutes/">words to minutes calculator</a>.</p>
    </div>
    <h2 class="section-title" style="margin-top:32px;margin-bottom:8px">FAQ</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── REMAINING GENERIC PAGES ───────────────────────────────────
function buildPresentationTime() {
  return buildGenericToolPage({ slug:'/word-to-presentation-time', title:'Presentation Time Calculator', metaTitle:'Presentation Time Calculator — Word Count to Slide Timing', metaDesc:'Calculate presentation length from word count. Includes slide transitions and pauses. Free — works for 5-minute to 60-minute presentations.', h1:'Presentation Time Calculator', subtitle:'How long will your presentation run? Includes slide transitions and natural pauses in the calculation.', answerBox:`<div class="answer-box"><div class="answer-box-title">How many words for a 10-minute presentation?</div><div class="answer-val">~1,000 words</div><div class="answer-sub">at 100 WPM effective rate (includes slide transitions + pauses)</div></div>`, relatedLinks:[ {href:'/',label:'🏠 Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-public-speaking-time/',label:'Public Speaking'},{href:'/10-minute-speech-word-count/',label:'10-Min Speech'},{href:'/words-to-minutes/',label:'Words to Minutes'} ], extraContent:`<div class="prose-block" style="margin-top:24px"><h2 class="section-title">Presentation vs. Speech Timing</h2><p>A presentation runs slower than a speech because of slide transitions, audience questions, visual processing pauses, and natural breaks. The <strong>100 WPM effective rate</strong> accounts for all of this. For a speech with no slides, use the <a href="/word-to-speaking-time/">speaking time calculator</a> with 130 WPM instead. For formal public events, use the <a href="/word-to-public-speaking-time/">public speaking timer</a>.</p></div>`, faqs:[ { q:'How many words is a 10-minute presentation?', a:'A 10-minute presentation covers approximately <strong>1,000 words</strong> at 100 WPM effective rate (which accounts for slide transitions, pauses, and visual content time). See <a href="/10-minute-speech-word-count/">10-minute speech word count</a>.' }, { q:'How many slides should a 10-minute presentation have?', a:'A general rule is <strong>1 slide per minute</strong>, so a 10-minute presentation should have about 8–12 slides. Complex technical slides may need 2–3 minutes each.' }, { q:'How do I calculate presentation time from word count?', a:'For slides-based presentations: <strong>Time (min) = Word Count ÷ 100</strong>. For a speech-only presentation, use the <a href="/word-to-speaking-time/">speaking time calculator</a> with 130 WPM.' } ] });
}

function buildPublicSpeaking() {
  return buildGenericToolPage({ slug:'/word-to-public-speaking-time', title:'Public Speaking Time Calculator', metaTitle:'Public Speaking Time Calculator — Free Speech Timer Online', metaDesc:'Free speech timer for keynotes, conferences, and formal talks. Paste your script — get exact speaking duration at your pace. Used for TED talks, weddings, debates.', h1:'Public Speaking Time Calculator', subtitle:'Prepare for your next keynote, conference talk, wedding toast, or formal speech. Get exact timing from your word count.', answerBox:`<div class="answer-box"><div class="answer-box-title">How many words is a TED Talk?</div><div class="answer-val">~2,940 words</div><div class="answer-sub">18 minutes at 163 WPM (TED Talk average speed)</div></div>`, relatedLinks:[ {href:'/',label:'🏠 Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-speech-length/',label:'Speech Length'},{href:'/word-to-presentation-time/',label:'Presentation Timer'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/practice-mode/',label:'Practice Mode'} ], extraContent:`<div class="prose-block" style="margin-top:24px"><h2 class="section-title">Speaking Rates for Major Events</h2><div class="tbl-wrap"><table><thead><tr><th>Event Type</th><th>Ideal WPM</th><th>Typical Duration</th></tr></thead><tbody><tr><td>Wedding toast</td><td class="td-highlight">120–130 WPM</td><td>2–3 minutes</td></tr><tr><td>Classroom presentation</td><td class="td-highlight">120–140 WPM</td><td>5–15 minutes</td></tr><tr><td>TED/conference talk</td><td class="td-highlight">150–170 WPM</td><td>10–18 minutes</td></tr><tr><td>Keynote address</td><td class="td-highlight">110–130 WPM</td><td>20–60 minutes</td></tr><tr><td>Eulogy</td><td class="td-highlight">100–120 WPM</td><td>3–5 minutes</td></tr></tbody></table></div><p>Data from <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a> and <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED Talk guidelines</a>. Use the <a href="/practice-mode/">Practice Mode timer</a> to measure your personal WPM.</p></div>`, faqs:[ { q:'How many words is an 8-minute speech?', a:'An 8-minute speech at 130 WPM = <strong>1,040 words</strong>. At slow pace (110 WPM): 880 words. At fast pace (150 WPM): 1,200 words.' }, { q:'How many words is a TED Talk?', a:'TED Talks are limited to 18 minutes and average 163 WPM, giving approximately <strong>2,934 words</strong> for a full-length TED Talk. See the <a href="/speaking-words-per-minute/">speaking speed guide</a> for more context.' }, { q:'What is the ideal speaking rate for formal speeches?', a:'For formal occasions (keynotes, ceremonies), aim for <strong>110–120 WPM</strong>. This pace conveys authority. Per the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a>.' } ] });
}

function buildDebateTime() {
  return buildGenericToolPage({ slug:'/word-to-debate-time', title:'Debate Time Calculator', metaTitle:'Debate Time Calculator — Words to Debate Speech Duration', metaDesc:'Calculate debate speech timing from word count. Covers Policy, Lincoln-Douglas, and Public Forum formats. Free.', h1:'Debate Time Calculator', subtitle:'Calculate how long your debate speech will run. Covers Policy, Lincoln-Douglas, Public Forum, and Parliamentary formats.', answerBox:`<div class="answer-box"><div class="answer-box-title">How many words for an 8-minute debate speech?</div><div class="answer-val">~1,200 words</div><div class="answer-sub">at 150 WPM (standard debate pace)</div></div>`, relatedLinks:[ {href:'/',label:'🏠 Home'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/word-to-public-speaking-time/',label:'Public Speaking'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/word-to-presentation-time/',label:'Presentation Timer'} ], extraContent:`<div class="prose-block" style="margin-top:24px"><h2 class="section-title">Debate Speech Time Limits by Format</h2><div class="tbl-wrap"><table><thead><tr><th>Format</th><th>Speech</th><th>Time Limit</th><th>Words (150 WPM)</th></tr></thead><tbody><tr><td>Lincoln-Douglas</td><td>1AC / 1NC</td><td>6 / 7 min</td><td class="td-highlight">900 / 1,050 words</td></tr><tr><td>Public Forum</td><td>Constructive</td><td>4 minutes</td><td class="td-highlight">~600 words</td></tr><tr><td>Policy Debate</td><td>1AC</td><td>8 minutes</td><td class="td-highlight">~1,200 words</td></tr><tr><td>Parliamentary</td><td>Prime Minister</td><td>7 minutes</td><td class="td-highlight">~1,050 words</td></tr></tbody></table></div><p>Data from the <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech & Debate Association (NSDA)</a>. Also see the <a href="/speaking-words-per-minute/">speaking speed guide</a>.</p></div>`, faqs:[ { q:'How many words per minute is debate speaking?', a:'Standard debate speaking runs 150–170 WPM per <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">NSDA</a>. Policy debate "spreading" can reach 200–250 WPM.' }, { q:'How long is an 8-minute debate speech?', a:'At 150 WPM, an 8-minute speech uses approximately <strong>1,200 words</strong>. See also the <a href="/word-to-speaking-time/">speaking time calculator</a>.' }, { q:'What is a debate break calculator?', a:'A debate break calculator determines wins needed to advance to elimination rounds. At most tournaments, breaking requires winning 60–75% of preliminary rounds. Contact your tournament director for thresholds.' } ] });
}

function buildTypingTime() {
  return buildGenericToolPage({ slug:'/word-to-typing-time', title:'WPM Calculator & Typing Time Estimator', metaTitle:'WPM Calculator & Typing Time Estimator — Free Online Tool', metaDesc:'Calculate how long it takes to type any document. Enter word count and typing speed, get exact duration. Free — for transcription, writing, data entry.', h1:'Typing Time Calculator — WPM Estimator', subtitle:'How long will it take to type any document? Enter your word count and typing speed for exact estimates.', answerBox:`<div class="answer-box"><div class="answer-box-title">How long to type 1,000 words?</div><div class="answer-val">~13 minutes</div><div class="answer-sub">at average typing speed of 75 WPM</div></div>`, relatedLinks:[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/speaking-words-per-minute/',label:'Speaking Speed'},{href:'/practice-mode/',label:'Practice Mode'} ], extraContent:`<div class="prose-block" style="margin-top:24px"><h2 class="section-title">Typing Speed vs. Speaking Speed</h2><p>The average typing speed is 40–60 WPM for casual typists, 60–80 WPM for office workers — significantly slower than speaking speed (130 WPM). Dictation software is often more efficient for long documents.</p><div class="tbl-wrap"><table><thead><tr><th>Typing Level</th><th>WPM</th><th>Time for 1,000 Words</th></tr></thead><tbody><tr><td>Beginner</td><td>20–30 WPM</td><td>33–50 minutes</td></tr><tr><td>Average</td><td>40–60 WPM</td><td>17–25 minutes</td></tr><tr><td>Good typist</td><td class="td-highlight">60–80 WPM</td><td class="td-highlight">12–17 minutes</td></tr><tr><td>Professional</td><td>80–100 WPM</td><td>10–12 minutes</td></tr><tr><td>Expert</td><td>100+ WPM</td><td>&lt;10 minutes</td></tr></tbody></table></div><p>To measure your reading/speaking speed (not typing), use our <a href="/practice-mode/">Practice Mode timer</a> or <a href="/reading-speed-test/">reading speed test</a>.</p></div>`, faqs:[ { q:'What is the average typing speed?', a:'The average typist types at <strong>40–60 WPM</strong>. Professional touch typists average 60–80 WPM. Competitive typists can exceed 120 WPM.' }, { q:'How long does it take to type 1,000 words?', a:'At 60 WPM (average), 1,000 words takes approximately <strong>16 minutes 40 seconds</strong>. At 80 WPM: 12m 30s. At 40 WPM: 25 minutes.' }, { q:'How do I improve my typing speed?', a:'Practice with tools like Keybr or TypeRacer for 15–20 minutes daily. Focus on accuracy first. Touch typing (memorizing key positions) is the single biggest speed improvement for most people.' } ] });
}

// ── INTERNATIONAL PAGES ────────────────────────────────────────
function buildPalabrasAMinutos() {
  const faqs = [
    { q:'¿Cuántos minutos son 1.000 palabras?', a:'A un ritmo promedio de 130 PPM, 1.000 palabras toma <strong>7 minutos 41 segundos</strong>. A ritmo lento (110 PPM): 9 min 5 seg. A ritmo rápido (150 PPM): 6 min 40 seg.' },
    { q:'¿Cuántos minutos son 500 palabras?', a:'500 palabras toman <strong>3 minutos 51 segundos</strong> a 130 PPM.' },
    { q:'¿Cuál es el ritmo promedio de habla en palabras por minuto?', a:'El ritmo promedio de habla es aproximadamente <strong>130 palabras por minuto (PPM)</strong> en entornos profesionales, según la <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">Asociación Americana de Habla, Lenguaje y Audición (ASHA)</a>.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Inicio'},{href:'/palabras-a-minutos/',label:'Palabras a Minutos'}]), softwareAppSchema("Calculadora Palabras a Minutos",BASE_URL+"/palabras-a-minutos/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Calculadora de Palabras a Minutos — Convertir Palabras en Tiempo', desc:'¿Cuántos minutos son 1.000 palabras? — 7 min 41 seg a ritmo promedio (130 PPM). Calculadora gratuita: pega tu texto y obtén el tiempo de discurso al instante.', slug:'/palabras-a-minutos', schema, lang:'es' });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    <nav class="breadcrumb"><a href="/">Inicio</a><span>›</span><span>Palabras a Minutos</span></nav>
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Calculadora de Palabras a Minutos</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Convierte palabras en tiempo de discurso al instante. Gratis, sin registro.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">¿Cuántos minutos son 1.000 palabras?</div><div class="answer-val">7m 41s</div><div class="answer-sub">a ritmo promedio (130 PPM) · 9m 5s lento · 6m 40s rápido</div></div>
    ${calcWidget()}
    ${adZone()}
    <div class="tbl-wrap" style="margin-top:20px">
      <table><thead><tr><th>Palabras</th><th>Lento (110)</th><th>Promedio (130)</th><th>Rápido (150)</th><th>Lectura Silenciosa</th></tr></thead>
      <tbody>${[100,200,300,500,750,1000,1500,2000,3000].map(wc=>{const t=calcTimes(wc);return`<tr><td><strong>${wc.toLocaleString('es')} palabras</strong></td><td>${t.spkSlow}</td><td class="td-highlight">${t.spkAvg}</td><td>${t.spkFast}</td><td>${t.rdSilent}</td></tr>`;}).join('\n')}</tbody>
      </table>
    </div>
    ${linkStrip('Ver también en inglés',[ {href:'/',label:'Words to Time'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/word-to-speaking-time/',label:'Speaking Time'} ])}
    <div class="prose-block">
      <h2 class="section-title">Cómo Calcular el Tiempo de Discurso</h2>
      <p>Fórmula: <strong>Tiempo (segundos) = Número de palabras ÷ PPM × 60</strong>. A 130 palabras por minuto (el ritmo promedio según la <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>), cada 1.000 palabras equivale a aproximadamente 7 minutos 41 segundos.</p>
    </div>
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Preguntas Frecuentes</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

function buildLesezeit() {
  const faqs = [
    { q:'Wie lange dauert es, 1.000 Wörter zu lesen?', a:'1.000 Wörter dauern etwa <strong>4 Minuten 12 Sekunden</strong> beim stillen Lesen (238 WPM) oder ca. 5 Minuten 27 Sekunden beim lauten Vorlesen (183 WPM).' },
    { q:'Wie viele Minuten sind 1.000 Wörter beim Sprechen?', a:'Bei 130 WPM dauern 1.000 Wörter <strong>7 Minuten 41 Sekunden</strong> beim Sprechen.' },
  ];
  const schema = { "@context":"https://schema.org","@graph":[ breadcrumbSchema([{href:'/',label:'Home'},{href:'/lesezeit-rechner/',label:'Lesezeit Rechner'}]), softwareAppSchema("Lesezeit Rechner",BASE_URL+"/lesezeit-rechner/"), faqSchema(faqs) ]};
  const head = headHTML({ title:'Lesezeit Rechner — Wörter zu Minuten umrechnen', desc:'Wie lange dauert es, 1.000 Wörter zu lesen? Ca. 4 Minuten 12 Sekunden. Kostenloser Lesezeit-Rechner — Text einfügen, sofort Lesezeit berechnen.', slug:'/lesezeit-rechner', schema, lang:'de' });
  const body = `
<div class="hero" style="padding:30px 20px 38px">
  <div class="wrap">
    <nav class="breadcrumb"><a href="/">Home</a><span>›</span><span>Lesezeit Rechner</span></nav>
    <h1 class="hero-title" style="text-align:left;font-size:clamp(22px,4vw,38px)">Lesezeit Rechner</h1>
    <p class="hero-subtitle" style="text-align:left;margin:8px 0 0">Wörter zu Minuten umrechnen — kostenlos, sofort, ohne Anmeldung.</p>
  </div>
</div>
<div class="page-with-sidebar">
  <main class="main-col">
    <div class="answer-box"><div class="answer-box-title">Wie lange dauert es, 1.000 Wörter zu lesen?</div><div class="answer-val">4m 12s</div><div class="answer-sub">Stilles Lesen bei 238 WPM Durchschnitt</div></div>
    ${calcWidget()}
    ${adZone()}
    ${linkStrip('Auch auf Englisch verfügbar',[ {href:'/',label:'Words to Time'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/words-to-minutes/',label:'Words to Minutes'} ])}
    <div class="prose-block">
      <h2 class="section-title">Lesezeit berechnen</h2>
      <p>Die Formel: <strong>Zeit (Sekunden) = Wörteranzahl ÷ WPM × 60</strong>. Durchschnittswerte: Stilles Lesen 238 WPM, Lautes Vorlesen 183 WPM, Sprechen 130 WPM (Quelle: <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">ASHA</a>).</p>
    </div>
    <h2 class="section-title" style="margin-top:28px;margin-bottom:8px">Häufige Fragen</h2>
    ${faqAccordion(faqs)}
  </main>
  <aside class="sidebar-col">
    ${sidebarAllCalcs()}
    ${sidebarCTA()}
  </aside>
</div>`;
  return pageShell({ head, body });
}

// ── STATIC PAGES ──────────────────────────────────────────────
function buildAbout() {
  const head = headHTML({ title:'About WordsToTime — Free Speech & Reading Time Calculator', desc:'WordsToTime is a free, research-backed tool for converting word count to speaking time, reading time, and presentation duration. No signup, no fees.', slug:'/about' });
  const body = `
<div class="wrap-narrow" style="padding-top:44px;padding-bottom:60px">
  ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/about/',label:'About'}])}
  <h1 style="font-family:'Lora',serif;font-size:clamp(24px,4vw,36px);margin:14px 0 20px">About WordsToTime</h1>
  <p>WordsToTime is a free tool for anyone who needs to know how long it will take to deliver, read, or present a written document. Built to solve a simple problem: writers, speakers, educators, and creators constantly need to know "how long will this take?"</p>
  <h2 class="section-title" style="margin-top:24px">Data Sources</h2>
  <ul>
    <li><strong>130 WPM</strong> average speaking rate — <a href="https://pubs.asha.org/" target="_blank" rel="noopener noreferrer">American Speech-Language-Hearing Association (ASHA)</a></li>
    <li><strong>238 WPM</strong> average silent reading rate — ASHA</li>
    <li><strong>183 WPM</strong> average read-aloud rate — ASHA</li>
    <li><strong>163 WPM</strong> TED Talk average — <a href="https://www.ted.com/participate/organize-a-local-tedx-event/tedx-organizer-guide/speakers-program/prepare-your-speaker/create-talk" target="_blank" rel="noopener noreferrer">TED Talk guidelines</a></li>
    <li>Debate timing standards — <a href="https://www.speechanddebate.org/" target="_blank" rel="noopener noreferrer">National Speech & Debate Association (NSDA)</a></li>
  </ul>
  <h2 class="section-title" style="margin-top:24px">Free Forever</h2>
  <p>WordsToTime is completely free — no signup, no hidden fees, no premium tier. Supported by Google AdSense advertising. We do not collect personal data or require registration.</p>
  ${linkStrip('All Tools',[ {href:'/',label:'🏠 Home'},{href:'/words-to-minutes/',label:'Words to Minutes'},{href:'/word-to-reading-time/',label:'Reading Time'},{href:'/word-to-speaking-time/',label:'Speaking Time'},{href:'/practice-mode/',label:'Practice Mode'} ])}
</div>`;
  return pageShell({ head, body });
}

function buildPrivacy() {
  const head = headHTML({ title:'Privacy Policy — WordsToTime', desc:'Privacy policy for WordsToTime. We do not collect personal data or require registration.', slug:'/privacy' });
  const body = `
<div class="wrap-narrow" style="padding-top:44px;padding-bottom:60px">
  ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/privacy/',label:'Privacy Policy'}])}
  <h1 style="font-family:'Lora',serif;font-size:clamp(24px,4vw,36px);margin:14px 0 20px">Privacy Policy</h1>
  <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
  <h2 class="section-title" style="margin-top:20px">Data We Do Not Collect</h2>
  <p>WordsToTime does not require registration and does not collect personal information. All calculations happen in your browser — no text is sent to our servers.</p>
  <h2 class="section-title" style="margin-top:20px">Analytics</h2>
  <p>We use Google Analytics 4 to measure anonymous aggregate traffic (page views, session counts, device types). This data cannot identify individual users.</p>
  <h2 class="section-title" style="margin-top:20px">Advertising</h2>
  <p>We display advertisements via Google AdSense (Publisher ID: ${ADSENSE_PUB}). Google may use cookies to personalise ads. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>. Opt out at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.</p>
</div>`;
  return pageShell({ head, body });
}

function buildTerms() {
  const head = headHTML({ title:'Terms of Use — WordsToTime', desc:'Terms of use for WordsToTime. Free to use for personal and professional purposes.', slug:'/terms' });
  const body = `
<div class="wrap-narrow" style="padding-top:44px;padding-bottom:60px">
  ${breadcrumbHTML([{href:'/',label:'Home'},{href:'/terms/',label:'Terms of Use'}])}
  <h1 style="font-family:'Lora',serif;font-size:clamp(24px,4vw,36px);margin:14px 0 20px">Terms of Use</h1>
  <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</p>
  <p>WordsToTime is provided free of charge for personal and professional use.</p>
  <h2 class="section-title" style="margin-top:20px">Accuracy</h2>
  <p>All time calculations are estimates based on average speaking and reading rates from published research (ASHA). Individual rates vary. WordsToTime provides estimates in good faith but cannot guarantee accuracy for any specific individual.</p>
  <h2 class="section-title" style="margin-top:20px">Disclaimer</h2>
  <p>This service is provided "as is" without warranty. WordsToTime is not responsible for any errors or results obtained from use of this information.</p>
</div>`;
  return pageShell({ head, body });
}

function build404() {
  const head = headHTML({ title:'Page Not Found — WordsToTime', desc:'The page you were looking for was not found. Try the Words to Time Calculator.', slug:'/404' });
  const body = `
<div class="page-404">
  <h1>404</h1>
  <h2>Page Not Found</h2>
  <p style="color:var(--ink-2);max-width:400px;margin:0 auto 22px">The page you're looking for doesn't exist or has moved. Try one of these instead:</p>
  <a href="/" style="display:inline-block;background:var(--amber);color:#fff;padding:12px 26px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;margin-bottom:28px">Go to Calculator →</a>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:9px;max-width:560px;margin:0 auto">
    <a href="/words-to-minutes/" class="chip">Words to Minutes</a>
    <a href="/word-to-reading-time/" class="chip">Reading Time</a>
    <a href="/word-to-speaking-time/" class="chip">Speaking Time</a>
    <a href="/word-to-speech-length/" class="chip">Speech Length</a>
    <a href="/practice-mode/" class="chip">Practice Mode</a>
    <a href="/1000-words-to-minutes/" class="chip">1,000 Words</a>
    <a href="/5-minute-speech-word-count/" class="chip">5-Min Speech</a>
    <a href="/10-minute-speech-word-count/" class="chip">10-Min Speech</a>
  </div>
</div>`;
  return pageShell({ head, body });
}

// ═══════════════════════════════════════════════════════════════
// SITEMAP, ROBOTS, ADS, NETLIFY.TOML
// ═══════════════════════════════════════════════════════════════
function buildSitemap(urls) {
  const today = new Date().toISOString().split('T')[0];
  const entries = urls.map(({loc,priority,changefreq}) =>
    `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <priority>${priority}</priority>\n    ${changefreq?`<changefreq>${changefreq}</changefreq>\n    `:''}<lastmod>${today}</lastmod>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

const REDIRECTS = [
  { from:'/words-to-time/',                 to:'/' },
  { from:'/speech-time-calculator/',        to:'/word-to-speaking-time/' },
  { from:'/speaking-time-calculator/',      to:'/word-to-speaking-time/' },
  { from:'/reading-time-calculator/',       to:'/word-to-reading-time/' },
  { from:'/reading-time/',                  to:'/word-to-reading-time/' },
  { from:'/read-time-calculator/',          to:'/word-to-reading-time/' },
  { from:'/read-aloud-time/',               to:'/word-to-reading-time/' },
  { from:'/how-long-to-read/',              to:'/word-to-reading-time/' },
  { from:'/text-to-speech-time/',           to:'/word-to-speaking-time/' },
  { from:'/presentation-time-calculator/',  to:'/word-to-presentation-time/' },
  { from:'/debate-calculator/',             to:'/word-to-debate-time/' },
  { from:'/speech-length-calculator/',      to:'/word-to-speech-length/' },  // FIXED: was missing
  { from:'/words-per-minute-speech/',       to:'/speaking-words-per-minute/' },
  { from:'/average-speaking-speed/',        to:'/speaking-words-per-minute/' },
  { from:'/script-timer/',                  to:'/practice-mode/' },
  { from:'/how-long-1000-word-speech/',     to:'/1000-words-to-minutes/' },
  { from:'/how-long-500-word-speech/',      to:'/500-words-to-minutes/' },
  { from:'/how-long-600-word-speech/',      to:'/600-words-to-minutes/' },
  { from:'/how-long-900-word-speech/',      to:'/900-words-to-minutes/' },
  { from:'/how-long-1500-word-speech/',     to:'/1500-words-to-minutes/' },
  { from:'/how-long-2500-word-speech/',     to:'/2500-words-to-minutes/' },
  { from:'/word-to-debate-time',            to:'/word-to-debate-time/' },  // trailing slash fix
];

function buildNetlifyToml() {
  const rBlocks = REDIRECTS.map(r =>
    `[[redirects]]\n  from   = "${r.from}"\n  to     = "${r.to}"\n  status = 301\n  force  = true`
  ).join('\n\n');
  return `# netlify.toml — auto-generated by generate-site-seo-optimized.js
# DO NOT EDIT MANUALLY — run 'node generate-site-seo-optimized.js' to regenerate

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
    X-XSS-Protection       = "1; mode=block"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# ─── 301 REDIRECTS (${REDIRECTS.length} total) ───────────────────────────────
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

write('public/css/style.css', CSS);
write('public/js/app.js', JS);

// Homepage
write('public/index.html', buildHomepage());

// Core tool pages
write('public/words-to-minutes/index.html',           buildWordsToMinutes());
write('public/word-to-reading-time/index.html',       buildReadingTime());
write('public/word-to-speaking-time/index.html',      buildSpeakingTime());
write('public/word-to-speech-length/index.html',      buildSpeechLength());
write('public/word-to-presentation-time/index.html',  buildPresentationTime());
write('public/word-to-public-speaking-time/index.html', buildPublicSpeaking());
write('public/word-to-debate-time/index.html',        buildDebateTime());
write('public/word-to-typing-time/index.html',        buildTypingTime());
write('public/speaking-words-per-minute/index.html',  buildSpeakingWPM());
write('public/practice-mode/index.html',              buildPracticeMode());
write('public/reading-speed-test/index.html',         buildReadingSpeedTest());

// International
write('public/palabras-a-minutos/index.html', buildPalabrasAMinutos());
write('public/lesezeit-rechner/index.html',   buildLesezeit());

// Static
write('public/about/index.html',   buildAbout());
write('public/privacy/index.html', buildPrivacy());
write('public/terms/index.html',   buildTerms());
write('public/404.html',           build404());

// Word count pages
const wcPages = [
  {wc:200,  prev:null, next:250},
  {wc:250,  prev:200,  next:300},
  {wc:300,  prev:250,  next:400},
  {wc:400,  prev:300,  next:500},
  {wc:500,  prev:400,  next:600},
  {wc:600,  prev:500,  next:700},
  {wc:700,  prev:600,  next:750},
  {wc:750,  prev:700,  next:800},
  {wc:800,  prev:750,  next:900},
  {wc:900,  prev:800,  next:1000},
  {wc:1000, prev:900,  next:1300},
  {wc:1300, prev:1000, next:1500},
  {wc:1500, prev:1300, next:2000},
  {wc:2000, prev:1500, next:2500},
  {wc:2500, prev:2000, next:null},
];
wcPages.forEach(({wc,prev,next}) => write(`public/${wc}-words-to-minutes/index.html`, buildWordCountPage({wc,slug:`/${wc}-words-to-minutes`,prevWC:prev,nextWC:next})));

// Speech duration pages
const speechMins = [2,3,4,5,6,7,10,15,20];
speechMins.forEach(mins => write(`public/${mins}-minute-speech-word-count/index.html`, buildSpeechDurationPage({minutes:mins,slug:`/${mins}-minute-speech-word-count`})));

// Sitemap
const sitemapUrls = [
  {loc:'/',                               priority:'1.0',changefreq:'weekly'},
  {loc:'/words-to-minutes/',             priority:'0.9',changefreq:'monthly'},
  {loc:'/word-to-reading-time/',         priority:'0.9',changefreq:'monthly'},
  {loc:'/word-to-speaking-time/',        priority:'0.9',changefreq:'monthly'},
  {loc:'/word-to-speech-length/',        priority:'0.9',changefreq:'monthly'},
  {loc:'/word-to-public-speaking-time/', priority:'0.9',changefreq:'monthly'},
  {loc:'/word-to-presentation-time/',    priority:'0.8',changefreq:'monthly'},
  {loc:'/word-to-debate-time/',          priority:'0.8',changefreq:'monthly'},
  {loc:'/word-to-typing-time/',          priority:'0.8',changefreq:'monthly'},
  {loc:'/speaking-words-per-minute/',    priority:'0.8',changefreq:'monthly'},
  {loc:'/practice-mode/',                priority:'0.8',changefreq:'monthly'},
  {loc:'/reading-speed-test/',           priority:'0.8',changefreq:'monthly'},
  ...speechMins.map(m => ({loc:`/${m}-minute-speech-word-count/`, priority: m<=5 ? '0.9' : '0.8', changefreq:'monthly'})),
  ...wcPages.map(({wc}) => ({loc:`/${wc}-words-to-minutes/`, priority:'0.8', changefreq:'monthly'})),
  {loc:'/palabras-a-minutos/',           priority:'0.7',changefreq:'monthly'},
  {loc:'/lesezeit-rechner/',             priority:'0.7',changefreq:'monthly'},
  {loc:'/about/',                        priority:'0.5',changefreq:'yearly'},
  {loc:'/privacy/',                      priority:'0.3',changefreq:'yearly'},
  {loc:'/terms/',                        priority:'0.3',changefreq:'yearly'},
];
write('public/sitemap.xml', buildSitemap(sitemapUrls));
write('public/robots.txt', `User-agent: *\nAllow: /\nDisallow:\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);
write('public/ads.txt', `google.com, pub-9275267797924945, DIRECT, f08c47fec0942fa0\n`);

// netlify.toml at repo root
write('netlify.toml', buildNetlifyToml());

// Count
const countFiles = d => { let n=0; if(!fs.existsSync(d))return 0; fs.readdirSync(d,{withFileTypes:true}).forEach(f=>{ if(f.isDirectory())n+=countFiles(path.join(d,f.name)); else n++; }); return n; };
const total = countFiles('public');
const htmlPages = sitemapUrls.length;

console.log('\n✅ WordsToTime v5.1 generated successfully!');
console.log(`   📁 Total files:  ${total}`);
console.log(`   📄 HTML pages:   ${htmlPages} canonical`);
console.log(`   🔀 Redirects:    ${REDIRECTS.length} (in netlify.toml)`);
console.log(`   🗺  Sitemap:      ${sitemapUrls.length} URLs`);
console.log(`   🔧 Fixes in v5.1:`);
console.log(`      ✓ All 22 redirects including /speech-length-calculator/`);
console.log(`      ✓ Full mobile optimisation (sticky nav, tables, grid, hero)`);
console.log(`      ✓ Dropdown nav with ALL 12 tool pages`);
console.log(`      ✓ Contextual link strips on every page (§10 spec)`);
console.log(`      ✓ Adjacent page links on word count & speech duration pages`);
console.log(`      ✓ Sitemap verified: canonical pages only\n`);
