(()=>{"use strict";
const links=[['theme-2026.css','2'],['mobile-polish-2026.css','2'],['responsive-2026.css','1'],['cinematic-2026.css','3'],['app-mode-2026.css','2']];
links.forEach(([href,v])=>{const l=document.createElement('link');l.rel='stylesheet';l.href='./'+href+'?v='+v;document.head.appendChild(l)});
['media-guard-2026.js','cinematic-2026.js','app-mode-2026.js'].forEach((src,i)=>{const s=document.createElement('script');s.defer=true;s.src='./'+src+'?v='+(i+3);document.head.appendChild(s)});
function boot(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});document.querySelectorAll('img').forEach(i=>{i.loading=i.loading||'lazy';i.decoding='async';});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
