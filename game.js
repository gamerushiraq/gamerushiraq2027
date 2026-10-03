const data={
pubg:{name:"PUBG Mobile",sub:"شحن UC مباشر",art:"pubg",packs:[["60 UC","2,000 IQD"],["325 UC","9,500 IQD"],["660 UC","18,500 IQD"],["1800 UC","47,000 IQD"]]},
freefire:{name:"Free Fire",sub:"شحن Diamonds",art:"freefire",packs:[["100 Diamonds","2,000 IQD"],["310 Diamonds","5,500 IQD"],["520 Diamonds","9,000 IQD"],["1060 Diamonds","17,500 IQD"]]},
cod:{name:"Call of Duty Mobile",sub:"شحن CP",art:"cod",packs:[["80 CP","2,500 IQD"],["420 CP","10,000 IQD"],["880 CP","20,000 IQD"],["2400 CP","48,000 IQD"]]},
mlbb:{name:"Mobile Legends",sub:"شحن Diamonds",art:"mlbb",packs:[["86 Diamonds","2,000 IQD"],["344 Diamonds","7,000 IQD"],["706 Diamonds","13,500 IQD"],["2190 Diamonds","39,000 IQD"]]},
fc:{name:"EA FC Mobile",sub:"FC Points",art:"fc",packs:[["105 Points","3,000 IQD"],["525 Points","13,000 IQD"],["1075 Points","25,000 IQD"],["2200 Points","48,000 IQD"]]},
roblox:{name:"Roblox",sub:"Robux",art:"roblox",packs:[["400 Robux","8,000 IQD"],["800 Robux","15,000 IQD"],["1700 Robux","30,000 IQD"],["4500 Robux","73,000 IQD"]]}
};

const ORDER_API="https://eyjjmacxxcmdzkfqxifo.supabase.co/functions/v1/create-order";
const PAYMENT_ACCOUNTS={zain_cash:"07818319951",binance:"1228064206"};

