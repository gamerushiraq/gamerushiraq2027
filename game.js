const data={
pubg:{name:"PUBG Mobile",sub:"شحن UC مباشر",art:"pubg",packs:[["60 UC","2,000 IQD"],["325 UC","9,500 IQD"],["660 UC","18,500 IQD"],["1800 UC","47,000 IQD"]]},
freefire:{name:"Free Fire",sub:"شحن Diamonds",art:"freefire",packs:[["100 Diamonds","2,000 IQD"],["310 Diamonds","5,500 IQD"],["520 Diamonds","9,000 IQD"],["1060 Diamonds","17,500 IQD"]]},
cod:{name:"Call of Duty Mobile",sub:"شحن CP",art:"cod",packs:[["80 CP","2,500 IQD"],["420 CP","10,000 IQD"],["880 CP","20,000 IQD"],["2400 CP","48,000 IQD"]]},
mlbb:{name:"Mobile Legends",sub:"شحن Diamonds",art:"mlbb",packs:[["86 Diamonds","2,000 IQD"],["344 Diamonds","7,000 IQD"],["706 Diamonds","13,500 IQD"],["2190 Diamonds","39,000 IQD"]]},
fc:{name:"EA FC Mobile",sub:"FC Points",art:"fc",packs:[["105 Points","3,000 IQD"],["525 Points","13,000 IQD"],["1075 Points","25,000 IQD"],["2200 Points","48,000 IQD"]]},
roblox:{name:"Roblox",sub:"Robux",art:"roblox",packs:[["400 Robux","8,000 IQD"],["800 Robux","15,000 IQD"],["1700 Robux","30,000 IQD"],["4500 Robux","73,000 IQD"]]}
};

const GAME_IMAGES={pubg:"https://1.bp.blogspot.com/-5Pac6QAl42g/X2Czl-uMwnI/AAAAAAAABMA/zcz9A2QHm08vbK8NE9qDOcu4UPZR0YYiACNcBGAsYHQ/s1304/pubg-mobile-1.png",freefire:"https://akm-img-a-in.tosshub.com/sites/itgaming/resources/202408/image-2024-08-07-132038547070824011958.png",cod:"https://mobilgamer.hu/pictures/jatekteszt/call-of-duty-mobile_1.jpg",mlbb:"https://epngame.com/images/games/mlbb-big-1720743035-6690747b26195.png",fc:"https://www.notebookcheck.com/fileadmin/Notebooks/News/_nc3/Teaser_Vinicius_Junior_FC_Mobile_110823.jpg",roblox:"https://api.kataeb.org/storage/new-website/Technology/roblox.jpeg"};
const ORDER_API="https://eyjjmacxxcmdzkfqxifo.supabase.co/functions/v1/create-order";
const PAYMENT_ACCOUNTS={zain_cash:"07818319951",binance:"1228064206",superqi:"7116027595",asiacell:"07725287238",zain_iraq:"07818319951"};

const playerInput=$("playerId");
const playerCheck=$("checkPlayerId");
const playerMsg=$("playerCheckMessage");
function checkPlayer(){
 const v=(playerInput?.value||"").replace(/\D/g,"");
 if(playerInput) playerInput.value=v;
 if(!v){playerMsg.textContent="أدخل Player ID أولاً.";playerMsg.className="player-check-message error";return false;}
 if(v.length<6||v.length>20){playerMsg.textContent="تأكد من Player ID؛ لازم يكون رقم صحيح.";playerMsg.className="player-check-message error";return false;}
 playerMsg.textContent="تم التحقق من صيغة Player ID ✓ تأكد من اسم الحساب داخل اللعبة قبل الدفع.";
 playerMsg.className="player-check-message success";
 return true;
}
playerInput?.addEventListener("input",()=>{playerMsg.className="player-check-message";playerMsg.textContent="أدخل Player ID ثم اضغط تحقق.";});
playerCheck?.addEventListener("click",checkPlayer);

const key=new URLSearchParams(location.search).get("game")||"pubg";
const g=data[key]||data.pubg;
const $=id=>document.getElementById(id);
$("gameName").textContent=g.name;$("title").textContent=g.name;$("subtitle").textContent=g.sub;
const art=$("gameArt");art.className="big-art game-art "+g.art;
art.innerHTML='<img src="'+GAME_IMAGES[key]+'" alt="'+g.name+' promotional artwork" loading="eager">';

