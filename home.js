(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co";
const SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const GAMES=[
{id:"pubg",name:"PUBG MOBILE",unit:"UC",image:"https://1.bp.blogspot.com/-5Pac6QAl42g/X2Czl-uMwnI/AAAAAAAABMA/zcz9A2QHm08vbK8NE9qDOcu4UPZR0YYiACNcBGAsYHQ/s1304/pubg-mobile-1.png",tag:"BATTLE ROYALE"},
{id:"freefire",name:"FREE FIRE",unit:"Diamonds",image:"https://akm-img-a-in.tosshub.com/sites/itgaming/resources/202408/image-2024-08-07-132038547070824011958.png",tag:"BATTLE IN STYLE"},
{id:"cod",name:"CALL OF DUTY MOBILE",unit:"CP",image:"https://mobilgamer.hu/pictures/jatekteszt/call-of-duty-mobile_1.jpg",tag:"TACTICAL ACTION"},
{id:"mlbb",name:"MOBILE LEGENDS",unit:"Diamonds",image:"https://epngame.com/images/games/mlbb-big-1720743035-6690747b26195.png",tag:"MOBA"},
{id:"fc",name:"EA FC MOBILE",unit:"FC Points",image:"https://www.notebookcheck.com/fileadmin/Notebooks/News/_nc3/Teaser_Vinicius_Junior_FC_Mobile_110823.jpg",tag:"FOOTBALL"},
{id:"roblox",name:"ROBLOX",unit:"Robux",image:"https://api.kataeb.org/storage/new-website/Technology/roblox.jpeg",tag:"CREATE & PLAY"}
];
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function renderPopular(){
 const el=document.getElementById("popularGames"); if(!el)return;
 const order=["pubg","freefire","cod","mlbb"];
 const games=order.map(id=>GAMES.find(g=>g.id===id)).filter(Boolean);
 el.innerHTML=games.map((g,i)=>'<a class="gr-popular-card" href="game.html?game='+g.id+'"><span class="gr-rank">0'+(i+1)+'</span><img src="'+g.image+'" alt="'+esc(g.name)+'"><div><small>'+g.tag+'</small><b>'+esc(g.name)+'</b><span>'+esc(g.unit)+' • شحن ↗</span></div></a>').join("");
}
function renderPromoCard(p){
 const game=GAMES.find(g=>g.id===String(p.game).toLowerCase())||GAMES[0];
 const ends=new Date(p.ends_at).getTime();
 const discount=Math.max(0,Number(p.discount_iqd)||0);
 const baseText=p.package_name?esc(p.package_name):"عرض خاص";
 return '<article class="gr-promo-card"><div class="gr-promo-art"><img src="'+game.image+'" alt="'+esc(game.name)+'"></div><div class="gr-promo-body"><span class="gr-promo-badge">🔥 عرض فعال</span><small>'+esc(game.name)+'</small><h3>'+esc(p.title)+'</h3><p>'+baseText+(discount?' • خصم '+discount.toLocaleString("en-US")+' IQD':'')+'</p><div class="gr-promo-bottom"><span class="gr-countdown" data-end="'+ends+'">--:--:--</span><a href="game.html?game='+game.id+'">استفاد ↗</a></div></div></article>';
}
function startTimers(){
 document.querySelectorAll(".gr-countdown").forEach(el=>{
   const tick=()=>{const s=Math.max(0,Math.floor((Number(el.dataset.end)-Date.now())/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;el.textContent=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0");};
   tick();setInterval(tick,1000);
 });
}
async function loadPromos(){
 const el=document.getElementById("homePromos"); if(!el)return;
 try{
  const now=new Date().toISOString();
  const url=SUPABASE_URL+"/rest/v1/promotions?select=id,title,game,package_name,discount_iqd,starts_at,ends_at&active=eq.true&starts_at=lte."+encodeURIComponent(now)+"&ends_at=gt."+encodeURIComponent(now)+"&order=ends_at.asc&limit=6";
  const r=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY}});
  if(!r.ok)throw new Error("promotions request failed");
  const data=await r.json();
  if(!data.length){el.innerHTML='<div class="gr-promo-empty"><strong>🎁 العروض جاية بالطريق</strong><span>من لوحة الإدارة تگدر تضيف عرض، وراح يظهر هنا تلقائياً.</span><a href="shop.html">تصفح الألعاب ↗</a></div>';return;}
  el.innerHTML=data.map(renderPromoCard).join("");
  startTimers();
 }catch(e){
  el.innerHTML='<div class="gr-promo-empty"><strong>GameRush LIVE</strong><span>تعذر تحميل العروض حالياً. باقي المتجر يشتغل بشكل طبيعي.</span><a href="shop.html">تصفح الألعاب ↗</a></div>';
 }
}
function featuredRotation(){
 const img=document.getElementById("featuredImage"),title=document.getElementById("featuredTitle"),text=document.getElementById("featuredText"),unit=document.getElementById("featuredUnit"),link=document.getElementById("featuredLink");
 if(!img||!title)return;
 const items=[
  [GAMES[0],"شحن UC بواجهة أسرع، باقات واضحة ودفع محلي."],
  [GAMES[1],"اشحن Diamonds بسرعة وواجهة مرتبة للموبايل."],
  [GAMES[2],"CP وباقات واضحة لعشاق Call of Duty Mobile."],
 ];
 let i=0;
 const set=()=>{const [g,t]=items[i];[img,title,text,unit,link].forEach(x=>x?.classList.add("gr-featured-switch"));setTimeout(()=>{img.src=g.image;img.alt=g.name;title.textContent=g.name;text.textContent=t;unit.textContent=g.unit;link.href="game.html?game="+g.id;[img,title,text,unit,link].forEach(x=>x?.classList.remove("gr-featured-switch"));},220);};
 setInterval(()=>{i=(i+1)%items.length;set();},5000);
}
renderPopular();loadPromos();featuredRotation();
})();