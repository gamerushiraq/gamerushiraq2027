(()=>{'use strict';
const authStyle=document.createElement('style');authStyle.textContent='html.gr-auth-checking body{visibility:hidden!important}html.gr-auth-ok body{visibility:visible!important}.game-page .packs .pack,.game-page .packs .pack .pack-qty,.game-page .packs .pack .pack-price{color:#fff!important}.game-page .packs .pack .pack-label,.game-page .packs .pack .pack-price-note{color:#d8e1ed!important}.game-page .packs .pack .pack-bonus{color:#57d39a!important}';document.head.appendChild(authStyle);
const links=[['performance-2026.css','1'],['theme-2026.css','3'],['mobile-polish-2026.css','3'],['vivid-theme-2026.css','2'],['responsive-2026.css','2'],['cinematic-2026.css','3'],['cinematic-interaction-2026.css','1'],['app-mode-2026.css','2'],['performance-hotfix-2026.css','1'],['mobile-game-fix-2026.css','4']];
links.forEach(([href,v])=>{const l=document.createElement('link');l.rel='stylesheet';l.href='./'+href+'?v='+v;document.head.appendChild(l)});
['auth-gate.js','media-guard-2026.js','cinematic-2026.js','cinematic-interaction-2026.js','app-mode-2026.js'].forEach((src,i)=>{const s=document.createElement('script');s.defer=true;s.src='./'+src+'?v='+(i+10);document.head.appendChild(s)});
function boot(){
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
 document.querySelectorAll('img').forEach(i=>{i.loading=i.loading||'lazy';i.decoding='async';i.setAttribute('fetchpriority',i.dataset.priority==='high'?'high':'auto');});
 if(location.pathname.endsWith('/game.html')||location.pathname.endsWith('/')){
  const promo=document.querySelector('.pubg-topup-shell');
  const slug=new URLSearchParams(location.search).get('game');
  if(promo&&slug&&slug!=='pubg'){
   const eyebrow=promo.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='GAME RUSH • DIRECT TOP UP';
   const title=promo.querySelector('h2');if(title)title.textContent='اشحن رصيد لعبتك بسرعة 🎯';
   const text=promo.querySelector('p');if(text)text.textContent='أدخل Player ID، تأكد من بيانات الحساب، وبعدها اختار الباقة المناسبة.';
  }
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
