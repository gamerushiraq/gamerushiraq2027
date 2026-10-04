(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co",SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
if(file==="auth.html")return;
const style=document.createElement("style");
style.textContent="html.gr-auth-checking body{visibility:hidden!important}html.gr-auth-ok body{visibility:visible!important}";
document.head.appendChild(style);
document.documentElement.classList.add("gr-auth-checking");
const redirect=()=>{const here=location.href;location.replace("./auth.html?next="+encodeURIComponent(here))};
function reveal(){document.documentElement.classList.remove("gr-auth-checking");document.documentElement.classList.add("gr-auth-ok")}
async function start(){
  const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:"pkce"}});
  if(!sb)return redirect();
  try{
    const {data,error}=await sb.auth.getUser();
    if(error||!data?.user)return redirect();
    reveal();
  }catch(e){redirect();return}
  sb.auth.onAuthStateChange((event,session)=>{
    if(event==="SIGNED_OUT"||event==="USER_DELETED"||!session)redirect();
    else if(event==="TOKEN_REFRESHED"||event==="SIGNED_IN"||event==="INITIAL_SESSION")reveal();
  });
  window.GameRushAuth=window.GameRushAuth||{};
  window.GameRushAuth.client=sb;
  window.GameRushAuth.signOut=()=>sb.auth.signOut();
}
if(window.supabase)start();
else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;s.onerror=redirect;document.head.appendChild(s)}
})();