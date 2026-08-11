// ---------- Mobile nav toggle ----------
(function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(!toggle || !links) return;
  toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('open'); });
  });
})();

// ---------- Particle starfield ----------
(function(){
  var canvas = document.getElementById('particle-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles = [];
  var W, H;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var count = Math.min(90, Math.floor((W * H) / 22000));
  for(var i=0;i<count;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.4 + 0.4,
      vx: (Math.random()-0.5)*0.15,
      vy: (Math.random()-0.5)*0.15,
      a: Math.random()*0.6 + 0.2
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = 'rgba(179,97,255,0.7)';
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      if(!reduceMotion){
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
        if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
      }
    }
    ctx.globalAlpha = 1;
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Typewriter ----------
function initTypewriter(elId, strings, opts){
  var el = document.getElementById(elId);
  if(!el) return;
  opts = opts || {};
  var typeSpeed = opts.typeSpeed || 70;
  var deleteSpeed = opts.deleteSpeed || 40;
  var pause = opts.pause || 1400;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(reduceMotion){
    el.textContent = strings[0];
    return;
  }

  var textSpan = document.createElement('span');
  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.innerHTML = '&nbsp;';
  el.appendChild(textSpan);
  el.appendChild(cursor);

  var si = 0, ci = 0, deleting = false;

  function tick(){
    var full = strings[si];
    if(!deleting){
      ci++;
      textSpan.textContent = full.slice(0, ci);
      if(ci === full.length){
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      ci--;
      textSpan.textContent = full.slice(0, ci);
      if(ci === 0){
        deleting = false;
        si = (si + 1) % strings.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }
  tick();
}
