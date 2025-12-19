(() => {
  // Hobbies list (replaces workouts)
  const hobbyListEl = document.getElementById('hobbyList');
  const hobbies = [
    {id:1,title:'Running',desc:'Short and long runs to stay fit and clear the mind.'},
    {id:2,title:'Cycling',desc:'Weekend rides and interval training.'},
    {id:3,title:'Photography',desc:'Street and landscape photography—visual storytelling.'},
    {id:4,title:'Reading',desc:'Technical books and fiction to keep learning.'},
    {id:5,title:'Cooking',desc:'Experimenting with simple, healthy recipes.'}
  ];

  // Fake project data for a software developer
  let projects = [
    {id:1,title:'Personal Site',desc:'A responsive portfolio built with vanilla JS and modern CSS.',tech:['HTML','CSS','JS'],link:'#',code:`// simple init\nconsole.log('Hello world')`},
    {id:2,title:'Task API',desc:'Small REST API for todos with Node.js and Express.',tech:['Node.js','Express','MongoDB'],link:'#',code:`// GET /tasks\napp.get('/tasks', (req,res)=> res.json([]))`},
    {id:3,title:'Visualizer',desc:'Data visualization app using D3 and React.',tech:['React','D3'],link:'#',code:`// render chart\ncreateChart(data)`}
  ];

  function fmtDate(iso){
    const d = new Date(iso);
    return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
  }

  function renderHobbies(){
    if(!hobbyListEl) return;
    hobbyListEl.innerHTML = hobbies.map(h=>{
      const key = h.title.toLowerCase();
      return `
        <article class="hobby-card">
          <div class="hobby-head">${getIconFor(key)}<h3>${h.title}</h3></div>
          <p class="hobby-desc">${h.desc}</p>
        </article>
      `;
    }).join('');
  }

  function renderProjects(){
    const el = document.getElementById('projectList');
    if(!el) return;
    el.innerHTML = projects.map(p=>{
      return `
        <article class="project-card">
          <div class="project-head">${getIconFor('project')}<h3>${p.title}</h3></div>
          <p>${p.desc}</p>
          <div class="project-links">
            <a class="btn" href="${p.link}" target="_blank" rel="noopener">View</a>
            <button class="btn details-btn" data-id="${p.id}" type="button">Details</button>
            <div class="meta">${p.tech.join(' · ')}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Return an SVG <use> referencing the external sprite
  function getIconFor(key){
    // normalize keys for known icons
    const map = {
      'running':'running',
      'cycling':'cycling',
      'photography':'photography',
      'reading':'reading',
      'cooking':'cooking',
      'project':'project',
      'code':'code'
    };
    const id = map[key] || 'project';
    return `<svg class="icon" aria-hidden="true"><use href="#${id}"></use></svg>`;
  }

  // Modal handling for project details
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');
  const modalLink = document.getElementById('modalLink');
  const modalCode = document.getElementById('modalCode');
  const modalCodeBlock = document.getElementById('modalCodeBlock');

  function escapeHtml(str){
    return (str+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function openProjectDetail(id){
    const p = projects.find(x=>String(x.id)===String(id));
    if(!p || !modal) return;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalTech.textContent = p.tech.join(' · ');
    modalLink.href = p.link || '#';
    if(p.code){
      modalCode.style.display = 'block';
      modalCodeBlock.innerHTML = escapeHtml(p.code);
    } else {
      modalCode.style.display = 'none';
      modalCodeBlock.textContent = '';
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    // focus for accessibility + trap
    previousActiveElement = document.activeElement;
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn && closeBtn.focus();
    activateFocusTrap(modal);
  }

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    deactivateFocusTrap();
    // restore focus
    try{ previousActiveElement && previousActiveElement.focus(); }catch(e){}
  }

  document.addEventListener('click', (e)=>{
    if(e.target.matches('.details-btn')){
      openProjectDetail(e.target.dataset.id);
    }
    if(e.target.matches('.modal-close')){
      closeModal();
    }
    if(e.target === modal){
      closeModal();
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') closeModal();
  });

  // Expose a small API: replace profile image
  window.portfolio = window.portfolio || {};
  window.portfolio.setProfileImage = (src)=>{
    const img = document.getElementById('profileImage');
    if(img) img.src = src;
  };

  // Focus trap for modal
  let previousActiveElement = null;
  let focusTrapHandler = null;
  function activateFocusTrap(container){
    const focusable = container.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
    const nodes = Array.prototype.slice.call(focusable).filter(n=>!n.hasAttribute('disabled'));
    if(nodes.length===0) return;
    const first = nodes[0];
    const last = nodes[nodes.length-1];
    focusTrapHandler = function(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey){
        if(document.activeElement === first){
          e.preventDefault(); last.focus();
        }
      } else {
        if(document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', focusTrapHandler);
  }
  function deactivateFocusTrap(){
    if(focusTrapHandler) document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }

  // init
  document.getElementById('year').textContent = new Date().getFullYear();
  renderHobbies();
  renderProjects();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navEl = document.querySelector('.nav');
  if(menuToggle && navEl){
    menuToggle.addEventListener('click', ()=>{
      const open = navEl.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Reveal on scroll using IntersectionObserver
  const revealSelector = ['.hero-text', '.photo-frame', '.project-card', '.hobby-card', '.edu-item', '.exp-item', '.skill-badge'];
  const toObserve = document.querySelectorAll(revealSelector.join(','));
  if('IntersectionObserver' in window && toObserve.length){
    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('reveal','visible');
          o.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    toObserve.forEach(el=>{
      el.classList.add('reveal');
      obs.observe(el);
    });
  } else {
    // fallback: show all
    toObserve.forEach(el=>el.classList.add('reveal','visible'));
  }

  // small hero entrance after load
  const heroGrid = document.querySelector('.hero-grid');
  heroGrid && heroGrid.classList.add('hero-entrance');

  // Hero particles: lightweight DOM particles floated via CSS animation
  // Canvas-based hero particles for better performance
  (function(){
    let canvas, ctx, particles = [], rafId = null;
    const DPR = window.devicePixelRatio || 1;
    const cfg = {
      count: 22,
      colors: ['rgba(14,165,164,0.12)','rgba(14,165,164,0.09)','rgba(14,165,164,0.06)'],
      sizeMin: 3,
      sizeMax: 14,
      speedMin: 10,
      speedMax: 40
    };

    function setupCanvas(){
      canvas = document.getElementById('heroCanvas');
      if(!canvas) return;
      ctx = canvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      createParticles();
      start();
    }

    function resizeCanvas(){
      if(!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * DPR));
      canvas.height = Math.max(1, Math.floor(rect.height * DPR));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      if(ctx) ctx.setTransform(DPR,0,0,DPR,0,0);
    }

    function rand(min,max){ return min + Math.random()*(max-min); }

    function createParticles(){
      particles = [];
      const canvasEl = document.getElementById('heroCanvas');
      if(!canvasEl) return;
      const w = canvasEl.clientWidth;
      const h = canvasEl.clientHeight;
      for(let i=0;i<cfg.count;i++){
        const size = Math.round(rand(cfg.sizeMin,cfg.sizeMax));
        particles.push({
          x: Math.random()*w,
          y: h - Math.random()*(h*0.4),
          vx: rand(-6,6) * 0.02, // subtle horizontal drift
          vy: -rand(cfg.speedMin,cfg.speedMax) * 0.02, // upward motion
          size: size,
          alpha: rand(0.06,0.22),
          color: cfg.colors[Math.floor(Math.random()*cfg.colors.length)]
        });
      }
    }

    function step(){
      if(!ctx) return;
      const c = canvas;
      ctx.clearRect(0,0,c.clientWidth, c.clientHeight);
      for(let p of particles){
        p.x += p.vx;
        p.y += p.vy * (1 + Math.random()*0.08);
        if(p.y + p.size < 0 || p.x < -40 || p.x > c.clientWidth + 40){
          // respawn at bottom
          p.x = Math.random()*c.clientWidth;
          p.y = c.clientHeight + rand(4,80);
          p.vx = rand(-6,6) * 0.02;
          p.vy = -rand(cfg.speedMin,cfg.speedMax) * 0.02;
          p.size = Math.round(rand(cfg.sizeMin,cfg.sizeMax));
          p.alpha = rand(0.06,0.22);
          p.color = cfg.colors[Math.floor(Math.random()*cfg.colors.length)];
        }
        drawParticle(p);
      }
      rafId = requestAnimationFrame(step);
    }

    function drawParticle(p){
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function start(){ if(!rafId) rafId = requestAnimationFrame(step); }
    function stop(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }

    // Public initializer for tweaks
    window.portfolio = window.portfolio || {};
    window.portfolio.initHeroParticles = function(options){
      Object.assign(cfg, options || {});
      if(canvas) createParticles();
    };

    // Parallax for the SVG accent and wave
    function initParallax(){
      const accent = document.querySelector('.hero-accent');
      const wave = document.querySelector('.hero-wave');
      if(!accent && !wave) return;
      let ticking = false;
      function onScroll(){
        if(ticking) return; ticking = true;
        requestAnimationFrame(()=>{
          const sc = window.scrollY || window.pageYOffset;
          const offset = Math.min(60, sc * 0.06);
          if(accent){ accent.style.transform = `translateY(${offset}px)`; accent.classList.add('pulse'); }
          if(wave){ wave.style.transform = `translateY(${offset*0.6}px)`; }
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, {passive:true});
      onScroll();
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', ()=>{
      setupCanvas();
      initParallax();
    });

    // Expose a small control for runtime tweaks
    window.portfolio.particleConfig = cfg;
    // Wire particle controls (if present) so changes apply live
    function hookupControls(){
      // Check if dev mode is enabled (?dev=1 or ?dev in URL)
      const isDevMode = new URLSearchParams(window.location.search).has('dev');
      const controlsEl = document.getElementById('particleControls');
      if(isDevMode && controlsEl) controlsEl.classList.add('dev-mode');
      
      const countEl = document.getElementById('particleCount');
      const sizeEl = document.getElementById('particleSize');
      const speedEl = document.getElementById('particleSpeed');
      const paletteEl = document.getElementById('particlePalette');
      if(!countEl || !sizeEl || !speedEl || !paletteEl) return;

      const palettes = {
        'teal': ['rgba(14,165,164,0.12)','rgba(14,165,164,0.09)','rgba(14,165,164,0.06)'],
        'soft': ['rgba(44,163,123,0.12)','rgba(80,200,160,0.09)','rgba(120,220,180,0.06)'],
        'mono': ['rgba(255,255,255,0.08)','rgba(255,255,255,0.05)','rgba(255,255,255,0.03)']
      };

      function applyFromUI(){
        const count = parseInt(countEl.value,10)||cfg.count;
        const size = parseInt(sizeEl.value,10)||cfg.sizeMax;
        const speedMult = parseFloat(speedEl.value)||1;
        const palette = paletteEl.value || 'teal';
        // map single size slider to min/max
        cfg.count = Math.max(1, Math.min(300, count));
        cfg.sizeMax = Math.max(1, Math.min(80, size));
        cfg.sizeMin = Math.max(1, Math.round(cfg.sizeMax * 0.4));
        // scale speeds by multiplier
        cfg.speedMin = Math.max(1, Math.round(8 * speedMult));
        cfg.speedMax = Math.max(cfg.speedMin, Math.round(36 * speedMult));
        cfg.colors = palettes[palette] || palettes.teal;
        createParticles();
      }

      countEl.addEventListener('input', applyFromUI);
      sizeEl.addEventListener('input', applyFromUI);
      speedEl.addEventListener('input', applyFromUI);
      paletteEl.addEventListener('change', applyFromUI);
      // initialize UI to cfg
      countEl.value = cfg.count;
      sizeEl.value = cfg.sizeMax;
      speedEl.value = 1;
      paletteEl.value = 'teal';
    }
    document.addEventListener('DOMContentLoaded', hookupControls);
  })();

  // Theme toggle: persist preference
  const themeToggle = document.querySelector('.theme-toggle');
  function applyTheme(theme){
    if(theme === 'light') document.documentElement.classList.add('theme-light');
    else document.documentElement.classList.remove('theme-light');
    if(themeToggle) themeToggle.textContent = theme === 'light' ? '🌞' : '🌓';
  }
  const saved = localStorage.getItem('theme');
  applyTheme(saved || 'dark');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const isLight = document.documentElement.classList.toggle('theme-light');
      const theme = isLight ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

})();
