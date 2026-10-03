(()=>{"use strict";
document.documentElement.classList.add("gr-page-ready");
window.addEventListener("pageshow",()=>document.documentElement.classList.add("gr-page-ready"));
document.addEventListener("click",e=>{
 const a=e.target.closest("a");
 if(!a||a.target==="_blank"||a.hasAttribute("download"))return;
 const href=a.getAttribute("href");
 if(!href||href.startsWith("#")||href.startsWith("mailto:")||href.startsWith("tel:")||href.startsWith("https://wa.me/"))return;
 try{const u=new URL(href,location.href);if(u.origin!==location.origin)return;if(u.pathname===location.pathname&&u.search===location.search)return;
  e.preventDefault();document.documentElement.classList.remove("gr-page-ready");document.documentElement.classList.add("gr-page-leaving");
  setTimeout(()=>{location.href=u.href},170);
 }catch{}
});
})();