(()=>{"use strict";
function fallback(img){
  if(img.dataset.grFallback)return;
  img.dataset.grFallback="1";
  img.removeAttribute("srcset");
  const label=(img.alt||"GameRush").replace(/[<>&]/g,"").slice(0,42);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#b7ff2a"/><stop offset=".5" stop-color="#00e5ff"/><stop offset="1" stop-color="#7c4dff"/></linearGradient></defs><rect width="800" height="500" fill="#050810"/><circle cx="650" cy="100" r="180" fill="#00e5ff" opacity=".12"/><circle cx="150" cy="400" r="200" fill="#b7ff2a" opacity=".1"/><text x="400" y="250" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif" font-size="48" font-weight="900">GAMERUSH</text><text x="400" y="310" text-anchor="middle" fill="#fff" opacity=".8" font-family="Arial,sans-serif" font-size="24">'+label+'</text></svg>';
  img.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
}
document.addEventListener("error",e=>{if(e.target?.tagName==="IMG")fallback(e.target)},true);
document.addEventListener("DOMContentLoaded",()=>document.querySelectorAll("img").forEach(img=>{img.addEventListener("error",()=>fallback(img));if(img.complete&&img.naturalWidth===0&&img.src)fallback(img)}));
})();