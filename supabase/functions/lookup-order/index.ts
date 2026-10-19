import { createClient } from "jsr:@supabase/supabase-js@2";
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase=createClient(Deno.env.get("SUPABASE_URL")!,SERVICE_KEY);
async function sha256(value:string){const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest("SHA-256",data);return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");}
function clientIp(req:Request){return req.headers.get("cf-connecting-ip")?.trim()||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"";}
const allowedOrigin="https://gamerushiraq.github.io";
function response(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":allowedOrigin,"Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS"}})}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return response({ok:true});
 if(req.method!=="POST")return response({error:"Method not allowed"},405);
 const origin=req.headers.get("origin"); if(origin&&origin!==allowedOrigin)return response({error:"Origin not allowed"},403);
 try{
  const body=await req.json(); const order_number=String(body.order_number??"").trim().toUpperCase();
  if(!/^GR-[A-Z0-9]{8}(?:[A-Z0-9]{8})?$/.test(order_number))return response({error:"رقم الطلب غير صحيح"},400);
  const ip=clientIp(req); if(ip){const key="lookup:"+await sha256(SERVICE_KEY+":"+ip);const {data:ok,error:rlError}=await supabase.rpc("consume_order_rate_limit",{p_rate_key:key,p_limit:30,p_window_seconds:600});if(rlError||ok!==true)return response({error:"طلبات التتبع كثيرة. حاول بعد قليل."},429);}
  const {data,error}=await supabase.from("orders").select("id,order_number,game,package_name,price_iqd,status,payment_status,fulfillment_status,created_at,updated_at").eq("order_number",order_number).maybeSingle();
  if(error){console.error(error);return response({error:"تعذر البحث عن الطلب"},500)}
  if(!data)return response({error:"لم يتم العثور على الطلب"},404);
  const {data:history,error:historyError}=await supabase.from("order_status_history").select("status,payment_status,created_at").eq("order_id",data.id).order("created_at",{ascending:true});
  if(historyError){console.error(historyError);return response({error:"تعذر تحميل سجل الطلب"},500)}
  return response({ok:true,order:{order_number:data.order_number,game:data.game,package_name:data.package_name,price_iqd:data.price_iqd,status:data.status,payment_status:data.payment_status,fulfillment_status:data.fulfillment_status,created_at:data.created_at,updated_at:data.updated_at,history:(history??[]).map(({status,payment_status,created_at})=>({status,payment_status,created_at}))}});
 }catch{return response({error:"Invalid request"},400)}
});