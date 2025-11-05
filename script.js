
const garden = document.getElementById("garden");
const message = document.getElementById("message");
const tap = document.getElementById("tapScreen");
const music = document.getElementById("bgMusic");
const petalsLayer = document.getElementById("petals");
const butterfliesLayer = document.getElementById("butterflies");
const heartsLayer = document.getElementById("hearts");

function createGarden() {
  for(let i = 0; i < 14; i++){
    const flower = document.createElement("div");
    flower.classList.add("flower");
    // set random stem height variable for each flower
    const stem = document.createElement("div");
    stem.classList.add("stem");
    // randomize final stem height slightly
    const h = 260 + Math.floor(Math.random()*90); // 260-350
    stem.style.setProperty('--final-height', h + 'px');
    // set CSS variable for petal position
    flower.style.setProperty('--stem-height', h + 'px');
    flower.appendChild(stem);

    // add layered petals
    const p1 = document.createElement('div'); p1.className='petal layer1';
    const p2 = document.createElement('div'); p2.className='petal layer2';
    const p3 = document.createElement('div'); p3.className='petal layer3';
    const p4 = document.createElement('div'); p4.className='petal layer4';
    const pc = document.createElement('div'); pc.className='petal center';
    flower.appendChild(p1); flower.appendChild(p2); flower.appendChild(p3); flower.appendChild(p4); flower.appendChild(pc);

    garden.appendChild(flower);

    // stagger stem animation delays via inline style
    const delay = i * 180;
    stem.style.animationDelay = (0 + delay) + 'ms';
    p1.style.animationDelay = (1600 + delay) + 'ms';
    p2.style.animationDelay = (1600 + delay) + 'ms';
    p3.style.animationDelay = (1600 + delay) + 'ms';
    p4.style.animationDelay = (1600 + delay) + 'ms';
    pc.style.animationDelay = (1800 + delay) + 'ms';

    // set the actual CSS animation target by setting height after tiny timeout
    setTimeout(()=>{ stem.style.height = h + 'px'; }, 50 + delay);
  }
}

function playButterfly(xStart, yStart, duration=12000) {
  // create butterfly element with soft wings
  const b = document.createElement('div');
  b.className = 'butterfly';
  const leftWing = document.createElement('div');
  leftWing.className = 'wing left';
  const rightWing = document.createElement('div');
  rightWing.className = 'wing right';
  b.appendChild(leftWing); b.appendChild(rightWing);
  butterfliesLayer.appendChild(b);

  // initial position
  const startX = xStart !== undefined ? xStart : -40;
  const startY = yStart !== undefined ? yStart : (window.innerHeight * 0.6 + (Math.random()*100 - 50));
  b.style.left = startX + 'px';
  b.style.top = startY + 'px';
  b.style.opacity = 0.95;

  // animate using JS for more natural path
  const endX = window.innerWidth + 60;
  const amplitudeY = 120 + Math.random()*80;
  const startTime = performance.now();
  const dur = duration + Math.random()*4000;

  function frame(now){
    const t = (now - startTime) / dur;
    if(t >= 1){
      b.remove();
      return;
    }
    // x moves from startX to endX
    const x = startX + (endX - startX) * t;
    // y follows a sine wave for gentle bobbing, offset by amplitude
    const y = startY - Math.sin(t * Math.PI * 2) * amplitudeY;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    // wing flutter using transform
    const wingAngle = Math.sin(t * Math.PI * 6) * 12; // faster flutter
    leftWing.style.transform = 'rotate(' + (-wingAngle) + 'deg)';
    rightWing.style.transform = 'rotate(' + wingAngle + 'deg)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function spawnButterflies() {
  // spawn at random intervals
  const count = 3 + Math.floor(Math.random()*3);
  for(let i=0;i<count;i++){
    const startY = window.innerHeight * (0.5 + Math.random()*0.3);
    const startX = -60 - Math.random()*200;
    playButterfly(startX, startY, 10000 + Math.random()*8000);
  }
  // schedule next spawn
  setTimeout(spawnButterflies, 4000 + Math.random()*3000);
}

function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petalFall");
  petal.style.left = Math.random() * window.innerWidth + "px";
  const size = Math.random() * 16 + 8;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.background = ['#ffd1dc','#f0d6ff','#eaf6ff'][Math.floor(Math.random()*3)];
  petalsLayer.appendChild(petal);
  setTimeout(() => petal.remove(), 6000);
}

function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.classList.add("sparkle");
  sparkle.style.left = Math.random() * window.innerWidth + "px";
  sparkle.style.top = Math.random() * window.innerHeight + "px";
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 3000);
}

function spawnHearts() {
  // soft floating hearts (style 1)
  const h = document.createElement('div');
  h.className = 'heartGlow';
  const left = 20 + Math.random()*60;
  h.style.left = left + '%';
  h.style.bottom = '40px';
  heartsLayer.appendChild(h);
  // random float duration
  const dur = 3800 + Math.random()*1600;
  h.style.animation = `heartFloat ${dur}ms linear forwards`;
  setTimeout(()=> h.remove(), dur + 200);
  // schedule next
  setTimeout(spawnHearts, 900 + Math.random()*900);
}

tap.addEventListener("click", startExperience);
tap.addEventListener("keydown", (e)=>{ if(e.key==='Enter' || e.key===' ') startExperience(); });

function startExperience(){
  if(window.started) return;
  window.started = true;
  // hide overlay
  tap.style.transition = 'opacity 400ms ease';
  tap.style.opacity = 0;
  setTimeout(()=> tap.remove(), 450);
  // build garden
  createGarden();
  // show garden
  setTimeout(()=>{ document.getElementById('garden').style.opacity = 1; }, 300);
  // play music
  try{ music.currentTime = 0; }catch(e){}
  music.play().catch(()=>{});
  // spawn petals and sparkles continuously
  setInterval(createPetal, 500);
  setInterval(createSparkle, 900);
  // launch butterflies loop and hearts loop
  spawnButterflies();
  spawnHearts();
  // reveal message after blooms finish
  setTimeout(()=>{
    const msg = document.getElementById('message');
    msg.style.opacity = 1;
  }, 3800);
}

// accessibility: allow space/enter on body too
document.body.addEventListener('keydown', (e)=>{ if(e.key===' '|| e.key==='Enter') startExperience(); });
