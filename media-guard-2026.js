(()=>{'use strict';
const GAME_ART={
  'PUBG MOBILE':['#ff9f1c','#ff3d00','BATTLEGROUND'],
  'FREE FIRE':['#ff2d95','#7c3aed','BATTLE ROYALE'],
  'CALL OF DUTY MOBILE':['#ffd166','#ef476f','TACTICAL ACTION'],
  'MOBILE LEGENDS':['#00e5ff','#7c4dff','MOBA ARENA'],
  'EA FC MOBILE':['#39ff88','#00a8ff','FOOTBALL'],
  'eFootball':['#00e5ff','#1746ff','FOOTBALL'],
  'ROBLOX':['#ff4d6d','#ffb703','GAMING WORLD']
};
function clean(v){return String(v||'GameRush').replace(/[<>&"']/g,'').trim().slice(0,28)||'GameRush'}
function artFor(img){
  const raw=clean(img.alt||img.dataset.game||'GameRush');
  const key=Object.keys(GAME_ART).find(k=>raw.toLowerCase().includes(k.toLowerCase()));
  return {name:key||raw,colors:key?GAME_ART[key]:['#00e5ff','#7c4dff','GAME TOP-UP']};
}
function fallback(img){
  if(!img||img.dataset.grFallback)return;
  img.dataset.grFallback='1'; img.removeAttribute('srcset');
  const {name,colors}=artFor(img), label=clean(name), tag=clean(colors[2]);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient><radialGradient id="r"><stop stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="800" fill="#050812"/><circle cx="980" cy="110" r="360" fill="url(#r)"/><circle cx="170" cy="690" r="360" fill="${colors[0]}" opacity=".09"/><path d="M0 650 C240 470 420 760 650 570 S980 330 1200 470 V800 H0Z" fill="url(#g)" opacity=".24"/><g fill="none" stroke="url(#g)" opacity=".55"><circle cx="600" cy="390" r="180" stroke-width="3"/><circle cx="600" cy="390" r="230" stroke-width="2"/><circle cx="600" cy="390" r="290" stroke-width="1"/></g><text x="600" y="385" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="68" font-weight="900">${label}</text><text x="600" y="445" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif" font-size="28" font-weight="800" letter-spacing="5">${tag}</text></svg>`;
  img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  img.style.objectFit='cover';
}
function scan(){document.querySelectorAll('img').forEach(img=>{img.loading=img.loading||'lazy';img.decoding='async';img.addEventListener('error',()=>fallback(img),{once:true});if(img.complete&&img.naturalWidth===0&&img.src)fallback(img)})}
document.addEventListener('error',e=>{if(e.target?.tagName==='IMG')fallback(e.target)},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
new MutationObserver(scan).observe(document.documentElement,{subtree:true,childList:true});
})();
