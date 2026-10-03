(()=>{"use strict";
const theme=document.createElement("link");theme.rel="stylesheet";theme.href="./theme-2026.css?v=1";document.head.appendChild(theme);
const modules=[
 ["⚡","شحن سريع","اختار اللعبة والباقة","shop.html"],
 ["🎁","العروض","شوف العروض المتاحة","shop.html#offers"],
 ["👑","GameRush VIP","نقاط ومستويات","vip.html"],
 ["📦","تتبع الطلب","تابع طلبك برقم GR","track.html"],
 ["🎟️","Redeem","استرد الأكواد","redeem.html"],
 ["🛠️","خدماتنا","كل خدمات GameRush","services.html"]
];
function inject(){
 if(document.querySelector(".gr-quick-hub"))return;
 const host=document.querySelector("main"); if(!host)return;
 const section=document.createElement("section"); section.className="gr-quick-hub";
 section.innerHTML='<div class="gr-quick-head"><div><span class="eyebrow">GAME RUSH HUB</span><h2>اختصارات GameRush</h2><p>الخدمات الأساسية متوفرة من كل صفحة حتى ما تضيع بين الأقسام.</p></div><span class="live-pill"><i></i> LIVE</span></div><div class="gr-quick-grid">'+modules.map(m=>'<a href="'+m[3]+'" class="gr-quick-card"><span>'+m[0]+'</span><div><b>'+m[1]+'</b><small>'+m[2]+'</small></div><em>↗</em></a>').join("")+'</div>';
 const marker=host.querySelector("section"); marker?host.insertBefore(section,marker):host.appendChild(section);
}
let deferred=null;
function installPrompt(){
 window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;showInstall()});
 function showInstall(){
  if(document.querySelector(".gr-install-bar")||!deferred)return;
  const bar=document.createElement("aside");bar.className="gr-install-bar";
  bar.innerHTML='<div><b>📱 ثبّت GameRush كتطبيق</b><small>يفتح بسرعة من شاشة الموبايل ويرتبط بنفس الموقع والطلبات.</small></div><button>تثبيت</button><button class="gr-install-close" aria-label="إغلاق">×</button>';
  document.body.appendChild(bar);
  bar.querySelector("button:not(.gr-install-close)").onclick=async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;bar.remove()};
  bar.querySelector(".gr-install-close").onclick=()=>bar.remove();
 }
 window.addEventListener("appinstalled",()=>{deferred=null;document.querySelector(".gr-install-bar")?.remove()});
}
function registerSW(){if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{inject();installPrompt();registerSW()});else{inject();installPrompt();registerSW()}
})();
const cinematic=document.createElement("link");cinematic.rel="stylesheet";cinematic.href="./cinematic-2026.css?v=1";document.head.appendChild(cinematic);const motion=document.createElement("script");motion.defer=true;motion.src="./cinematic-2026.js?v=1";document.head.appendChild(motion);
