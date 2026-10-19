(()=>{"use strict";
const API="https://eyjjmacxxcmdzkfqxifo.supabase.co/rest/v1";
const KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
let activeFilter="all";
function gameCard(g){return '<a class="store-game-tile neo-store-tile" href="game.html?game='+encodeURIComponent(g.slug)+'"><div class="store-game-art '+esc(g.slug)+'"><img src="'+esc(g.image_url)+'" alt="'+esc(g.name)+'" loading="lazy" decoding="async"><span>'+esc(g.unit)+'</span></div><div class="store-game-copy"><strong>'+esc(g.name)+'</strong><small>'+esc(g.tag||"TOP UP")+' • شحن مباشر ↗</small></div></a>'}
function applyFilters(){
 const q=$("#storeSearch"),term=(q?.value||"").trim().toLocaleLowerCase("ar");
 const tiles=[...document.querySelectorAll("#storeGames .store-game-tile")];
 let visible=0;
 tiles.forEach(tile=>{
  const slug=(tile.querySelector(".store-game-art")?.className||"").toLowerCase();
  const text=tile.textContent.toLocaleLowerCase("ar");
  const matchesCategory=activeFilter==="all"||slug.includes(activeFilter);
  const matchesSearch=!term||text.includes(term)||slug.includes(term);
  tile.hidden=!(matchesCategory&&matchesSearch);
  if(!tile.hidden)visible++;
 });
 const count=$("#storeGameCount");
 if(count)count.textContent=String(visible);
 const grid=$("#storeGames");
 let empty=$("#storeEmptyState");
 if(grid&&!empty){empty=document.createElement("p");empty.id="storeEmptyState";empty.className="store-empty-state";empty.setAttribute("role","status");empty.hidden=true;empty.textContent="ما لقينا ألعاب تطابق البحث أو التصنيف. جرّب كلمة ثانية أو اختار كل الألعاب.";grid.appendChild(empty)}
 if(empty)empty.hidden=visible>0;
}
async function getCatalog(){
 const r=await fetch(API+"/game_catalog?select=slug,name,unit,tag,image_url&active=eq.true&order=sort_order.asc",{headers:{apikey:KEY,Authorization:"Bearer "+KEY}});
 if(!r.ok)throw new Error("catalog");
 const data=await r.json();
 if(!Array.isArray(data))throw new Error("catalog response");
 return data;
}
async function boot(){
 const grid=$("#storeGames");
 const filters=[...document.querySelectorAll("#gameFilters [data-filter]")];
 const q=$("#storeSearch"),clear=$("#clearSearch");
 filters.forEach(btn=>btn.addEventListener("click",e=>{
  e.preventDefault();
  filters.forEach(x=>{x.classList.remove("active");x.setAttribute("aria-pressed","false")});
  btn.classList.add("active");btn.setAttribute("aria-pressed","true");
  activeFilter=(btn.dataset.filter||"all").toLowerCase();
  applyFilters();
 }));
 if(q)q.addEventListener("input",applyFilters);
 if(clear)clear.addEventListener("click",()=>{
  if(q)q.value="";
  activeFilter="all";
  filters.forEach(x=>{const active=(x.dataset.filter||"all")==="all";x.classList.toggle("active",active);x.setAttribute("aria-pressed",String(active))});
  applyFilters();q?.focus();
 });
 try{
  const catalog=await getCatalog();
  if(grid){grid.innerHTML=catalog.map(gameCard).join("");}
  const count=$("#storeGameCount");
  if(count)count.textContent=String(catalog.length);
  applyFilters();
 }catch(error){
  if(grid){grid.textContent="تعذر تحميل الألعاب حالياً. تحقق من اتصالك وحاول مرة ثانية.";const retry=document.createElement("button");retry.type="button";retry.className="primary";retry.textContent="إعادة المحاولة";retry.addEventListener("click",boot);grid.append(document.createTextNode(" "),retry)}
 }
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();