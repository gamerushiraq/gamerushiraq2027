import { createClient } from "jsr:@supabase/supabase-js@2";
const SUPABASE_URL=Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const allowedOrigin="https://gamerushiraq.github.io";
const QI_BASE=(Deno.env.get("QICARD_API_BASE")||"https://uat-sandbox-3ds-api.qi.iq/api/v1").replace(/\/$/,"");
const QI_TERMINAL=Deno.env.get("QICARD_TERMINAL_ID")||"";
const QI_USER=Deno.env.get("QICARD_USERNAME")||"";
const QI_PASS=Deno.env.get("QICARD_PASSWORD")||"";
const FINISH_URL=Deno.env.get("QICARD_FINISH_URL")||"https://gamerushiraq.github.io/gamerushiraq2027/payment-result.html";
const NOTIFY_URL=Deno.env.get("QICARD_NOTIFICATION_URL")||`${SUPABASE_URL}/functions/v1/qicard-webhook`;
function response(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":allowedOrigin,"Access-Control-Allow-Headers":"content-type, authorization, apikey","Access-Control-Allow-Methods":"POST, OPTIONS"}})}
async function requireUser(req:Request){
  const auth=req.headers.get("authorization")||"";
  if(!auth.toLowerCase().startsWith("bearer "))return null;
  const token=auth.slice(7).trim(); if(!token)return null;
  const client=createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{global:{headers:{Authorization:`Bearer ${token}`}}});
  const {data:{user}}=await client.auth.getUser();
  return user?{user,client}:null;
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return response({ok:true});
  if(req.method!=="POST")return response({error:"Method not allowed"},405);
  if(req.headers.get("origin")&&req.headers.get("origin")!==allowedOrigin)return response({error:"Origin not allowed"},403);
  const auth=await requireUser(req); if(!auth)return response({error:"تسجيل الدخول مطلوب"},401);
  const {user}=auth;
  const supabase=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY);
  if(!QI_TERMINAL||!QI_USER||!QI_PASS)return response({error:"QiCard payment gateway is not configured yet"},503);
  try{
    const body=await req.json();
    const game=String(body.game||"").trim().toLowerCase();
    const package_name=String(body.package_name||"").trim();
    const player_id=String(body.player_id||"").trim();
    const server_id=body.server_id?String(body.server_id).trim():null;
    const customerPhone=body.customer_phone?String(body.customer_phone).trim():null;
    if(!game||!package_name)return response({error:"Invalid game or package"},400);
    if(!player_id||player_id.length<4||player_id.length>32)return response({error:"Player ID غير صحيح"},400);
    if(server_id&&server_id.length>32)return response({error:"Server ID غير صحيح"},400);
    const {data:pkg,error:pkgError}=await supabase.from("game_packages").select("package_name,price_iqd").eq("game_slug",game).eq("package_name",package_name).eq("active",true).maybeSingle();
    if(pkgError||!pkg)return response({error:"Invalid game or package"},400);
    const baseAmount=Number(pkg.price_iqd); if(!Number.isFinite(baseAmount)||baseAmount<=0)return response({error:"Invalid amount"},400);
    const now=new Date().toISOString();
    const {data:promos}=await supabase.from("promotions").select("discount_iqd").eq("game",game).eq("active",true).lte("starts_at",now).gt("ends_at",now).or("package_name.is.null,package_name.eq."+package_name).order("discount_iqd",{ascending:false}).limit(1);
    const discount=promos?.[0]?Math.max(0,Number(promos[0].discount_iqd||0)):0;
    const amount=Math.max(0,baseAmount-discount); if(!Number.isFinite(amount)||amount<=0)return response({error:"Invalid amount"},400);
    const orderNumber="GR-"+crypto.randomUUID().replace(/-/g,"").slice(0,16).toUpperCase();
    const requestId=crypto.randomUUID();
    const {data:order,error:orderError}=await supabase.from("orders").insert({user_id:user.id,order_number:orderNumber,game,package_name,player_id,server_id,price_iqd:amount,status:"new",payment_method:"qicard",payment_reference:requestId,customer_phone:customerPhone,notes:null,payment_status:"pending",fulfillment_status:"pending",payment_provider:"qicard"}).select("id,order_number").single();
    if(orderError||!order)return response({error:"Could not create order"},500);
    const basic=btoa(`${QI_USER}:${QI_PASS}`);
    const gatewayRes=await fetch(`${QI_BASE}/payment`,{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Basic ${basic}`,"X-Terminal-Id":QI_TERMINAL},body:JSON.stringify({requestId,amount,currency:"IQD",locale:"ar_IQ",finishPaymentUrl:FINISH_URL,notificationUrl:NOTIFY_URL,customerInfo:{phone:customerPhone||undefined,email:user.email||undefined,accountId:user.id},additionalInfo:{orderNumber,game,packageName:package_name,playerId:player_id,serverId:server_id||undefined},appChannel:false})});
    const gateway=await gatewayRes.json().catch(()=>({}));
    if(!gatewayRes.ok||!gateway.formUrl||!gateway.paymentId){await supabase.from("orders").update({payment_status:"rejected",status:"cancelled",fulfillment_status:"failed",notes:"QiCard payment initialization failed"}).eq("id",order.id);return response({error:"تعذر إنشاء جلسة الدفع الآمنة",gateway_code:gateway?.error?.code||null},502);}
    await supabase.from("orders").update({gateway_payment_id:String(gateway.paymentId),payment_url:String(gateway.formUrl)}).eq("id",order.id);
    return response({ok:true,order_number:orderNumber,payment_id:gateway.paymentId,form_url:gateway.formUrl},201);
  }catch(e){console.error(e);return response({error:"Invalid request"},400)}
});