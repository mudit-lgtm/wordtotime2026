(function(){'use strict';
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
function countWords(t){return t.trim().split(/\s+/).filter(function(w){return w.length>0;}).length;}
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
  var wpm=currentWpm,text='WordsToTime Results\n\nWord Count: '+wordCount.toLocaleString()+'\nSpeaking Time ('+wpm+' WPM): '+fmt(wordCount/wpm*60)+'\nSilent Reading: '+fmt(wordCount/238*60)+'\nRead Aloud: '+fmt(wordCount/183*60)+'\nPresentation: '+fmt(wordCount/100*60)+'\n\nGenerated at wordstotime.netlify.app';
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
})();