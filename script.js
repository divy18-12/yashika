
const garden = document.getElementById("garden");
const message = document.getElementById("message");
const music = document.getElementById("bgMusic");
const petalsLayer = document.getElementById("petals");
const butterfliesLayer = document.getElementById("butterflies");
const heartsLayer = document.getElementById("hearts");

function createGarden() {
  for(let i = 0; i < 14; i++) {
    const flower = document.createElement("div");
    flower.classList.add("flower");
    const stem = document.createElement("div");
    stem.classList.add("stem");
    const h = 280 + Math.floor(Math.random() * 120); // taller range for brighter look
    stem.style.height = '0px';
    flower.style.setProperty('--stem-height', h + 'px');
    flower.appendChild(stem);

    // layered petals
    const p1 = document.createElement('div'); p1.className = 'petal layer1';
    const p2 = document.createElement('div'); p2.className = 'petal layer2';
    const p3 = document.createElement('div'); p3.className = 'petal layer3';
    const p4 = document.createElement('div'); p4.className = 'petal layer4';
    const pc = document.createElement('div'); pc.className = 'petal center';
    flower.appendChild(p1); flower.appendChild(p2); flower.appendChild(p3); flower.appendChild(p4); flower.appendChild(pc);

    garden.appendChild(flower);

    const delay = i * 160;
    // animate stem height after staggered delay
    setTimeout(()=> { stem.style.height = h + 'px'; p1.style.animation = 'petalBloom 1s ease forwards ' + (1.6 + delay/1000) + 's'; p2.style.animation = 'petalBloom 1s ease forwards ' + (1.6 + delay/1000) + 's'; p3.style.animation = 'petalBloom 1s ease forwards ' + (1.6 + delay/1000) + 's'; p4.style.animation = 'petalBloom 1s ease forwards ' + (1.6 + delay/1000) + 's'; pc.style.animation = 'petalBloom 1s ease forwards ' + (1.8 + delay/1000) + 's'; }, 80 + delay);
  }
}

function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("petalFall");
  petal.style.left = Math.random() * window.innerWidth + "px";
  const size = Math.random() * 18 + 8;
  petal.style.width = size + "px";
  petal.style.height = size + "px";
  petal.style.background = ['#ffd1dc','#f0d6ff','#eaf6ff'][Math.floor(Math.random() * 3)];
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

function playButterfly(xStart, yStart, duration=12000){
  const b = document.createElement('div');
  b.className = 'butterfly';
  const leftWing = document.createElement('div'); leftWing.className = 'wing left';
  const rightWing = document.createElement('div'); rightWing.className = 'wing right';
  b.appendChild(leftWing); b.appendChild(rightWing);
  butterfliesLayer.appendChild(b);

  const startX = xStart !== undefined ? xStart : -60 - Math.random()*200;
  const startY = yStart !== undefined ? yStart : (window.innerHeight * (0.5 + Math.random()*0.3));
  b.style.left = startX + 'px'; b.style.top = startY + 'px';

  const endX = window.innerWidth + 80;
  const amplitudeY = 120 + Math.random()*100;
  const startTime = performance.now();
  const dur = duration + Math.random()*5000;

  function frame(now){
    const t = (now - startTime) / dur;
    if(t >= 1){ b.remove(); return; }
    const x = startX + (endX - startX) * t;
    const y = startY - Math.sin(t * Math.PI * 2) * amplitudeY;
    b.style.left = x + 'px'; b.style.top = y + 'px';
    const wingAngle = Math.sin(t * Math.PI * 6) * 12;
    leftWing.style.transform = 'rotate(' + (-wingAngle) + 'deg)';
    rightWing.style.transform = 'rotate(' + wingAngle + 'deg)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function spawnButterflies(){
  const count = 2 + Math.floor(Math.random()*3);
  for(let i=0;i<count;i++){
    playButterfly();
  }
  setTimeout(spawnButterflies, 3500 + Math.random()*3000);
}

function spawnHearts(){
  const h = document.createElement('div');
  h.className = 'heartGlow';
  const left = 20 + Math.random()*60;
  h.style.left = left + '%';
  h.style.bottom = '40px';
  heartsLayer.appendChild(h);
  const dur = 3800 + Math.random()*1600;
  h.style.animation = 'heartFloat ' + dur + 'ms linear forwards';
  setTimeout(()=> h.remove(), dur + 200);
  setTimeout(spawnHearts, 900 + Math.random()*900);
}

function startAuto(){
  if(window.started) return;
  window.started = true;
  // show garden
  createGarden();
  setTimeout(()=> document.getElementById('garden').style.opacity = 1, 200);
  // play music (some browsers require interaction; try autoplay, play on user gesture if blocked)
  try{ music.currentTime = 0; }catch(e){}
  music.play().catch(()=>{});
  // start petals and sparkles
  setInterval(createPetal, 500);
  setInterval(createSparkle, 900);
  // butterflies and hearts
  spawnButterflies();
  spawnHearts();
  // reveal message after blooms
  setTimeout(()=> document.getElementById('message').style.opacity = 1, 3600);
}

// start automatically once page loads (but browsers may block audio until interaction)
window.addEventListener('load', ()=>{
  // small timeout to ensure layout ready
  setTimeout(()=> startAuto(), 500);
});
