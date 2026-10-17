/* Portafolio Christian Ayala | Interacciones accesibles y sin dependencias. */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],root=document.documentElement;

// Tema claro / oscuro
const tb=$('#th');
function setTheme(t){const d=t==='dark';root.dataset.theme=d?'dark':'light';$('#ti').textContent=d?'☀':'☾';tb.setAttribute('aria-label',d?'Cambiar a tema claro':'Cambiar a tema oscuro');try{localStorage.setItem('christian-ayala-theme',d?'dark':'light')}catch(_){}}
let saved=null;try{saved=localStorage.getItem('christian-ayala-theme')}catch(_){}
setTheme(saved==='dark'?'dark':'light');
tb.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));

// Menú móvil
const nav=$('#nav'),mb=$('#mb');
function closeMenu(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Abrir menú de navegación');$('#mi').textContent='☰'}
mb.addEventListener('click',()=>{const o=!nav.classList.contains('open');nav.classList.toggle('open',o);mb.setAttribute('aria-expanded',String(o));mb.setAttribute('aria-label',o?'Cerrar menú de navegación':'Abrir menú de navegación');$('#mi').textContent=o?'×':'☰'});
$$('.nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!e.target.closest('.hd'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// Filtros y búsqueda
const cards=$$('.pc'),fbs=$$('.fb'),q=$('#q');let f='todos';
const norm=s=>s.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function upd(){const v=norm(q.value);let n=0;
 cards.forEach(c=>{const ok=(f==='todos'||c.dataset.c===f)&&(!v||norm(c.textContent+' '+c.dataset.k).includes(v));c.hidden=!ok;if(ok)n++});
 $('#es').hidden=n>0;$('#rs').hidden=f==='todos'&&!v;
 $('#rc').textContent=`Mostrando ${n} ${n===1?'trabajo':'trabajos'}`;
 fbs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===f)))}
fbs.forEach(b=>b.addEventListener('click',()=>{f=b.dataset.f;upd()}));
q.addEventListener('input',upd);
function reset(){f='todos';q.value='';upd()}
$('#rs').addEventListener('click',reset);$('#er').addEventListener('click',reset);

// Detalles de cada trabajo
const D={
 segmentacion:{t:'Segmentación semántica de imágenes',s:'Trabajo de inteligencia artificial para identificar objetos en imágenes a partir de un modelo de segmentación semántica.',p:['Creación y entrenamiento de un modelo de segmentación semántica.','Aplicación de técnicas de preprocesamiento de imágenes.','Optimización del modelo para mejorar la identificación de objetos.']},
 bases:{t:'Creación y manejo de bases de datos',s:'Experiencia de diseño y organización de datos en el contexto de la Escuela Politécnica Nacional.',p:['Elaboración de modelos lógicos y físicos de datos.','Implementación de consultas en SQL.','Optimización de estructuras para el almacenamiento eficiente de información.']},
 ludolab:{t:'Proyecto de inclusión digital · LudoLab',s:'Participación como instructor en un proyecto orientado a reducir la brecha digital.',p:['Capacitación en herramientas tecnológicas esenciales.','Acompañamiento a grupos en situación de vulnerabilidad.','Promoción del acceso y uso de tecnologías digitales.']}
};
const dlg=$('#dlg');let trg=null;
$$('.po').forEach(b=>b.addEventListener('click',()=>{
 const d=D[b.dataset.p];if(!d||typeof dlg.showModal!=='function')return;trg=b;
 $('#dt2').textContent=d.t;$('#dd').textContent=d.s;
 $('#dp').replaceChildren(...d.p.map(x=>{const li=document.createElement('li');li.textContent=x;return li}));
 dlg.showModal()}));
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>{if(trg&&!trg.closest('[hidden]'))trg.focus()});

// Animación de títulos: cada letra sube desde una máscara
function split(el,step){let i=0;el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
 const walk=n=>[...n.childNodes].forEach(c=>{
  if(c.nodeType===3){const f=document.createDocumentFragment();
   c.textContent.split(/(\s+)/).forEach(x=>{if(!x)return;if(!x.trim()){f.append(' ');return}
    const w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
    for(const ch of x){const s=document.createElement('span');s.className='c';s.textContent=ch;s.style.setProperty('--d',(i++*step)+'ms');w.append(s)}
    f.append(w)});c.replaceWith(f)}
  else if(c.nodeType===1)walk(c)});
 walk(el);el.classList.add('rt')}
if(root.classList.contains('js')){
 const hero=$('.hero'),h1=$('.hero h1');
 split(h1,45);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{hero.classList.add('go');h1.classList.add('in');setTimeout(()=>h1.classList.add('done'),2300)}));
 const hs=$$('.sh h2,.ct h3');hs.forEach(h=>split(h,22));
 if('IntersectionObserver' in window){
  const ho=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');setTimeout(()=>e.target.classList.add('done'),1900);ho.unobserve(e.target)}),{threshold:.5});
  hs.forEach(h=>ho.observe(h));
 }else hs.forEach(h=>h.classList.add('in','done'));
 // El retrato se inclina siguiendo el cursor
 if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){const pt=$('.pt');
  pt.addEventListener('pointermove',e=>{const r=pt.getBoundingClientRect();
   pt.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*6).toFixed(1)+'deg');
   pt.style.setProperty('--rx',(-((e.clientY-r.top)/r.height-.5)*5).toFixed(1)+'deg')});
  pt.addEventListener('pointerleave',()=>{pt.style.setProperty('--ry','0deg');pt.style.setProperty('--rx','0deg')})}
}

// Progreso de lectura y sección activa
const bar=$('#bar');
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;bar.style.width=(m>0?Math.min(100,scrollY/m*100):0)+'%'},{passive:true});
addEventListener('resize',()=>{if(innerWidth>900)closeMenu()});
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  $$('.nav a').forEach(a=>{const on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('on',on);on?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current')})}),{rootMargin:'-20% 0px -68% 0px'});
 $$('main section[id]').forEach(s=>io.observe(s));
}
})();
