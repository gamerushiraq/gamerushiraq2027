(()=>{'use strict';
const links=[['performance-2026.css','1'],['theme-2026.css','2'],['mobile-polish-2026.css','3'],['vivid-theme-2026.css','2'],['responsive-2026.css','2'],['cinematic-2026.css','3'],['cinematic-interaction-2026.css','1'],['app-mode-2026.css','2'],['performance-hotfix-2026.css','1'],['mobile-game-fix-2026.css','1']];
links.forEach(([href,v])=>{const l=document.createElement('link');l.rel='stylesheet';l.href='./'+href+'?v='+v;document.head.appendChild(l)});
['auth-gate.js','media-guard-2026.js','cinematic-2026.js','cinematic-interaction-2026.js','app-mode-2026.js'].forEach((src,i)=>{const s=document.createElement('script');s.defer=true;s.src='./'+src+'?v='+(i+10);document.head.appendChild(s)});
function boot(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});document.querySelectorAll('img').forEach(i=>{i.loading=i.loading||'lazy';i.decoding='async';i.setAttribute('fetchpriority',i.dataset.priority==='high'?'high':'auto');});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
