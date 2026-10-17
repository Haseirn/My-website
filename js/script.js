// Shared JavaScript for Velaire site (loaded on every page)

// Sample data used across pages
const VE_EVENTS = [
  {title:'Spring Runway — Paris', date:'2026-11-10T19:00:00', location:'Paris, FR'},
  {title:'Exclusive Pop-up — New York', date:'2026-12-05T11:00:00', location:'New York, US'},
  {title:'Private Viewing — Tokyo', date:'2027-01-20T18:00:00', location:'Tokyo, JP'}
];

const PRODUCTS = [
  {id:1,title:'Satin Evening Gown',category:'women',price:'$680',img:'https://via.placeholder.com/600x400?text=Satin+Gown'},
  {id:2,title:'Tailored Blazer',category:'men',price:'$420',img:'https://via.placeholder.com/600x400?text=Blazer'},
  {id:3,title:'Leather Clutch',category:'accessories',price:'$180',img:'https://via.placeholder.com/600x400?text=Clutch'},
  {id:4,title:'Asymmetric Dress',category:'women',price:'$520',img:'https://via.placeholder.com/600x400?text=Asymmetric+Dress'},
  {id:5,title:'Wool Overcoat',category:'men',price:'$760',img:'https://via.placeholder.com/600x400?text=Overcoat'}
];

const TRUSTEES = [
  {name:'Ava Laurent',role:'Creative Director',img:'https://via.placeholder.com/400x400?text=Ava+Laurent'},
  {name:'Marco Sato',role:'Head of Tailoring',img:'https://via.placeholder.com/400x400?text=Marco+Sato'},
  {name:'Nia Okoro',role:'Sustainability Lead',img:'https://via.placeholder.com/400x400?text=Nia+Okoro'},
  {name:'Luca Romano',role:'Business Director',img:'https://via.placeholder.com/400x400?text=Luca+Romano'}
];

// Utility to format date
function formatDateShort(d){return new Date(d).toLocaleString();}

// Initialize marquee content
function initMarquee(){
  const el = document.getElementById('global-marquee');
  if(!el) return;
  const texts = VE_EVENTS.map(e=>`${e.title} — ${new Date(e.date).toLocaleDateString()} in ${e.location}`).join('  •  ');
  el.textContent = texts + '  •  Discover our latest collections at Velaire';
}

// Highlight nav link
function highlightNav(){
  const links = document.querySelectorAll('.nav a');
  links.forEach(a=>{
    if(a.href === location.origin + location.pathname){
      a.classList.add('active');
    }
  });
}

// Footer year
function setYear(){document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());}

// Home: render a few featured products
function renderHomeProducts(){
  const el = document.getElementById('home-products');
  if(!el) return;
  const items = PRODUCTS.slice(0,3);
  el.innerHTML = items.map(p=>`<article class="product"><img src="${p.img}" alt="${p.title}"><h4>${p.title}</h4><p>${p.price}</p></article>`).join('');
}

// Products page: render all and filter
function renderProducts(){
  const list = document.getElementById('product-list');
  if(!list) return;
  const filter = document.getElementById('product-filter');
  function draw(category){
    const items = PRODUCTS.filter(p=>category==='all' || p.category===category);
    list.innerHTML = items.map(p=>`<article class="product"><img src="${p.img}" alt="${p.title}"><h4>${p.title}</h4><p>${p.price}</p></article>`).join('');
  }
  filter && filter.addEventListener('change', ()=>draw(filter.value));
  draw('all');
}

// Trustees page: render trustees and modal
function renderTrustees(){
  const list = document.getElementById('trustees-list');
  if(!list) return;
  list.innerHTML = TRUSTEES.map((t,i)=>`<article class="trustee" data-index="${i}"><img src="${t.img}" alt="${t.name}"><h4>${t.name}</h4><p>${t.role}</p></article>`).join('');
  list.addEventListener('click', e=>{
    const card = e.target.closest('.trustee');
    if(!card) return;
    const data = TRUSTEES[Number(card.dataset.index)];
    const modal = document.getElementById('photo-modal');
    document.getElementById('modal-image').src = data.img;
    document.getElementById('modal-name').textContent = data.name;
    document.getElementById('modal-role').textContent = data.role;
    modal.setAttribute('aria-hidden','false');
  });
  document.getElementById('modal-close').addEventListener('click', ()=>document.getElementById('photo-modal').setAttribute('aria-hidden','true'));
}

// Events page: render events and countdown
function renderEvents(){
  const el = document.getElementById('events-list');
  if(!el) return;
  el.innerHTML = VE_EVENTS.map((ev,i)=>`<div class="event"><h4>${ev.title}</h4><div>${formatDateShort(ev.date)}</div><div>${ev.location}</div></div>`).join('');

  // countdown to next event
  const next = VE_EVENTS.reduce((a,b)=>new Date(a.date)<new Date(b.date)?a:b);
  const cd = document.getElementById('countdown');
  if(!cd) return;
  function tick(){
    const diff = new Date(next.date) - new Date();
    if(diff<=0){cd.textContent = 'Event is live or has passed';return}
    const days = Math.floor(diff/86400000);
    const hours = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    cd.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
  }
  tick();
  setInterval(tick,1000);
}

// Inquiries and appointments: simple client-side storage and validation
function initForms(){
  const inquiryForm = document.getElementById('inquiry-form');
  inquiryForm && inquiryForm.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(inquiryForm);
    const entry = {name:fd.get('name'),email:fd.get('email'),message:fd.get('message'),time:new Date().toISOString()};
    const arr = JSON.parse(localStorage.getItem('inquiries')||'[]');
    arr.push(entry); localStorage.setItem('inquiries',JSON.stringify(arr));
    document.getElementById('inquiry-result').textContent = 'Inquiry sent. Thank you!';
    inquiryForm.reset();
  });

  const apptForm = document.getElementById('appointment-form');
  apptForm && apptForm.addEventListener('submit', e=>{
    e.preventDefault();
    const fd = new FormData(apptForm);
    const entry = {fullname:fd.get('fullname'),email:fd.get('email'),datetime:fd.get('datetime'),notes:fd.get('notes'),time:new Date().toISOString()};
    if(new Date(entry.datetime) < new Date()){
      document.getElementById('appt-result').textContent = 'Please pick a future date/time.';return
    }
    const arr = JSON.parse(localStorage.getItem('appointments')||'[]');
    arr.push(entry); localStorage.setItem('appointments',JSON.stringify(arr));
    document.getElementById('appt-result').textContent = 'Appointment requested. We will contact you to confirm.';
    apptForm.reset();
  });
}

// Boot
document.addEventListener('DOMContentLoaded', ()=>{
  setYear();
  initMarquee();
  highlightNav();
  renderHomeProducts();
  renderProducts();
  renderTrustees();
  renderEvents();
  initForms();
});
