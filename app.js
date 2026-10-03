const modal=document.getElementById('authModal');
const authTitle=document.getElementById('authTitle');

function openAuth(title='تسجيل الدخول'){
  if(!modal)return;
  if(authTitle)authTitle.textContent=title;
  modal.classList.add('open');
}
document.getElementById('loginBtn')?.addEventListener('click',()=>openAuth('تسجيل الدخول'));
document.getElementById('signupBtn')?.addEventListener('click',()=>openAuth('إنشاء حساب'));
document.querySelector('[data-close]')?.addEventListener('click',()=>modal?.classList.remove('open'));
modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal?.classList.remove('open')});

const searchBtn=document.getElementById('searchBtn');
searchBtn?.addEventListener('click',()=>{
  const query=window.prompt('ابحث عن لعبة أو خدمة');
  if(!query)return;
  const cards=[...document.querySelectorAll('.game-card')];
  const q=query.trim().toLowerCase();
  let found=0;
  cards.forEach(card=>{
    const match=card.textContent.toLowerCase().includes(q);
    card.style.display=match?'':'none';
    if(match)found++;
  });
  document.getElementById('games')?.scrollIntoView({behavior:'smooth'});
  if(!found)window.alert('ما لكينا لعبة مطابقة حالياً.');
});

document.querySelectorAll('.nav a[href^="#"]').forEach(link=>{
  link.addEventListener('click',()=>{
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('active'));
    link.classList.add('active');
  });
});

const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.08}):null;

document.querySelectorAll('.game-card,.service,.reward,.promo,.iraq-banner').forEach(el=>{
  el.classList.add('reveal');
  revealObserver?.observe(el);
});

if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
