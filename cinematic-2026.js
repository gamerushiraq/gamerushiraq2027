(()=>{"use strict";
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const low=matchMedia("(max-width:700px)").matches; const lite=low||matchMedia("(max-width:1100px)").matches||((navigator.deviceMemory||8)<=4);
function particles(){
 const c=document.createElement("canvas");c.className="gr-particle-field";c.setAttribute("aria-hidden","true");
 const hero=document.querySelector(".neo-hero");if(!hero||lite)return;
 hero.prepend(c);const x=c.getContext("2d"), pts=[],n=low?28:72;
 function resize(){c.width=hero.clientWidth*devicePixelRatio;c.height=hero.clientHeight*devicePixelRatio;c.style.width=hero.clientWidth+"px";c.style.height=hero.clientHeight+"px";x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
 resize();addEventListener("resize",resize,{passive:true});
 for(let i=0;i<n;i++)pts.push({x:Math.random()*hero.clientWidth,y:Math.random()*hero.clientHeight,r:.5+Math.random()*1.8,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,a:.18+Math.random()*.55});
 if(reduce)return;
 let raf=0,last=0;
 function draw(t){if(t-last<33){raf=requestAnimationFrame(draw);return}last=t;
  const w=hero.clientWidth,h=hero.clientHeight;x.clearRect(0,0,w,h);
  for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;x.globalAlpha=p.a;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle="#b7ff2a";x.fill()}
  raf=requestAnimationFrame(draw)
 }
 raf=requestAnimationFrame(draw);
 new IntersectionObserver(es=>{if(!es[0].isIntersecting)cancelAnimationFrame(raf);else raf=requestAnimationFrame(draw)},{threshold:.01}).observe(hero)
}
function pageEntrance(){
 document.documentElement.classList.add("gr-ready");
 document.querySelectorAll("main section,.store-section,.game-section,.service,.reward,.vip-card").forEach((el,i)=>{el.classList.add("gr-reveal");el.style.setProperty("--gr-delay",Math.min(i*35,420)+"ms")});
 if(reduce)return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("gr-in");io.unobserve(e.target)}}),{threshold:.08});
 document.querySelectorAll(".gr-reveal").forEach(e=>io.observe(e));
}
function loader(){
 if(sessionStorage.getItem("gr-loader-seen"))return;
 const el=document.createElement("div");el.className="gr-loader";el.innerHTML='<div class="gr-loader-core"><div class="gr-loader-logo">GR</div><div class="gr-loader-name">GAMERUSH</div><div class="gr-loader-bar"><i></i></div><small>IRAQ // GAMING TOP-UP</small></div>';
 document.body.append(el);sessionStorage.setItem("gr-loader-seen","1");setTimeout(()=>el.classList.add("out"),850);setTimeout(()=>el.remove(),1500);
}
function tilt(){
 if(lite||reduce)return;
 document.querySelectorAll(".neo-game-card,.gr-popular-card,.gr-promo-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),rx=((e.clientY-r.top)/r.height-.5)*-5,ry=((e.clientX-r.left)/r.width-.5)*5;card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-7px)`});
  card.addEventListener("pointerleave",()=>card.style.transform="");
 })
}
document.addEventListener("DOMContentLoaded",()=>{loader();pageEntrance();particles();setTimeout(tilt,700)});
})();