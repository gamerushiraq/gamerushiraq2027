(()=>{"use strict";
const $=s=>document.querySelector(s);
const catalog=[
 {id:"pubg",name:"PUBG MOBILE",unit:"UC",icon:"🎯",cls:"pubg"},
 {id:"freefire",name:"FREE FIRE",unit:"Diamonds",icon:"🔥",cls:"freefire"},
 {id:"cod",name:"CALL OF DUTY MOBILE",unit:"CP",icon:"🎖️",cls:"cod"},
 {id:"mlbb",name:"MOBILE LEGENDS",unit:"Diamonds",icon:"⚔️",cls:"mlbb"},
 {id:"fc",name:"EA FC MOBILE",unit:"FC Points",icon:"⚽",cls:"fc"},
 {id:"roblox",name:"ROBLOX",unit:"Robux",icon:"🧱",cls:"roblox"}
];
function gameCard(g){return '<a class="store-game-tile" href="game.html?game='+g.id+'"><div class="store-game-art '+g.cls+'"><b>'+g.icon+'</b><span>'+g.unit+'</span></div><strong>'+g.name+'</strong><small>شحن مباشر</small></a>'}
function boot(){
 const grid=$("#storeGames"); if(grid) grid.innerHTML=catalog.map(gameCard).join("");
 const q=$("#storeSearch"), clear=$("#clearSearch");
 if(q){q.addEventListener("input",()=>{const v=q.value.trim().toLowerCase();document.querySelectorAll(".store-game-tile").forEach(x=>x.hidden=v&&!x.textContent.toLowerCase().includes(v))});}
 if(clear)clear.onclick=()=>{if(q){q.value="";q.dispatchEvent(new Event("input"));q.focus()}};
 const countdown=$("#offerCountdown");
 if(countdown){let end=Date.now()+36*60*60*1000;setInterval(()=>{let s=Math.max(0,Math.floor((end-Date.now())/1000));let h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;countdown.textContent=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0")},1000)}
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot):boot();
})();