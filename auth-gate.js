(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co",SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const style=document.createElement("style");
style.textContent="html.gr-auth-checking body{visibility:hidden!important}html.gr-auth-ok body{visibility:visible!important}";
document.head.appendChild(style);
document.documentElement.classList.add("gr-auth-checking");
function reveal(){document.documentElement.classList.remove("gr-auth-checking");document.documentElement.classList.add("gr-auth-ok")}
async function start(){
 const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
 reveal();
 if(!sb)return;
 try{
  const {data}=await sb.auth.getUser();
  window.GameRushAuth=window.GameRushAuth||{};
  window.GameRushAuth.client=sb;
  window.GameRushAuth.user=data?.user||null;
  window.GameRushAuth.signOut=()=>sb.auth.signOut();
 }catch(e){console.warn("Optional auth unavailable",e)}
}
if(window.supabase)start();
else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;s.onerror=reveal;document.head.appendChild(s)}
})();