const data={
pubg:{name:"PUBG Mobile",sub:"شحن UC مباشر",art:"pubg",packs:[["60 UC","2,000 IQD"],["325 UC","9,500 IQD"],["660 UC","18,500 IQD"],["1800 UC","47,000 IQD"]]},
freefire:{name:"Free Fire",sub:"شحن Diamonds",art:"freefire",packs:[["100 Diamonds","2,000 IQD"],["310 Diamonds","5,500 IQD"],["520 Diamonds","9,000 IQD"],["1060 Diamonds","17,500 IQD"]]},
cod:{name:"Call of Duty Mobile",sub:"شحن CP",art:"cod",packs:[["80 CP","2,500 IQD"],["420 CP","10,000 IQD"],["880 CP","20,000 IQD"],["2400 CP","48,000 IQD"]]},
mlbb:{name:"Mobile Legends",sub:"شحن Diamonds",art:"mlbb",packs:[["86 Diamonds","2,000 IQD"],["344 Diamonds","7,000 IQD"],["706 Diamonds","13,500 IQD"],["2190 Diamonds","39,000 IQD"]]},
fc:{name:"EA FC Mobile",sub:"FC Points",art:"fc",packs:[["105 Points","3,000 IQD"],["525 Points","13,000 IQD"],["1075 Points","25,000 IQD"],["2200 Points","48,000 IQD"]]},
roblox:{name:"Roblox",sub:"Robux",art:"roblox",packs:[["400 Robux","8,000 IQD"],["800 Robux","15,000 IQD"],["1700 Robux","30,000 IQD"],["4500 Robux","73,000 IQD"]]}
};

const key=new URLSearchParams(location.search).get("game")||"pubg";
const g=data[key]||data.pubg;
const $=id=>document.getElementById(id);
$("gameName").textContent=g.name;$("title").textContent=g.name;$("subtitle").textContent=g.sub;
const art=$("gameArt");art.className="big-art game-art "+g.art;

let selected=null;
const packs=$("packs");
g.packs.forEach((p,i)=>{
 const b=document.createElement("button");
 b.type="button";b.className="pack";
 b.innerHTML=`<b>${p[0]}</b><span>${p[1]}</span></`+"span>";
 b.addEventListener("click",()=>{
   document.querySelectorAll(".pack").forEach(x=>x.classList.remove("selected"));
   b.classList.add("selected");selected=p;$("total").textContent=p[1];
 });
 packs.appendChild(b);
 if(i===0)b.setAttribute("aria-label",`باقة ${p[0]} بسعر ${p[1]}`);
});

$("orderBtn").addEventListener("click",()=>{
 const playerId=$("playerId").value.trim();
 if(!selected)return alert("اختار الباقة أولاً");
 if(!playerId)return alert("أدخل Player ID");
 if(playerId.length<4)return alert("تأكد من Player ID");
 const orderId="GR-"+Date.now().toString().slice(-8);
 const params=new URLSearchParams({game:key,player:playerId,server:$("serverId").value.trim(),pack:selected[0],price:selected[1],order:orderId});
 alert(`تم تجهيز طلبك التجريبي #${orderId}\n${g.name} — ${selected[0]}\nالإجمالي: ${selected[1]}\n\nالخطوة القادمة: ربط الدفع الحقيقي.`);
 history.replaceState(null,"",`game.html?game=${encodeURIComponent(key)}&order=${encodeURIComponent(orderId)}`);
});