const key=new URLSearchParams(location.search).get("game")||"pubg";
const g=data[key]||data.pubg;
const $=id=>document.getElementById(id);
$("gameName").textContent=g.name;$("title").textContent=g.name;$("subtitle").textContent=g.sub;
const art=$("gameArt");art.className="big-art game-art "+g.art;
const artSVG={
pubg:`<svg viewBox="0 0 700 280" aria-label="PUBG Mobile style artwork"><defs><linearGradient id="a" x1="0" x2="1"><stop stop-color="#6f9f38"/><stop offset="1" stop-color="#172638"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#a)"/><circle cx="555" cy="65" r="58" fill="#e9c46a" opacity=".35"/><path d="M400 245l35-100 28-18 28 18 35 100z" fill="#1d2630"/><circle cx="477" cy="105" r="34" fill="#c99564"/><path d="M439 103q38-65 76 0" fill="#20252b"/><path d="M430 175h95l-18 70h-60z" fill="#4e5d3a"/><path d="M432 184l-55 42M523 184l55 42" stroke="#d7b57a" stroke-width="14" stroke-linecap="round"/><text x="32" y="62" fill="white" font-size="34" font-weight="900">PUBG</text><text x="32" y="96" fill="#fff" font-size="20">MOBILE • UC</text></svg>`,
freefire:`<svg viewBox="0 0 700 280" aria-label="Free Fire style artwork"><defs><linearGradient id="b" x1="0" y1="1" x2="1"><stop stop-color="#711b34"/><stop offset="1" stop-color="#f06b22"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#b)"/><path d="M0 250Q170 150 330 245T700 210V280H0z" fill="#260d20"/><path d="M445 245l22-88 28-26 30 26 22 88z" fill="#171521"/><circle cx="496" cy="111" r="31" fill="#b66d4d"/><path d="M467 110q25-55 58-7l-6 30h-50z" fill="#15131b"/><path d="M450 170h92l-15 72h-64z" fill="#d9d4ca"/><path d="M454 178l-54 55M538 178l53 55" stroke="#181520" stroke-width="13" stroke-linecap="round"/><text x="32" y="62" fill="white" font-size="31" font-weight="900">FREE FIRE</text><text x="32" y="96" fill="#fff" font-size="20">DIAMONDS</text></svg>`,
cod:`<svg viewBox="0 0 700 280" aria-label="Call of Duty Mobile style artwork"><defs><linearGradient id="c" x1="0" x2="1"><stop stop-color="#141a17"/><stop offset="1" stop-color="#6c7a4a"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#c)"/><path d="M430 245l24-105 25-22 31 22 29 105z" fill="#15191a"/><circle cx="493" cy="106" r="34" fill="#9b684c"/><path d="M458 103q33-50 69 0v31h-69z" fill="#333a36"/><path d="M444 170h103l-12 75h-80z" fill="#4b5145"/><path d="M449 178l-67 38M542 178l72 34" stroke="#151a17" stroke-width="17" stroke-linecap="round"/><text x="30" y="62" fill="white" font-size="27" font-weight="900">CALL OF DUTY</text><text x="30" y="96" fill="#e0ee86" font-size="20">MOBILE • CP</text></svg>`,
mlbb:`<svg viewBox="0 0 700 280" aria-label="Mobile Legends style artwork"><defs><linearGradient id="d" x1="0" x2="1"><stop stop-color="#173c83"/><stop offset="1" stop-color="#8a43c5"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#d)"/><circle cx="500" cy="115" r="58" fill="#72dcff" opacity=".22"/><path d="M455 245l20-105 30-27 30 27 25 105z" fill="#161a36"/><circle cx="505" cy="106" r="31" fill="#c78668"/><path d="M475 100q25-58 61 0" fill="#e6c2a0"/><path d="M462 170h88l-10 73h-68z" fill="#7d9bd1"/><path d="M462 180l-62 40M548 180l63 40" stroke="#8feaff" stroke-width="10"/><text x="30" y="62" fill="white" font-size="31" font-weight="900">MOBILE LEGENDS</text><text x="30" y="96" fill="#bff4ff" font-size="20">DIAMONDS</text></svg>`,
fc:`<svg viewBox="0 0 700 280" aria-label="EA FC Mobile style artwork"><defs><linearGradient id="e" x1="0" x2="1"><stop stop-color="#07563f"/><stop offset="1" stop-color="#1b9c69"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#e)"/><path d="M0 210Q180 160 350 215T700 185V280H0z" fill="#0a6c43"/><circle cx="500" cy="105" r="32" fill="#9f6d51"/><path d="M467 105q32-52 65 0v18h-65z" fill="#161d1d"/><path d="M458 172h85l-7 66h-70z" fill="#f4f4f4"/><path d="M458 178l-42 67M543 178l45 67" stroke="#101b1a" stroke-width="13"/><circle cx="420" cy="235" r="18" fill="white"/><text x="30" y="62" fill="white" font-size="31" font-weight="900">EA FC MOBILE</text><text x="30" y="96" fill="#d5ffe9" font-size="20">FC POINTS</text></svg>`,
roblox:`<svg viewBox="0 0 700 280" aria-label="Roblox style artwork"><defs><linearGradient id="f" x1="0" x2="1"><stop stop-color="#44208a"/><stop offset="1" stop-color="#e63d75"/></linearGradient></defs><rect width="700" height="280" rx="28" fill="url(#f)"/><rect x="455" y="75" width="78" height="78" rx="10" fill="#f1d7c3"/><rect x="445" y="155" width="100" height="72" rx="8" fill="#21c4c8"/><rect x="428" y="172" width="18" height="55" fill="#f1d7c3"/><rect x="544" y="172" width="18" height="55" fill="#f1d7c3"/><rect x="467" y="227" width="25" height="45" fill="#27305d"/><rect x="510" y="227" width="25" height="45" fill="#27305d"/><circle cx="478" cy="108" r="7"/><circle cx="510" cy="108" r="7"/><text x="30" y="62" fill="white" font-size="42" font-weight="900">ROBLOX</text><text x="30" y="96" fill="#fff" font-size="20">ROBUX</text></svg>`
};
art.innerHTML=artSVG[key]||artSVG.pubg;

let selected=null;
const packs=$("packs");
g.packs.forEach((p,i)=>{
 const b=document.createElement("button");
 b.type="button";b.className="pack";
 b.innerHTML=`<b class="pack-qty">${p[0]}</b><span class="pack-price">${p[1]}</span>`;
 b.addEventListener("click",()=>{
   document.querySelectorAll(".pack").forEach(x=>x.classList.remove("selected"));
   b.classList.add("selected");selected=p;$("total").textContent=p[1];
 });
 packs.appendChild(b);
 if(i===0)b.setAttribute("aria-label",`باقة ${p[0]} بسعر ${p[1]}`);
});

function refreshPaymentAccount(){
  const method=$("paymentMethod").value;
  const box=$("paymentAccounts"),z=$("zainAccount"),b=$("binanceAccount");
  if(!method){box.hidden=true;z.hidden=true;b.hidden=true;return;}
  box.hidden=false; z.hidden=method!=="zain_cash"; b.hidden=method!=="binance";
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
