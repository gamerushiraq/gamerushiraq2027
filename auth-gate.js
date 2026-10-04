(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co",SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
if(file==="auth.html")return;
const style=document.createElement("style");style.textContent="html.gr-auth-checking body{visibility:hidden!important}html.gr-auth-ok body{visibility:visible!important}";document.head.appendChild(style);document.documentElement.classList.add("gr-auth-checking");
const redirect=()=>{const here=location.href;location.replace("./auth.html?next="+encodeURIComponent(here))};
function start(){const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});if(!sb)return redirect();
const protect=async()=>{try{const {data,error}=await sb.auth.getSession();if(error||!data?.session)return redirect();document.documentElement.classList.remove("gr-auth-checking");document.documentElement.classList.add("gr-auth-ok")}catch(e){redirect()}};
protect();sb.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"||!session)redirect();else{document.documentElement.classList.remove("gr-auth-checking");document.documentElement.classList.add("gr-auth-ok")}});
window.GameRushAuth=window.GameRushAuth||{};window.GameRushAuth.client=sb;window.GameRushAuth.signOut=()=>sb.auth.signOut();}
if(window.supabase)start();else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;s.onerror=redirect;document.head.appendChild(s)}})();