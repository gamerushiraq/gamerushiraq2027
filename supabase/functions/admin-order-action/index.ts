import { createClient } from "jsr:@supabase/supabase-js@2";
const SUPABASE_URL=Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase=createClient(SUPABASE_URL,SERVICE_KEY);
const ADMIN_EMAIL="ibogoeed@gmail.com";
const ALLOWED_STATUS=new Set(["new","processing","completed","cancelled"]);
const ALLOWED_PAYMENT=new Set(["pending","submitted","verified","rejected"]);
const WORKER_URL=`${SUPABASE_URL}/functions/v1/fulfillment-worker`;
async function wakeFulfillmentWorker(){
 try{
  const res=await fetch(WORKER_URL,{method:"POST",headers:{"Authorization":`Bearer ${SERVICE_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({trigger:"admin-payment-verified"})});
  if(!res.ok){console.error("fulfillment-worker wake failed",res.status);return false;}
  return true;
 }catch(error){console.error("fulfillment-worker wake error",error);return false;}
}
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"https://gamerushiraq.github.io","Access-Control-Allow-Headers":"content-type, authorization","Access-Control-Allow-Methods":"POST, OPTIONS"}})}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return json({ok:true});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 try{
  const auth=req.headers.get("authorization")||"";
  if(!auth.toLowerCase().startsWith("bearer "))return json({error:"Authentication required"},401);
  const {data:{user},error}=await supabase.auth.getUser(auth.slice(7).trim());
  if(error||!user)return json({error:"Invalid or expired session"},401);
  if(String(user.email||"").toLowerCase()!==ADMIN_EMAIL)return json({error:"Admin access required"},403);
  const body=await req.json();
  const id=String(body.id||"").trim();
  const action=String(body.action||"").trim();
  if(!id)return json({error:"Order id required"},400);
  const {data:order,error:orderError}=await supabase.from("orders").select("id,payment_status,status,fulfillment_status,player_id,server_id").eq("id",id).maybeSingle();
  if(orderError)return json({error:"Could not load order"},500);
  if(!order)return json({error:"Order not found"},404);
  if(action==="payment"){
   const payment_status=String(body.payment_status||"");
   if(!ALLOWED_PAYMENT.has(payment_status))return json({error:"Invalid payment status"},400);
   if(payment_status==="verified"){
    const {data:job}=await supabase.from("fulfillment_jobs").select("id,status").eq("order_id",id).maybeSingle();
    if(!job){
      const {error:e}=await supabase.from("fulfillment_jobs").insert({order_id:id,provider:null,provider_product:null,player_id:order.player_id,server_id:order.server_id,status:"queued",attempts:0,next_attempt_at:new Date().toISOString(),last_error:null});
      if(e)return json({error:"Could not queue fulfillment"},500);
    }else if(["failed","cancelled"].includes(job.status)){
      await supabase.from("fulfillment_jobs").update({status:"queued",next_attempt_at:new Date().toISOString(),locked_at:null,last_error:null,updated_at:new Date().toISOString()}).eq("id",job.id);
    }
    const {error:e}=await supabase.from("orders").update({payment_status:"verified",status:"processing",fulfillment_status:"queued",updated_at:new Date().toISOString()}).eq("id",id);
    if(e)return json({error:"Could not update order"},500);
    const workerWakeRequested=await wakeFulfillmentWorker();
    return json({ok:true,payment_status:"verified",status:"processing",fulfillment_status:"queued",worker_wake_requested:workerWakeRequested});
   }
   const nextStatus=payment_status==="rejected"?"cancelled":order.status;
   const nextFulfillment=payment_status==="rejected"?"failed":order.fulfillment_status;
   const {error:e}=await supabase.from("orders").update({payment_status,status:nextStatus,fulfillment_status:nextFulfillment,updated_at:new Date().toISOString()}).eq("id",id);
   if(e)return json({error:"Could not update order"},500);
   return json({ok:true,payment_status,status:nextStatus,fulfillment_status:nextFulfillment});
  }
  if(action==="status"){
   const status=String(body.status||"");
   if(!ALLOWED_STATUS.has(status))return json({error:"Invalid order status"},400);
   const {error:e}=await supabase.from("orders").update({status,updated_at:new Date().toISOString()}).eq("id",id);
   if(e)return json({error:"Could not update order"},500);
   return json({ok:true,status});
  }
  return json({error:"Unknown action"},400);
 }catch(e){console.error(e);return json({error:"Invalid request"},400)}
});