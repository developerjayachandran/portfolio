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
      return `
        <article class="hobby-card">
          <h3>${h.title}</h3>
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
          <h3>${p.title}</h3>
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
    // focus for accessibility
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn && closeBtn.focus();
  }

  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
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

  // init
  document.getElementById('year').textContent = new Date().getFullYear();
  renderHobbies();
  renderProjects();

})();
