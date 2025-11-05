const env=document.querySelector('.envelope');const overlay=document.getElementById('envelopeOverlay');
const garden=document.getElementById('garden');const music=document.getElementById('bgMusic');const confetti=document.getElementById('confetti');
const message=document.getElementById('message');
function createGarden(){for(let i=0;i<12;i++){const f=document.createElement('div');f.className='flower';
const s=document.createElement('div');s.className='stem';f.appendChild(s);garden.appendChild(f);
setTimeout(()=>s.style.height='300px',i*150);}}
function burstConfettiHearts(x,y,count=28){for(let i=0;i<count;i++){const c=document.createElement('div');c.className='confettiHeart';
confetti.appendChild(c);const ox=(Math.random()-0.5)*120;const oy=(Math.random()-0.5)*40;c.style.left=(x+ox)+'px';c.style.top=(y+oy)+'px';
c.style.animation='confettiFloat 1.5s linear forwards';setTimeout(()=>c.remove(),1500);}};
function start(){if(window.started)return;window.started=true;env.classList.add('open');const rect=env.getBoundingClientRect();
burstConfettiHearts(rect.left+rect.width/2,rect.top+rect.height/2,36);
setTimeout(()=>overlay.remove(),600);createGarden();setTimeout(()=>garden.style.opacity=1,300);music.play().catch(()=>{});
setTimeout(()=>message.style.opacity=1,3800);}overlay.addEventListener('click',start);
document.body.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')start();});
