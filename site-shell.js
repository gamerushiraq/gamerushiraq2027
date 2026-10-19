(()=>{'use strict';
const authStyle=document.createElement('style');authStyle.textContent='html.gr-auth-checking body{visibility:hidden!important}.game-page .packs .pack,.game-page .packs .pack .pack-qty,.game-page .packs .pack .pack-price{color:#fff!important}.game-page .packs .pack .pack-label,.game-page .packs .pack .pack-price-note{color:#d8e1ed!important}.game-page .packs .pack .pack-bonus{color:#57d39a!important}';document.head.appendChild(authStyle);
const path=location.pathname;
const isGame=path.endsWith('/game.html');
const styles=[['performance-2026.css','2'],['theme-2026.css','4'],['mobile-polish-2026.css','4'],['vivid-theme-2026.css','3'],['responsive-2026.css','4'],['performance-hotfix-2026.css','2'],['game-art-motion.css','1']];
if(isGame)styles.push(['mobile-game-fix-2026.css','5'],['payment-redesign.css','3']);
styles.push(['lightweight.css','1']);
const isHomepage=path.endsWith('/')||path.endsWith('/index.html');
if(!isHomepage)styles.forEach(([href,v])=>{const l=document.createElement('link');l.rel='stylesheet';l.href='./'+href+'?v='+v;document.head.appendChild(l)});
const s=document.createElement('script');s.defer=true;s.src='./media-guard-2026.js?v=12';document.head.appendChild(s);

function installCompactNavigation(){
 if(document.getElementById('grCompactDock'))return;
 const isHome=path.endsWith('/')||path.endsWith('/index.html');
 const isGame=path.endsWith('/game.html');
 const items=[
  {href:'./',icon:'⌂',label:'الرئيسية',match:p=>p==='/'||p.endsWith('/index.html')},
  {href:'shop.html',icon:'🎮',label:'الألعاب',match:p=>p.endsWith('/shop.html')||p.endsWith('/game.html')},
  {href:'services.html',icon:'✦',label:'الخدمات',match:p=>p.endsWith('/services.html')},
  {href:isHome?'#homePromosSection':'events.html',icon:'🎁',label:'العروض',match:p=>p.endsWith('/events.html')},
  {href:'track.html',icon:'⌕',label:'تتبع الطلب',match:p=>p.endsWith('/track.html')||p.endsWith('/payment-result.html')},
  {href:'vip.html',icon:'♕',label:'المكافآت',match:p=>p.endsWith('/vip.html')||p.endsWith('/redeem.html')},
  {href:'support.html',icon:'☏',label:'الدعم',match:p=>p.endsWith('/support.html')}
 ];
 const style=document.createElement('style');
 style.id='grCompactUiStyles';
 style.textContent=`
 .announcement{display:none!important}
 .gr-ref-nav,.topbar nav,.gr-ref-topbar nav,.nav.store-nav{display:none!important}
 .gr-ref-side{display:none!important}
 .topbar,.gr-ref-topbar{min-height:58px!important;height:auto!important;padding:8px 12px!important;gap:10px!important;position:sticky;top:0;z-index:90;backdrop-filter:blur(14px)}
 .topbar .brand,.gr-ref-brand{flex-shrink:0}
 .gr-ref-search{max-width:min(42vw,280px);min-height:38px;padding:8px 12px!important;font-size:12px!important}
 .gr-ref-actions{gap:6px!important}
 .gr-ref-lang,.gr-ref-login,.gr-ref-signup{padding:8px 10px!important;font-size:11px!important}
 body{padding-bottom:88px!important}
 #grCompactDock{position:fixed;z-index:999;right:max(9px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:flex;flex-direction:column-reverse;gap:7px;align-items:center;padding:8px;border:1px solid rgba(113,144,180,.24);border-radius:19px;background:rgba(5,12,24,.84);box-shadow:0 14px 40px rgba(0,0,0,.35);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
 #grCompactDock a,#grCompactDock button{appearance:none;width:42px;height:42px;min-width:42px;display:grid;place-items:center;border:1px solid rgba(137,163,194,.16);border-radius:13px;background:linear-gradient(145deg,#142238,#0a1321);color:#e9f3ff;text-decoration:none;font:700 18px/1 inherit;cursor:pointer;transition:transform .16s ease,border-color .16s ease,background .16s ease;box-shadow:none}
 #grCompactDock a:active,#grCompactDock button:active{transform:scale(.94)}
 #grCompactDock a[aria-current=page]{background:linear-gradient(145deg,#ff3155,#bd193e);border-color:#ff7a91;color:white;box-shadow:0 5px 16px rgba(255,49,85,.24)}
 #grCompactDock [data-gr-tip]{position:relative}
 #grCompactDock [data-gr-tip]:focus-visible{outline:2px solid #ff7890;outline-offset:2px}
 .gr-compact-toggle{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-inline-start:auto;padding:7px 10px;border:1px solid rgba(124,153,188,.22);border-radius:10px;background:rgba(15,29,48,.9);color:#dceaff;font:700 11px/1.4 inherit;cursor:pointer;white-space:nowrap}
 .gr-ref-head{gap:8px;flex-wrap:wrap}
 [data-gr-collapsible=true][data-gr-collapsed=true]>:not(.gr-ref-head){display:none!important}
 .legal section[data-gr-collapsed=true]>:not(h2){display:none!important}
 .gr-ref-section,.store-section,.legal section{scroll-margin-top:80px}
 @media(min-width:700px){
  #grCompactDock a,#grCompactDock button{width:46px;height:46px;min-width:46px}
  #grCompactDock [data-gr-tip]:hover:after{content:attr(data-gr-tip);position:absolute;right:54px;white-space:nowrap;padding:8px 11px;border-radius:10px;background:#111e31;color:#fff;font-size:12px;box-shadow:0 8px 24px #0005}
 }
 @media(max-width:600px){
  .topbar,.gr-ref-topbar{padding:7px 9px!important;min-height:52px!important}
  .brand,.gr-ref-brand{font-size:15px!important;gap:7px!important}
  .brand-mark,.gr-ref-brand .mark{width:32px!important;height:32px!important}
  .gr-ref-search{max-width:34vw!important;font-size:10px!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .gr-ref-actions .gr-ref-signup{display:none!important}
  .gr-ref-actions .gr-ref-login{padding:7px 8px!important;font-size:10px!important}
  #grCompactDock{right:7px;bottom:max(8px,env(safe-area-inset-bottom));gap:5px;padding:6px;border-radius:16px}
  #grCompactDock a,#grCompactDock button{width:38px;height:38px;min-width:38px;border-radius:11px;font-size:16px}
  .gr-compact-toggle{padding:6px 8px;font-size:10px}
 }
 @media(prefers-reduced-motion:reduce){#grCompactDock a,#grCompactDock button{transition:none!important}}
 `;
 document.head.appendChild(style);
 const dock=document.createElement('nav');dock.id='grCompactDock';dock.setAttribute('aria-label','التنقل السريع');
 const back=document.createElement('button');back.type='button';back.textContent='↩';back.title='رجوع';back.setAttribute('aria-label','رجوع للصفحة السابقة');back.dataset.grTip='رجوع';
 back.addEventListener('click',()=>{try{if(history.length>1&&document.referrer&&new URL(document.referrer).origin===location.origin){history.back();return}}catch{}location.href=isGame?'shop.html':path.endsWith('/payment-result.html')?'track.html':'./'});
 dock.appendChild(back);
 items.forEach(item=>{const a=document.createElement('a');a.href=item.href;a.textContent=item.icon;a.title=item.label;a.setAttribute('aria-label',item.label);a.dataset.grTip=item.label;if(item.match(path))a.setAttribute('aria-current','page');a.addEventListener('click',e=>{if(isHome&&item.href.startsWith('#')){const target=document.querySelector(item.href);if(target){e.preventDefault();target.dataset.grCollapsed='false';target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}}});dock.appendChild(a)});
 document.body.appendChild(dock);
 if(isHome){
  const sections=[...document.querySelectorAll('.gr-ref-section')].filter(s=>!s.hidden);
  sections.forEach((section,index)=>{const head=section.querySelector('.gr-ref-head');if(!head||section.id==='games')return;section.dataset.grCollapsible='true';section.dataset.grCollapsed=index!==0;const btn=document.createElement('button');btn.type='button';btn.className='gr-compact-toggle';btn.textContent=section.dataset.grCollapsed==='true'?'＋ عرض القسم':'− إخفاء القسم';btn.setAttribute('aria-expanded',String(section.dataset.grCollapsed!=='true'));btn.addEventListener('click',()=>{const collapsed=section.dataset.grCollapsed!=='true';section.dataset.grCollapsed=String(collapsed);btn.textContent=collapsed?'＋ عرض القسم':'− إخفاء القسم';btn.setAttribute('aria-expanded',String(!collapsed))});head.appendChild(btn)});
 }
 document.querySelectorAll('.legal section').forEach(section=>{const h=section.querySelector('h2');if(!h)return;section.dataset.grCollapsed='true';h.style.cursor='pointer';h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');const toggle=()=>{const collapsed=section.dataset.grCollapsed!=='true';section.dataset.grCollapsed=String(collapsed);h.setAttribute('aria-expanded',String(!collapsed))};h.addEventListener('click',toggle);h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});
 if(!isHome){document.querySelectorAll('.store-benefits').forEach(s=>{s.hidden=true})}
}

function boot(){
installCompactNavigation();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=32').catch(()=>{});
document.querySelectorAll('img').forEach(i=>{if(!i.loading)i.loading=i.dataset.priority==='high'?'eager':'lazy';i.decoding='async';i.setAttribute('fetchpriority',i.dataset.priority==='high'?'high':'auto')});
if(isGame||path.endsWith('/')){const promo=document.querySelector('.pubg-topup-shell');const slug=new URLSearchParams(location.search).get('game');if(promo&&slug&&slug!=='pubg'){const eyebrow=promo.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='GAME RUSH • DIRECT TOP UP';const title=promo.querySelector('h2');if(title)title.textContent='اشحن رصيد لعبتك بسرعة 🎯';const description=promo.querySelector('p');if(description)description.textContent='أدخل Player ID، تأكد من بيانات الحساب، وبعدها اختار الباقة المناسبة.'}}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();