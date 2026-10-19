(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co";
const SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const PUBLIC_AUTH_CALLBACK="https://gamerushiraq.github.io/gamerushiraq2027/auth.html";
const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const modal=document.getElementById("authModal"),form=document.getElementById("authForm"),email=document.getElementById("authEmail"),password=document.getElementById("authPassword"),nameInput=document.getElementById("authName"),nameWrap=document.getElementById("authNameWrap"),submit=document.getElementById("authSubmit"),status=document.getElementById("authStatus"),hint=document.getElementById("authHint"),forgot=document.getElementById("authForgot"),account=document.getElementById("authAccount"),title=document.getElementById("authTitle");
let mode="login";
const setStatus=(msg,type="")=>{if(status){status.textContent=msg;status.className="gr-auth-status "+type}};
const setMode=(next)=>{mode=next;document.querySelectorAll("[data-auth-mode]").forEach(b=>b.classList.toggle("active",b.dataset.authMode===mode));nameWrap.hidden=mode!=="signup";submit.textContent=mode==="login"?"تسجيل الدخول":"إنشاء الحساب";forgot.hidden=mode!=="login";hint.textContent=mode==="login"?"سجّل دخولك حتى تحفظ طلباتك وتتابع حسابك.":"أنشئ حساب GameRush بالبريد وكلمة المرور.";password.autocomplete=mode==="login"?"current-password":"new-password";setStatus("")};
document.querySelectorAll("[data-auth-mode]").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.authMode)));
function showAccount(user){if(!account)return;account.hidden=false;account.innerHTML="<b>مسجل دخولك ✅</b><span>"+(user.email||"")+" </span><button type=\"button\" id=\"authLogout\" class=\"gr-auth-link\">تسجيل الخروج</button>";document.getElementById("authLogout")?.addEventListener("click",async()=>{await sb?.auth.signOut();showSignedOut()})}
function showSignedOut(){if(account){account.hidden=true;account.innerHTML=""}}
async function refresh(){if(!sb)return setStatus("تعذر تشغيل نظام الحساب. حدّث الصفحة.","error");const {data}=await sb.auth.getSession();if(data.session)showAccount(data.session.user);else showSignedOut()}
form?.addEventListener("submit",async e=>{e.preventDefault();if(!sb)return setStatus("نظام الحساب غير متصل حالياً.","error");const em=email.value.trim().toLowerCase(),pw=password.value;setStatus("");if(!em||!em.includes("@"))return setStatus("اكتب بريد إلكتروني صحيح.","error");if(pw.length<6)return setStatus("كلمة المرور لازم تكون 6 أحرف أو أكثر.","error");submit.disabled=true;submit.textContent="جاري المعالجة…";
try{
 if(mode==="signup"){const {data,error}=await sb.auth.signUp({email:em,password:pw,options:{data:{full_name:nameInput.value.trim()||null},emailRedirectTo:PUBLIC_AUTH_CALLBACK}});if(error)throw error;if(data.session){showAccount(data.user);setStatus("تم إنشاء الحساب وتسجيل الدخول ✅","success")}else setStatus("تم إنشاء الحساب. افتح رسالة التأكيد اللي وصلت لبريدك ثم سجّل دخولك.","success")}
 else {const {data,error}=await sb.auth.signInWithPassword({email:em,password:pw});if(error)throw error;showAccount(data.user);setStatus("تم تسجيل الدخول بنجاح ✅","success")}
}catch(err){setStatus(err?.message||"صار خطأ، حاول مرة ثانية.","error")}finally{submit.disabled=false;submit.textContent=mode==="login"?"تسجيل الدخول":"إنشاء الحساب"}});
forgot?.addEventListener("click",async()=>{if(!sb)return;const em=email.value.trim().toLowerCase();if(!em||!em.includes("@"))return setStatus("اكتب بريدك أولاً حتى نرسل رابط إعادة التعيين.","error");forgot.disabled=true;const {error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:PUBLIC_AUTH_CALLBACK});forgot.disabled=false;if(error)setStatus(error.message,"error");else setStatus("إذا البريد مسجل، راح توصلك رسالة إعادة تعيين كلمة المرور.","success")});
sb?.auth.onAuthStateChange((event,session)=>{if(session)showAccount(session.user);else showSignedOut()});
refresh();
window.GameRushAuth={client:sb,open:()=>window.dispatchEvent(new CustomEvent("gamerush:auth-open"))};
})();