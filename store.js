(()=>{"use strict";
const $=s=>document.querySelector(s);
const catalog=[
{id:"pubg",name:"PUBG MOBILE",unit:"UC",cls:"pubg",image:"https://1.bp.blogspot.com/-5Pac6QAl42g/X2Czl-uMwnI/AAAAAAAABMA/zcz9A2QHm08vbK8NE9qDOcu4UPZR0YYiACNcBGAsYHQ/s1304/pubg-mobile-1.png"},
{id:"freefire",name:"FREE FIRE",unit:"Diamonds",cls:"freefire",image:"https://akm-img-a-in.tosshub.com/sites/itgaming/resources/202408/image-2024-08-07-132038547070824011958.png"},
{id:"cod",name:"CALL OF DUTY MOBILE",unit:"CP",cls:"cod",image:"https://mobilgamer.hu/pictures/jatekteszt/call-of-duty-mobile_1.jpg"},
{id:"mlbb",name:"MOBILE LEGENDS",unit:"Diamonds",cls:"mlbb",image:"https://epngame.com/images/games/mlbb-big-1720743035-6690747b26195.png"},
{id:"fc",name:"EA FC MOBILE",unit:"FC Points",cls:"fc",image:"https://www.notebookcheck.com/fileadmin/Notebooks/News/_nc3/Teaser_Vinicius_Junior_FC_Mobile_110823.jpg"},
{id:"roblox",name:"ROBLOX",unit:"Robux",cls:"roblox",image:"https://api.kataeb.org/storage/new-website/Technology/roblox.jpeg"}];
function gameCard(g){return '<a class="store-game-tile neo-store-tile" href="game.html?game='+g.id+'"><div class="store-game-art '+g.cls+'"><img src="'+g.image+'" alt="'+g.name+'" loading="lazy"><span>'+g.unit+'</span></div><strong>'+g.name+'</strong><small>شحن مباشر ↗</small></a>'}
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