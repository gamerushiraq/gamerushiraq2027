import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase=createClient(SUPABASE_URL,SERVICE_KEY);
const allowedOrigin="https://gamerushiraq.github.io";

function response(body:unknown,status=200){
 return new Response(JSON.stringify(body),{status,headers:{
  "Content-Type":"application/json","Access-Control-Allow-Origin":allowedOrigin,
  "Access-Control-Allow-Headers":"content-type, authorization","Access-Control-Allow-Methods":"POST, OPTIONS"
 }});
}
async function sha256(value:string){const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest("SHA-256",data);return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");}
function clientIp(req:Request){return req.headers.get("cf-connecting-ip")?.trim()||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"";}

Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return response({ok:true});
 if(req.method!=="POST")return response({error:"Method not allowed"},405);
 const origin=req.headers.get("origin"); if(origin&&origin!==allowedOrigin)return response({error:"Origin not allowed"},403);
 try{
  const body=await req.json();
  const order_number=String(body.order_number??"").trim().toUpperCase();
  const game=String(body.game??"").trim().toLowerCase();
  const package_name=String(body.package_name??"").trim();
  const player_id=String(body.player_id??"").trim();
  const server_id=body.server_id?String(body.server_id).trim():null;
  const price_iqd=Number(body.price_iqd);
  const payment_method=body.payment_method?String(body.payment_method).trim():null;
  const payment_reference=body.payment_reference?String(body.payment_reference).trim():null;
  const customer_phone=body.customer_phone?String(body.customer_phone).trim():null;
  const notes=body.notes?String(body.notes).trim():null;
  const vip_code=body.vip_code?String(body.vip_code).trim().toUpperCase():null;

  const auth=req.headers.get("authorization");
  if(!auth?.toLowerCase().startsWith("bearer "))return response({error:"Authentication required"},401);
  const token=auth.slice(7).trim();
  if(!token)return response({error:"Authentication required"},401);
  const {data:{user},error:authError}=await supabase.auth.getUser(token);
  if(authError||!user)return response({error:"Invalid or expired session"},401);
  const user_id=user.id;

  if(!/^GR-[A-Z0-9]{8}$/.test(order_number))return response({error:"Invalid order number"},400);
  if(!game||!package_name)return response({error:"Invalid game or package"},400);
  const {data:pkg,error:pkgError}=await supabase.from("game_packages").select("package_name,price_iqd").eq("game_slug",game).eq("package_name",package_name).eq("active",true).maybeSingle();
  if(pkgError)return response({error:"Could not validate package"},500);
  if(!pkg)return response({error:"Invalid game or package"},400);
  const basePrice=Number(pkg.price_iqd);
  if(!Number.isFinite(basePrice))return response({error:"Invalid package price"},400);
  let vipRedemptionId:string|null=null;
  let vipDiscount=0;
  if(vip_code){
    const {data:vr,error:vrError}=await supabase.from("loyalty_redemptions").select("id,status,user_id,reward:loyalty_rewards(title,reward_type,reward_value,active)").eq("code",vip_code).eq("user_id",user_id).eq("status","pending").maybeSingle();
    if(vrError)return response({error:"Could not validate VIP code"},500);
    if(!vr)return response({error:"Invalid or already used VIP code"},400);
    const reward=Array.isArray(vr.reward)?vr.reward[0]:vr.reward;
    if(!reward?.active||reward.reward_type!=="coupon")return response({error:"This VIP code cannot be used for checkout"},400);
    vipRedemptionId=vr.id; vipDiscount=Math.max(0,Number(reward.reward_value||0));
  }
  const now=new Date().toISOString();
  const {data:promos,error:promoError}=await supabase.from("promotions").select("discount_iqd").eq("game",game).eq("active",true).lte("starts_at",now).gt("ends_at",now).or("package_name.is.null,package_name.eq."+package_name).order("discount_iqd",{ascending:false}).limit(1);
  if(promoError)return response({error:"Could not validate promotion"},500);
  const discount=promos?.[0]?Math.max(0,Number(promos[0].discount_iqd||0)):0;
  const expectedPrice=Math.max(0,basePrice-discount-vipDiscount);
  if(!Number.isFinite(price_iqd)||price_iqd!==expectedPrice)return response({error:"Invalid package price"},400);
  const {data:gameRow,error:gameError}=await supabase.from("game_catalog").select("slug").eq("slug",game).eq("active",true).maybeSingle();
  if(gameError)return response({error:"Could not validate game"},500);
  if(!gameRow)return response({error:"Invalid game"},400);
  if(!player_id||player_id.length>64)return response({error:"Invalid Player ID"},400);
  if(server_id&&server_id.length>32)return response({error:"Invalid Server ID"},400);
  if(!payment_method)return response({error:"Unsupported payment method"},400);
  const {data:paymentRow,error:paymentError}=await supabase.from("payment_methods").select("code").eq("code",payment_method).eq("active",true).maybeSingle();
  if(paymentError)return response({error:"Could not validate payment method"},500);
  if(!paymentRow)return response({error:"Unsupported payment method"},400);
  if(!payment_reference||payment_reference.length<2||payment_reference.length>120)return response({error:"Invalid payment reference"},400);
  const phoneDigits=customer_phone.replace(/\D/g,"").replace(/^00964/,"").replace(/^964/,"").replace(/^0/,"");
  if(!/^7[3-9][0-9]{8}$/.test(phoneDigits))return response({error:"Invalid customer phone"},400);
  const normalizedPhone="+964"+phoneDigits;
  if(notes&&notes.length>500)return response({error:"Notes too long"},400);

  const ip=clientIp(req);
  const ipKey=ip?"ip:"+await sha256(SERVICE_KEY+":"+ip):"";
  const phoneKey="phone:"+await sha256(SERVICE_KEY+":"+phoneDigits);
  const playerKey="player:"+await sha256(SERVICE_KEY+":"+game+":"+player_id);
  if(ipKey){const {data:ok,error}=await supabase.rpc("consume_order_rate_limit",{p_rate_key:ipKey,p_limit:10,p_window_seconds:600});if(error||ok!==true)return response({error:"Too many order attempts. Try again later."},429);}
  const {data:phoneOk,error:phoneError}=await supabase.rpc("consume_order_rate_limit",{p_rate_key:phoneKey,p_limit:5,p_window_seconds:600});if(phoneError||phoneOk!==true)return response({error:"Too many order attempts for this phone. Try again later."},429);
  const {data:playerOk,error:playerError}=await supabase.rpc("consume_order_rate_limit",{p_rate_key:playerKey,p_limit:5,p_window_seconds:600});if(playerError||playerOk!==true)return response({error:"Too many order attempts for this player. Try again later."},429);

  const {data:dup,error:dupError}=await supabase.from("orders").select("id").eq("payment_reference",payment_reference).limit(1);
  if(dupError)return response({error:"Could not validate payment reference"},500);
  if(dup?.length)return response({error:"Payment reference already used"},409);

  const {error}=await supabase.from("orders").insert({
   user_id,order_number,game,package_name,player_id,server_id,price_iqd,status:"new",
   payment_method,payment_reference,customer_phone:normalizedPhone,notes,payment_status:"submitted",vip_redemption_id:vipRedemptionId
  });
  if(error){if(error.code==="23505")return response({error:"Duplicate order or payment reference"},409);console.error(error);return response({error:"Could not create order"},500);}
  if(vipRedemptionId){const {error:redeemError}=await supabase.from("loyalty_redemptions").update({status:"fulfilled",order_id:(await supabase.from("orders").select("id").eq("order_number",order_number).single()).data?.id}).eq("id",vipRedemptionId).eq("user_id",user_id).eq("status","pending");if(redeemError)console.error("VIP redemption finalization failed",redeemError);}
  return response({ok:true,order_number,payment_status:"submitted",account_linked:!!user_id},201);
 }catch(error){console.error(error);return response({error:"Invalid request"},400);}
});