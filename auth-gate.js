(()=>{"use strict";
const SUPABASE_URL="https://eyjjmacxxcmdzkfqxifo.supabase.co",SUPABASE_KEY="sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
const path=location.pathname.split("/").pop()||"index.html";
document.documentElement.classList.add("gr-auth-checking");
if(path==="auth.html")return;
function start(){const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});if(!sb)return;
const protect=async()=>{try{const {data}=await sb.auth.getSession();if(!data.session){location.replace("./auth.html?next="+encodeURIComponent(location.href));return}document.documentElement.classList.add("gr-auth-ok");document.documentElement.classList.remove("gr-auth-checking")}catch(e){location.replace("./auth.html?next="+encodeURIComponent(location.href))}};
protect();sb.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"||!session)location.replace("./auth.html?next="+encodeURIComponent(location.href))});
window.GameRushAuth=window.GameRushAuth||{};window.GameRushAuth.client=sb;window.GameRushAuth.signOut=()=>sb.auth.signOut();
}
if(window.supabase)start();else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";s.onload=start;document.head.appendChild(s)}
})();