(()=>{
  'use strict';
  const ONLINE=new Set(['qicard_card','superqi']);
  const $=id=>document.getElementById(id);
  function sync(){
    const method=$('paymentMethod')?.value||'';
    const online=ONLINE.has(method);
    const ref=document.querySelector('.payment-ref-field');
    const accounts=$('paymentAccounts');
    const hint=$('paymentHint');
    if(ref) ref.hidden=online;
    if(accounts) accounts.hidden=online||!method;
    if(hint){
      if(method==='qicard_card') hint.textContent='② راح تنتقل إلى صفحة الدفع الآمنة لإدخال بيانات البطاقة وإكمال التحقق البنكي.';
      else if(method==='superqi') hint.textContent='② راح تنتقل إلى صفحة الدفع الآمنة لإكمال العملية.';
      else if(method) hint.textContent='② استخدم بيانات التحويل الظاهرة ثم أدخل رقم العملية للتحقق.';
      else hint.textContent='① اختار طريقة الدفع.';
    }
    const btn=$('orderBtn');
    if(btn) btn.textContent=online?'الدفع الآمن وإكمال الطلب ←':'تأكيد التحويل وإرسال الطلب ←';
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('paymentMethod')?.addEventListener('change',sync);
    sync();
  });
})();