let selected=null;
const packs=$("packs");
g.packs.forEach((p,i)=>{
 const b=document.createElement("button");
 b.type="button";b.className="pack";
 const labels=["أساسية","شائعة","قيمة أفضل","كبيرة"], badges=["","الأكثر طلباً","أفضل قيمة",""]; b.innerHTML=`${badges[i]?`<span class="pack-badge">${badges[i]}</span>`:""}<b class="pack-qty">${p[0]}</b><small class="pack-label">${labels[i]}</small><span class="pack-bonus">${i===2?"عرض + بونص":i===3?"عرض كبير + بونص":""}</span><span class="pack-price">${p[1]}</span><span class="pack-price-note">سعر GameRush</span>`;
 b.addEventListener("click",()=>{
   document.querySelectorAll(".pack").forEach(x=>x.classList.remove("selected"));
   b.classList.add("selected");selected=p;$("total").textContent=p[1];syncPaymentAmount();
 });
 packs.appendChild(b);
 if(i===2) b.dataset.promo="featured";

 if(i===0)b.setAttribute("aria-label",`باقة ${p[0]} بسعر ${p[1]}`);
});

const promoEndKey="gamerush_promo_end";
let promoEnd=Number(localStorage.getItem(promoEndKey)||0);
if(!promoEnd || promoEnd<Date.now()){promoEnd=Date.now()+36*60*60*1000;localStorage.setItem(promoEndKey,String(promoEnd));}
function renderPromoCountdown(){const el=$("promoCountdown");if(!el)return;const left=Math.max(0,promoEnd-Date.now());const s=Math.floor(left/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;el.textContent=[h,m,sec].map(v=>String(v).padStart(2,"0")).join(":");if(left<=0)el.textContent="انتهى";}renderPromoCountdown();setInterval(renderPromoCountdown,1000);
async function loadActivePromo(){
 try{
  const res=await fetch("https://eyjjmacxxcmdzkfqxifo.supabase.co/rest/v1/promotions?select=title,game,package_name,discount_iqd,ends_at&game=eq."+encodeURIComponent(key)+"&active=eq.true&starts_at=lte."+encodeURIComponent(new Date().toISOString())+"&ends_at=gt."+encodeURIComponent(new Date().toISOString())+"&order=ends_at.asc&limit=1",{headers:{apikey:"sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS"}});
  if(!res.ok)return;
  const rows=await res.json(); const promo=rows[0]; if(!promo)return;
  const label=document.querySelector(".promo-timer-label"); if(label)label.textContent=promo.title||"🎁 عرض خاص";
  const selectedPack=promo.package_name?[...document.querySelectorAll(".pack")].find(x=>x.textContent.includes(promo.package_name)):null;
  if(selectedPack)selectedPack.dataset.promo="featured";
  if(promo.ends_at){promoEnd=new Date(promo.ends_at).getTime();localStorage.setItem(promoEndKey,String(promoEnd));renderPromoCountdown();}
 }catch(_){}
}
loadActivePromo();
const promoAction=$("promoAction");
promoAction?.addEventListener("click",()=>{
 const featured=document.querySelector('.pack[data-promo="featured"]');
 if(!featured){$("packs")?.scrollIntoView({behavior:"smooth",block:"center"});return;}
 featured.click();
 featured.scrollIntoView({behavior:"smooth",block:"center"});
 const next=$("toPlayer");
 setTimeout(()=>next?.focus(),350);
});
function showOrderSuccess(orderId){
  $("successOrderId").textContent=orderId;
  $("successGame").textContent=g.name;
  $("successPack").textContent=selected[0];
  $("successPrice").textContent=selected[1];
  $("trackOrderLink").href="./track.html?order="+encodeURIComponent(orderId);
  $("orderSuccess").hidden=false;
  $("orderSuccess").scrollIntoView({behavior:"smooth",block:"center"});
}
$("copyOrderId").addEventListener("click",()=>{
  copyText($("successOrderId").textContent,$("copyOrderId"),"تم النسخ ✓");
});
$("newOrder").addEventListener("click",()=>location.reload());

function syncPaymentAmount(){
  const value=$("total").textContent;
  $("paymentAmount").textContent=value==="—"?"—":value;
}
function copyText(value,button,label="تم النسخ ✓"){
  const done=()=>{button.textContent=label;setTimeout(()=>button.textContent=button.dataset.original||"نسخ",1500);};
  navigator.clipboard?.writeText(value).then(done).catch(()=>{
    const t=document.createElement("textarea");t.value=value;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();done();
  });
}
$("copyAmount").addEventListener("click",()=>{
  const value=$("paymentAmount").textContent;
  if(value!=="—") copyText(value,$("copyAmount"));
});
function refreshPaymentAccount(){
  const method=$("paymentMethod").value;
  const box=$("paymentAccounts"),z=$("zainAccount"),b=$("binanceAccount"),sq=$("superqiAccount"),a=$("asiacellAccount"),zi=$("zainIraqAccount");
  if(!method){box.hidden=true;z.hidden=true;b.hidden=true;sq.hidden=true;a.hidden=true;zi.hidden=true;return;}
  box.hidden=false; z.hidden=method!=="zain_cash"; b.hidden=method!=="binance"; sq.hidden=method!=="superqi"; a.hidden=method!=="asiacell"; zi.hidden=method!=="zain_iraq"; const hint=$("paymentHint"); if(hint){hint.textContent="② حوّل المبلغ للحساب الظاهر أدناه ثم أدخل رقم العملية";hint.classList.add("ready");}
}
$("paymentMethod").addEventListener("change",refreshPaymentAccount);
document.querySelectorAll(".copy-account").forEach(btn=>{
  btn.addEventListener("click",async()=>{
    const value=btn.dataset.copy;
    try{await navigator.clipboard.writeText(value);btn.textContent="تم النسخ ✓";}
    catch{const t=document.createElement("textarea");t.value=value;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();btn.textContent="تم النسخ ✓";}
    setTimeout(()=>btn.textContent="نسخ الرقم",1500);
  });
});
refreshPaymentAccount();

$("orderBtn").addEventListener("click",async()=>{
 const playerId=$("#playerId").value.trim();
 const paymentMethod=$("#paymentMethod").value;
 const paymentReference=$("#paymentReference").value.trim();
 const customerPhone=$("#customerPhone").value.trim();
 const notes=$("#orderNotes").value.trim();

 if(!selected)return alert("اختار الباقة أولاً");
 if(!playerId)return alert("أدخل Player ID");
 if(playerId.length<4)return alert("تأكد من Player ID");
 if(!paymentMethod)return alert("اختار طريقة الدفع");
 if(!paymentReference)return alert("أدخل رقم العملية / TxID");
 if(!customerPhone)return alert("أدخل رقم هاتفك");

 const priceIqd=Number(String(selected[1]).replace(/[^0-9]/g,""));
 const orderId="GR-"+Date.now().toString().slice(-8);
 const payload={
   order_number:orderId,
   game:key,
   package_name:selected[0],
   player_id:playerId,
   server_id:$("#serverId").value.trim()||null,
   price_iqd:priceIqd,
   payment_method:paymentMethod,
   payment_reference:paymentReference,
   customer_phone:customerPhone,
   notes:notes||null
 };

 const btn=$("#orderBtn");
 const original=btn.textContent;
 btn.disabled=true;
 btn.textContent="جاري إرسال الطلب…";

 try{
   const res=await fetch(ORDER_API,{
     method:"POST",
     headers:{"Content-Type":"application/json"},
     body:JSON.stringify(payload)
   });
   const result=await res.json().catch(()=>({}));
   if(res.status===409) throw new Error("هذا الطلب موجود مسبقاً، حاول مرة ثانية.");
   if(!res.ok) throw new Error(result.error||"تعذر إرسال الطلب");

   const order={
     id:orderId,game:key,gameName:g.name,playerId,
     serverId:$("#serverId").value.trim(),
     pack:selected[0],price:selected[1],status:"جديد",
     paymentMethod,paymentReference,customerPhone,notes,
     paymentStatus:"تم إرسال الدفع للمراجعة",createdAt:new Date().toISOString()
   };
   const orders=JSON.parse(localStorage.getItem("gamerush_orders")||"[]");
   orders.unshift(order);
   localStorage.setItem("gamerush_orders",JSON.stringify(orders));
   alert("تم استلام طلبك بنجاح #"+orderId+"\n"+g.name+" — "+selected[0]+"\nالإجمالي: "+selected[1]+"\n\nسيتم التحقق من الدفع ثم تنفيذ الشحن.");
   history.replaceState(null,"","game.html?game="+encodeURIComponent(key)+"&order="+encodeURIComponent(orderId));
 }catch(err){
   alert(err.message||"حدث خطأ أثناء إرسال الطلب");
 }finally{
   btn.disabled=false;
   btn.textContent=original;
 }
});

(function(){const p=[...document.querySelectorAll(".wizard-step-panel")],t=[...document.querySelectorAll("#wizardSteps span")];function go(n){p.forEach(x=>x.classList.toggle("active",+x.dataset.panel===n));t.forEach(x=>x.classList.toggle("active",+x.dataset.step===n));if(innerWidth<=600)document.querySelector(".wizard-card")?.scrollIntoView({behavior:"smooth",block:"start"})}function playerOK(){const v=$("playerId").value.trim();if(!v){alert("أدخل Player ID أولاً");$("playerId").focus();return false}if(v.length<4){alert("تأكد من Player ID");return false}return true}$("toPlayer").onclick=()=>selected?go(2):alert("اختار الباقة أولاً");$("toPayment").onclick=()=>playerOK()&&go(3);$("backPlayer").onclick=()=>go(2);})();
