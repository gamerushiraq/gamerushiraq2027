(()=>{"use strict";
const URL="https://eyjjmacxxcmdzkfqxifo.supabase.co",KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const sb=window.supabase?.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
const $=id=>document.getElementById(id),status=$("authStatus"),phonePanel=$("phonePanel"),otpPanel=$("otpPanel"),nextRaw=new URLSearchParams(location.search).get("next")||"./";
const next=nextRaw.startsWith(location.origin+"/")||nextRaw.startsWith("./")?nextRaw:"./";
const callbackUrl=new URL("./auth.html",location.href).href;
const msg=(t,c="")=>{status.textContent=t;status.className="gr-auth-status "+c};
const busy=on=>$("phonePanel")?.closest(".gr-auth-card")?.classList.toggle("gr-auth-loading",on);
const syncProfile=async user=>{try{const m=user?.user_metadata||{};await sb.from("profiles").upsert({id:user.id,full_name:m.full_name||m.name||user.email||"GameRush User",phone:user.phone||m.phone||"",avatar_url:m.avatar_url||m.picture||""},{onConflict:"id"})}catch{}};
const go=()=>location.replace(next);
async function oauth(provider){if(!sb)return msg("نظام الحساب غير متصل.","error");busy(true);msg(provider==="google"?"جاري فتح Google…":"جاري فتح Facebook…");const {error}=await sb.auth.signInWithOAuth({provider,options:{redirectTo:callbackUrl+"?next="+encodeURIComponent(next),queryParams:provider==="google"?{prompt:"select_account"}:undefined}});if(error){busy(false);const text=String(error.message||"");if(/not enabled|unsupported provider|provider is not enabled/i.test(text))return msg("تسجيل الدخول بهذا المزود غير مفعّل حالياً في إعدادات GameRush. لازم تفعيل المزود من Supabase أولاً.","error");msg(text||"تعذر فتح تسجيل الدخول.","error")}}
async function sendOtp(){let raw=$("phoneInput").value.trim().replace(/[\s()-]/g,""),phone=raw;if(/^07\d{9}$/.test(raw))phone="+964"+raw.slice(1);if(!/^\+9647\d{9}$/.test(phone))return msg("اكتب رقم عراقي صحيح مثل +9647XXXXXXXXX.","error");$("phoneInput").value=phone;busy(true);msg("جاري إرسال رمز التحقق…");const {error}=await sb.auth.signInWithOtp({phone});busy(false);if(error)return msg(error.message||"تعذر إرسال الرمز. تأكد من تفعيل مزود SMS في Supabase.","error");otpPanel.classList.add("open");msg("وصلتك رسالة SMS؟ أدخل الرمز المكوّن من 6 أرقام.","success")}
async function verifyOtp(){const phone=$("phoneInput").value.trim(),token=$("otpInput").value.trim();if(!/^\d{6}$/.test(token))return msg("أدخل رمز التحقق المكوّن من 6 أرقام.","error");busy(true);msg("جاري التحقق…");const {data,error}=await sb.auth.verifyOtp({phone,token,type:"sms"});busy(false);if(error)return msg(error.message||"الرمز غير صحيح أو منتهي.","error");if(data.user){await syncProfile(data.user);msg("تم إنشاء/تسجيل الحساب بنجاح ✓","success");setTimeout(go,350)}}
$("googleBtn").onclick=()=>oauth("google");$("facebookBtn").onclick=()=>oauth("facebook");
$("phoneBtn").onclick=()=>{phonePanel.classList.add("open");$("phoneInput").focus();msg("أدخل رقمك حتى نرسل رمز تحقق SMS.")};
$("closePhoneBtn").onclick=()=>{phonePanel.classList.remove("open");otpPanel.classList.remove("open");msg("")};
$("sendOtpBtn").onclick=sendOtp;$("resendBtn").onclick=sendOtp;$("verifyOtpBtn").onclick=verifyOtp;
sb?.auth.onAuthStateChange(async(event,session)=>{if(session){await syncProfile(session.user);if(event==="SIGNED_IN"||event==="INITIAL_SESSION")go()}});
(async()=>{if(!sb)return msg("تعذر تشغيل نظام الحساب. حدّث الصفحة.","error");const {data}=await sb.auth.getSession();if(data.session)go()})();
})();
