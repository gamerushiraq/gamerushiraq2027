(()=>{'use strict';
const authStyle=document.createElement('style');authStyle.textContent='html.gr-auth-checking body{visibility:hidden!important}.game-page .packs .pack,.game-page .packs .pack .pack-qty,.game-page .packs .pack .pack-price{color:#fff!important}.game-page .packs .pack .pack-label,.game-page .packs .pack .pack-price-note{color:#d8e1ed!important}.game-page .packs .pack .pack-bonus{color:#57d39a!important}';document.head.appendChild(authStyle);
const path=location.pathname;
const isGame=path.endsWith('/game.html');
const styles=[['performance-2026.css','2'],['theme-2026.css','4'],['mobile-polish-2026.css','4'],['vivid-theme-2026.css','3'],['responsive-2026.css','4'],['performance-hotfix-2026.css','2']];
if(isGame)styles.push(['mobile-game-fix-2026.css','5']);
styles.forEach(([href,v])=>{const l=document.createElement('link');l.rel='stylesheet';l.href='./'+href+'?v='+v;document.head.appendChild(l)});
const s=document.createElement('script');s.defer=true;s.src='./media-guard-2026.js?v=11';document.head.appendChild(s);
function boot(){
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=14').catch(()=>{});
document.querySelectorAll('img').forEach(i=>{if(!i.loading)i.loading=i.dataset.priority==='high'?'eager':'lazy';i.decoding='async';i.setAttribute('fetchpriority',i.dataset.priority==='high'?'high':'auto')});
if(isGame||path.endsWith('/')){const promo=document.querySelector('.pubg-topup-shell');const slug=new URLSearchParams(location.search).get('game');if(promo&&slug&&slug!=='pubg'){const eyebrow=promo.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='GAME RUSH • DIRECT TOP UP';const title=promo.querySelector('h2');if(title)title.textContent='اشحن رصيد لعبتك بسرعة 🎯';const description=promo.querySelector('p');if(description)description.textContent='أدخل Player ID، تأكد من بيانات الحساب، وبعدها اختار الباقة المناسبة.'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();