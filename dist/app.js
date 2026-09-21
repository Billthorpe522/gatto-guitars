const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menuButton.focus();}});
const main=document.querySelector('#gallery-main');
const thumbs=[...document.querySelectorAll('[data-photo]')];
const modal=document.querySelector('.lightbox');
let selected=0;
function select(index){if(!thumbs.length)return;selected=(index+thumbs.length)%thumbs.length;const t=thumbs[selected];main.src=t.dataset.photo;main.alt=t.dataset.alt;thumbs.forEach((x,i)=>x.setAttribute('aria-pressed',String(i===selected)));const counter=`${String(selected+1).padStart(2,'0')} / ${String(thumbs.length).padStart(2,'0')}`;document.querySelector('#gallery-counter').textContent=counter;if(modal){document.querySelector('#zoom-image').src=t.dataset.photo;document.querySelector('#zoom-image').alt=t.dataset.alt;document.querySelector('#lightbox-count').textContent=counter;}}
thumbs.forEach((t,i)=>t.addEventListener('click',()=>select(i)));
document.querySelector('[data-zoom]')?.addEventListener('click',()=>{select(selected);modal.showModal();document.body.style.overflow='hidden';});
document.querySelector('[data-close]')?.addEventListener('click',()=>modal.close());
modal?.addEventListener('close',()=>{document.body.style.overflow='';});
modal?.addEventListener('click',e=>{if(e.target===modal)modal.close();});
document.querySelector('[data-prev]')?.addEventListener('click',()=>select(selected-1));
document.querySelector('[data-next]')?.addEventListener('click',()=>select(selected+1));
modal?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();select(selected+1);}if(e.key==='ArrowLeft'){e.preventDefault();select(selected-1);}});
