(function(){
"use strict";
const LANGS={
 ar:{name:"العربية",dir:"rtl"},
 en:{name:"English",dir:"ltr"},
 fa:{name:"فارسی",dir:"rtl"},
 ku:{name:"کوردی",dir:"rtl"}
};
const T={
"الرئيسية":["Home","خانه","سەرەکی"],"الألعاب":["Games","بازی‌ها","یارییەکان"],"الخدمات":["Services","خدمات","خزمەتگوزارییەکان"],"النقاط والمكافآت":["Points & Rewards","امتیاز و پاداش","خاڵ و خەڵات"],"تسجيل الدخول":["Log in","ورود","چوونەژوورەوە"],"إنشاء حساب":["Create account","ایجاد حساب","دروستکردنی هەژمار"],"بحث":["Search","جستجو","گەڕان"],"ابدأ الشحن الآن":["Top up now","اکنون شارژ کن","ئێستا شحن بکە"],"استكشف الخدمات":["Explore services","مشاهده خدمات","خزمەتگوزارییەکان ببینە"],"دفع آمن":["Secure payment","پرداخت امن","پارەدانی پارێزراو"],"تنفيذ سريع":["Fast fulfillment","اجرای سریع","جێبەجێکردنی خێرا"],"نقاط ومكافآت":["Points & rewards","امتیاز و پاداش","خاڵ و خەڵات"],"الأكثر طلباً":["Popular","پرفروش‌ترین","زۆر داواکراو"],"عرض الكل ←":["View all →","مشاهده همه ←","هەمووی ببینە ←"],"شحن UC":["UC top up","شارژ UC","شحنکردنی UC"],"شحن Diamonds":["Diamonds top up","شارژ الماس","شحنکردنی Diamonds"],"شحن CP":["CP top up","شارژ CP","شحنکردنی CP"],"كل طلب يقرّبك للمكافأة 🎁":["Every order gets you closer to a reward 🎁","هر سفارش تو را به پاداش نزدیک‌تر می‌کند 🎁","هەر داواکارییەک نزیکت دەکاتەوە لە خەڵات 🎁"],"اعرف أكثر":["Learn more","بیشتر بدانید","زیاتر بزانە"],"خدماتنا":["Our services","خدمات ما","خزمەتگوزارییەکانمان"],"بطاقات رقمية":["Digital cards","کارت‌های دیجیتال","کارتی دیجیتاڵ"],"شحن ألعاب":["Game top ups","شارژ بازی","شحنکردنی یاری"],"اشتراكات":["Subscriptions","اشتراک‌ها","بەشداریکردن"],"عروض":["Offers","پیشنهادها","پێشنیارەکان"],"حماية":["Protection","محافظت","پاراستن"],"إحالات":["Referrals","معرفی دوستان","ڕەوانەکردن"],"نقاطك لها قيمة":["Your points have value","امتیازهای شما ارزشمندند","خاڵەکانت نرخێکیان هەیە"],"اشحن":["Top up","شارژ کن","شحن بکە"],"اجمع":["Collect","جمع کن","کۆبکەوە"],"استبدل":["Redeem","استفاده کن","بیگۆڕە"],"تحتاج مساعدة؟":["Need help?","کمک لازم دارید؟","یارمەتی پێویستە؟"],"الدعم قريب منك 🤝":["Support is here 🤝","پشتیبانی نزدیک شماست 🤝","پشتیوانی لێرەیە 🤝"],"واتساب الدعم":["WhatsApp support","پشتیبانی واتساپ","پشتیوانی واتساپ"],"الخصوصية":["Privacy","حریم خصوصی","تایبەتمەندی"],"شروط الاستخدام":["Terms of use","شرایط استفاده","مەرجەکانی بەکارهێنان"],"اختار الباقة":["Choose a package","بسته را انتخاب کنید","پاکەت هەڵبژێرە"],"اختار المنتج":["Choose product","محصول را انتخاب کنید","بەرهەم هەڵبژێرە"],"بيانات اللاعب":["Player details","اطلاعات بازیکن","زانیاری یاریزان"],"الدفع":["Payment","پرداخت","پارەدان"],"الإجمالي":["Total","مجموع","کۆی گشتی"],"طريقة الدفع":["Payment method","روش پرداخت","شێوازی پارەدان"],"اختار طريقة الدفع":["Choose payment method","روش پرداخت را انتخاب کنید","شێوازی پارەدان هەڵبژێرە"],"رقم هاتفك":["Your phone number","شماره تلفن شما","ژمارەی تەلەفۆنت"],"ملاحظة":["Note","یادداشت","تێبینی"],"اختياري":["Optional","اختیاری","ئارەزوومەندانە"],"نسخ المبلغ":["Copy amount","کپی مبلغ","کۆپیکردنی بڕ"],"نسخ الرقم":["Copy number","کپی شماره","کۆپیکردنی ژمارە"],"تتبع حالة الطلب":["Track order","پیگیری سفارش","بەدواداچوونی داواکاری"],"إنشاء طلب جديد":["Create new order","ایجاد سفارش جدید","داواکاری نوێ دروست بکە"],"تتبع طلبك 🚀":["Track your order 🚀","سفارش خود را پیگیری کنید 🚀","بەدوای داواکارییەکەتدا بگەڕێ 🚀"],"تتبع الطلب ←":["Track order →","پیگیری سفارش ←","بەدوای داواکاری بگەڕێ ←"],"رقم الطلب":["Order number","شماره سفارش","ژمارەی داواکاری"],"اللعبة":["Game","بازی","یاری"],"الباقة":["Package","بسته","پاکەت"],"المبلغ":["Amount","مبلغ","بڕ"],"تم استلام الطلب":["Order received","سفارش دریافت شد","داواکاری وەرگیرا"],"التحقق من الدفع":["Payment verification","بررسی پرداخت","پشکنینی پارەدان"],"بانتظار تنفيذ الشحن":["Waiting for fulfillment","در انتظار اجرای شارژ","چاوەڕوانی جێبەجێکردنی شحن"],"جاري تنفيذ الشحن":["Fulfillment in progress","شارژ در حال اجراست","شحن لە جێبەجێکردندایە"],"اكتمل الشحن":["Top up completed","شارژ تکمیل شد","شحن تەواو بوو"],"سجل الطلب":["Order history","تاریخچه سفارش","مێژووی داواکاری"],"العودة للألعاب":["Back to games","بازگشت به بازی‌ها","گەڕانەوە بۆ یارییەکان"],"لوحة الإدارة الآمنة":["Secure admin panel","پنل مدیریت امن","پانێڵی بەڕێوەبەری پارێزراو"],"تسجيل دخول الأدمن":["Admin login","ورود مدیر","چوونەژوورەوەی بەڕێوەبەر"],"إدارة الطلبات":["Order management","مدیریت سفارش‌ها","بەڕێوەبردنی داواکارییەکان"],"تسجيل خروج":["Log out","خروج","چوونەدەرەوە"],"كل الطلبات":["All orders","همه سفارش‌ها","هەموو داواکارییەکان"],"جديدة":["New","جدید","نوێ"],"قيد التنفيذ":["Processing","در حال اجرا","لە جێبەجێکردندایە"],"مكتملة":["Completed","تکمیل‌شده","تەواوکراو"],"ملغاة":["Cancelled","لغوشده","هەڵوەشێنراوە"],"كل الحالات":["All statuses","همه وضعیت‌ها","هەموو دۆخەکان"],"كل طرق الدفع":["All payment methods","همه روش‌های پرداخت","هەموو شێوازەکانی پارەدان"],"كل حالات الدفع":["All payment statuses","همه وضعیت‌های پرداخت","هەموو دۆخەکانی پارەدان"],"تحديث":["Refresh","به‌روزرسانی","نوێکردنەوە"],"مطلوب للتحقق":["Required for verification","برای بررسی الزامی است","بۆ پشکنین پێویستە"]}
};
const originals=new WeakMap();
function translateText(lang){
 document.querySelectorAll("body *").forEach(el=>{
  if(el.children.length) return;
  const raw=originals.get(el)??el.textContent;
  if(!originals.has(el)) originals.set(el,raw);
  const key=raw.trim();
  if(T[key]) el.textContent=lang==="ar"?key:T[key][lang==="en"?0:lang==="fa"?1:2];
 });
 document.querySelectorAll("input,textarea").forEach(el=>{
  const raw=el.getAttribute("data-original-placeholder")??el.placeholder;
  if(!el.hasAttribute("data-original-placeholder"))el.setAttribute("data-original-placeholder",raw);
  if(T[raw])el.placeholder=lang==="ar"?raw:T[raw][lang==="en"?0:lang==="fa"?1:2];
 });
 document.documentElement.lang=lang;document.documentElement.dir=LANGS[lang].dir;
 document.title=lang==="ar"?"GameRush Iraq — شحن ألعابك بسرعة":lang==="en"?"GameRush Iraq — Game Top Up":lang==="fa"?"GameRush Iraq — شارژ بازی":"GameRush Iraq — شحنکردنی یاری";
 const btn=document.getElementById("grLangBtn");if(btn)btn.textContent=lang.toUpperCase()+" ▾";
 localStorage.setItem("gamerush_lang",lang);
}
function inject(){
 const b=document.createElement("button");b.id="grLangBtn";b.className="lang";b.type="button";b.textContent="AR ▾";b.setAttribute("aria-label","Language");
 b.style.cssText="position:fixed;left:14px;bottom:14px;z-index:9999;border:1px solid #ffffff30;background:#111827;color:#fff;border-radius:12px;padding:10px 13px;font-weight:800;box-shadow:0 8px 30px #0005";
 const menu=document.createElement("div");menu.id="grLangMenu";menu.style.cssText="display:none;position:fixed;left:14px;bottom:60px;z-index:10000;background:#111827;color:#fff;border:1px solid #ffffff20;border-radius:14px;padding:6px;box-shadow:0 12px 35px #0006";
 [["ar","العربية"],["en","English"],["fa","فارسی"],["ku","کوردی"]].forEach(([k,n])=>{const x=document.createElement("button");x.textContent=n;x.dataset.lang=k;x.style.cssText="display:block;width:130px;padding:9px;border:0;background:transparent;color:#fff;text-align:right;border-radius:9px;cursor:pointer;font:inherit";x.onclick=()=>{translateText(k);menu.style.display="none"};menu.appendChild(x)});
 b.onclick=()=>menu.style.display=menu.style.display==="none"?"block":"none";document.body.append(b,menu);
 let translating=false;new MutationObserver(()=>{if(translating)return;const l=localStorage.getItem("gamerush_lang")||"ar";if(l!=="ar"){translating=true;translateText(l);translating=false}}).observe(document.body,{childList:true,subtree:true});
 translateText(localStorage.getItem("gamerush_lang")||"ar");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject);else inject();
})();