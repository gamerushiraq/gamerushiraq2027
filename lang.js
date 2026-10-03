(function(){
"use strict";

const LANGS={
  ar:{name:"العربية",dir:"rtl"},
  en:{name:"English",dir:"ltr"},
  fa:{name:"فارسی",dir:"rtl"},
  ku:{name:"کوردی",dir:"rtl"}
};

const T={
"الرئيسية":["Home","خانه","سەرەکی"],
"المتجر":["Store","فروشگاه","فرۆشگا"],
"الألعاب":["Games","بازی‌ها","یارییەکان"],
"الخدمات":["Services","خدمات","خزمەتگوزارییەکان"],
"VIP":["VIP","VIP","VIP"],
"استرداد":["Redeem","استرداد","گەڕاندنەوە"],
"النقاط والمكافآت":["Points & Rewards","امتیاز و پاداش","خاڵ و خەڵات"],
"تسجيل الدخول":["Log in","ورود","چوونەژوورەوە"],
"إنشاء حساب":["Create account","ایجاد حساب","دروستکردنی هەژمار"],
"ابدأ الشحن الآن":["Top up now","اکنون شارژ کن","ئێستا شحن بکە"],
"تتبع طلبك":["Track your order","پیگیری سفارش","بەدواداچوونی داواکاری"],
"حماية الطلب":["Order protection","محافظت از سفارش","پاراستنی داواکاری"],
"تنفيذ سريع":["Fast fulfillment","اجرای سریع","جێبەجێکردنی خێرا"],
"دفع محلي":["Local payment","پرداخت محلی","پارەدانی ناوخۆیی"],
"كلشي يحتاجه اللاعب 🎮":["Everything a player needs 🎮","همه چیز مورد نیاز بازیکن 🎮","هەموو شتێک یاریزان پێویستیەتی 🎮"],
"شحن سريع":["Fast top up","شارژ سریع","شحنکردنی خێرا"],
"تتبع الطلب":["Track order","پیگیری سفارش","بەدواداچوونی داواکاری"],
"Redeem Center":["Redeem Center","مرکز استرداد","ناوەندی گەڕاندنەوە"],
"شحن ألعاب":["Game top ups","شارژ بازی","شحنکردنی یاری"],
"العروض الحالية 🔥":["Current offers 🔥","پیشنهادهای فعلی 🔥","پێشنیارەکانی ئێستا 🔥"],
"أكثر الألعاب طلباً 🎮":["Most requested games 🎮","محبوب‌ترین بازی‌ها 🎮","زۆرترین یارییە داواکراوەکان 🎮"],
"كل الألعاب":["All games","همه بازی‌ها","هەموو یارییەکان"],
"العروض جاية بالطريق":["Offers are coming soon","پیشنهادها به‌زودی می‌آیند","پێشنیارەکان بەم زووانە دێن"],
"ابدأ الآن":["Start now","اکنون شروع کن","ئێستا دەست پێ بکە"],
"اشحن اللعبة ↗":["Top up game ↗","شارژ بازی ↗","شحنکردنی یاری ↗"],
"اختار اللعبة حتى تنتقل مباشرة إلى صفحة الشحن.":["Choose a game to go directly to its top-up page.","بازی را انتخاب کنید تا مستقیم به صفحه شارژ بروید.","یارییەک هەڵبژێرە بۆ چوونە ڕاستەوخۆ بۆ پەڕەی شحن."],
"بطاقات رقمية":["Digital cards","کارت‌های دیجیتال","کارتی دیجیتاڵ"],
"اشتراكات":["Subscriptions","اشتراک‌ها","بەشداریکردن"],
"عروض":["Offers","پیشنهادها","پێشنیارەکان"],
"حماية":["Protection","محافظت","پاراستن"],
"إحالات":["Referrals","معرفی دوستان","ڕەوانەکردن"],
"نقاطك لها قيمة":["Your points have value","امتیازهای شما ارزشمندند","خاڵەکانت نرخێکیان هەیە"],
"اشحن":["Top up","شارژ کن","شحن بکە"],
"اجمع":["Collect","جمع کن","کۆبکەوە"],
"استبدل":["Redeem","استفاده کن","بیگۆڕە"],
"تحتاج مساعدة؟":["Need help?","کمک لازم دارید؟","یارمەتی پێویستە؟"],
"الدعم قريب منك 🤝":["Support is here 🤝","پشتیبانی اینجاست 🤝","پشتیوانی لێرەیە 🤝"],
"واتساب الدعم":["WhatsApp support","پشتیبانی واتساپ","پشتیوانی واتساپ"],
"الخصوصية":["Privacy","حریم خصوصی","تایبەتمەندی"],
"شروط الاستخدام":["Terms of use","شرایط استفاده","مەرجەکانی بەکارهێنان"],
"بحث":["Search","جستجو","گەڕان"],
"مسح":["Clear","پاک کردن","سڕینەوە"],
"كل الألعاب":["All games","همه بازی‌ها","هەموو یارییەکان"],
"طلباتي":["My orders","سفارش‌های من","داواکارییەکانم"],
"تسجيل دخول الأدمن":["Admin login","ورود مدیر","چوونەژوورەوەی بەڕێوەبەر"],
"لوحة الإدارة الآمنة":["Secure admin panel","پنل مدیریت امن","پانێڵی بەڕێوەبەری پارێزراو"]
};

const originals=new WeakMap();

function pick(lang,key){
  if(!T[key]) return null;
  if(lang==="ar") return key;
  return T[key][lang==="en"?0:lang==="fa"?1:2] || key;
}

function translateText(lang){
  document.querySelectorAll("body *").forEach(el=>{
    if(el.children.length) return;
    const raw=originals.get(el) ?? el.textContent;
    if(!originals.has(el)) originals.set(el,raw);
    const key=raw.trim();
    const translated=pick(lang,key);
    if(translated!==null) el.textContent=translated;
  });

  document.querySelectorAll("input,textarea").forEach(el=>{
    const raw=el.getAttribute("data-original-placeholder") ?? el.placeholder;
    if(!el.hasAttribute("data-original-placeholder")) el.setAttribute("data-original-placeholder",raw);
    const translated=pick(lang,raw);
    if(translated!==null) el.placeholder=translated;
  });

  document.documentElement.lang=lang;
  document.documentElement.dir=LANGS[lang].dir;
  const title={
    ar:"GameRush Iraq — شحن ألعابك بسرعة",
    en:"GameRush Iraq — Fast Game Top Up",
    fa:"GameRush Iraq — شارژ سریع بازی",
    ku:"GameRush Iraq — شحنکردنی یاری"
  }[lang];
  document.title=title;
  document.querySelectorAll("[data-lang-label]").forEach(x=>x.textContent=LANGS[lang].name);
  const btn=document.getElementById("langBtn");
  if(btn) btn.textContent=lang.toUpperCase()+" ▾";
  const floating=document.getElementById("grLangBtn");
  if(floating) floating.textContent=lang.toUpperCase()+" ▾";
  localStorage.setItem("gamerush_lang",lang);
}

function buildMenu(btn){
  let menu=document.getElementById("grLangMenu");
  if(menu) return menu;
  menu=document.createElement("div");
  menu.id="grLangMenu";
  menu.className="gr-language-menu";
  [["ar","العربية"],["en","English"],["fa","فارسی"],["ku","کوردی"]].forEach(([code,name])=>{
    const item=document.createElement("button");
    item.type="button";
    item.dataset.lang=code;
    item.textContent=name;
    item.onclick=()=>{
      translateText(code);
      menu.classList.remove("open");
    };
    menu.appendChild(item);
  });
  document.body.appendChild(menu);
  btn.addEventListener("click",e=>{
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  document.addEventListener("click",()=>menu.classList.remove("open"));
  return menu;
}

function inject(){
  let btn=document.getElementById("langBtn");
  if(!btn){
    const actions=document.querySelector(".header-actions");
    const nav=document.querySelector(".topbar .nav");
    btn=document.createElement("button");
    btn.id="langBtn";
    btn.className="lang";
    btn.type="button";
    btn.textContent="AR ▾";
    if(actions) actions.prepend(btn);
    else if(nav) nav.parentElement?.appendChild(btn);
    else document.body.appendChild(btn);
  }
  buildMenu(btn);
  const saved=localStorage.getItem("gamerush_lang")||"ar";
  translateText(saved);
  let busy=false;
  new MutationObserver(()=>{
    if(busy)return;
    const current=localStorage.getItem("gamerush_lang")||"ar";
    if(current!=="ar"){
      busy=true;
      translateText(current);
      busy=false;
    }
  }).observe(document.body,{childList:true,subtree:true});
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",inject);
else inject();
})();