// Clock update
function updateClock(){
  const el=document.getElementById('clock');
  if(!el) return;
  const now=new Date();
  let h=now.getHours();
  const m=now.getMinutes();
  const ampm=h>=12? 'PM':'AM';
  h=h%12||12;
  el.textContent = `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
}
setInterval(updateClock,1000);
updateClock();

// Menu navigation
const items = Array.from(document.querySelectorAll('.menu-item'));
const selector = document.getElementById('selector');
let selected = items.findIndex(i=>i.classList.contains('selected')) || 0;
const panels = Array.from(document.querySelectorAll('.panel'));
let videos = [];

function showPanel(idx, full=false){
  panels.forEach(p=>{ p.classList.remove('active','preview'); p.hidden = true; });
  const panel = panels.find(p=>Number(p.dataset.index)===idx);
  if(!panel) return;
  if(full){
    panel.classList.add('active');
    panel.hidden = false;
  } else {
    panel.classList.add('preview');
    panel.hidden = false;
  }
}

function openFullPanel(idx){
  showPanel(idx, true);
  document.body.classList.add('menu-hidden');
  if(idx===1){
    const dont = localStorage.getItem('mc_dontask_videos');
    if(videos.length===0 && dont!=='1'){
      setTimeout(()=> openAddVideosModal(),220);
    }
  }
}

function closeFullPanel(){
  // hide any active full panel and restore the menu
  panels.forEach(p=>{ p.classList.remove('active'); p.hidden = true; });
  document.body.classList.remove('menu-hidden');
  closeAddVideosModal();
  // restore preview for the currently selected menu item
  showPanel(selected, false);
}
function updateSelectorPosition(idx){
  if(!selector) return;
  const menuWrap = document.querySelector('.menu-wrap');
  const target = items[idx];
  const wrapRect = menuWrap.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const top = targetRect.top - wrapRect.top + (targetRect.height/2) - (selector.offsetHeight/2);
  const width = Math.min(Math.max(targetRect.width + 160, 300), Math.min(menuWrap.clientWidth * 0.8, 460));
  const leftCenter = targetRect.left - wrapRect.left + (targetRect.width/2);
  selector.style.width = width + 'px';
  selector.style.top = top + 'px';
  selector.style.left = leftCenter + 'px';
}

function select(idx){
  idx = Math.max(0, Math.min(items.length-1, idx));
  items.forEach((it,i)=>{
    it.classList.toggle('selected', i===idx);
    it.setAttribute('aria-selected', i===idx ? 'true' : 'false');
    if(i===idx) it.scrollIntoView({block:'center',behavior:'smooth'});
  });
  selected = idx;
  updateSelectorPosition(idx);
  showPanel(idx);
}

window.addEventListener('resize', ()=> updateSelectorPosition(selected));

document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowDown'){
    select((selected+1) % items.length);
    e.preventDefault();
  } else if(e.key === 'ArrowUp'){
    select((selected-1+items.length) % items.length);
    e.preventDefault();
  } else if(e.key === 'Enter'){
    openFullPanel(selected);
  }
  else if(e.key === 'Escape'){
    // close full panel and return to menu
    if(document.querySelector('.panel.active')){
      closeFullPanel();
      e.preventDefault();
    }
  }
});

items.forEach((it, i)=>{
  it.addEventListener('click', ()=> select(i));
  it.addEventListener('dblclick', ()=> openFullPanel(i));
  it.addEventListener('mouseover', ()=> select(i));
  it.tabIndex = 0;
});

// ensure initial selection visible
select(selected);

// Add Videos modal logic
const addModal = document.getElementById('addVideosModal');
const addYes = document.getElementById('addYes');
const addNo = document.getElementById('addNo');
const dontAsk = document.getElementById('dontAsk');

function openAddVideosModal(){
  if(!addModal) return;
  addModal.hidden = false;
}
function closeAddVideosModal(){
  if(!addModal) return;
  addModal.hidden = true;
}

addYes && addYes.addEventListener('click', ()=>{
  if(dontAsk && dontAsk.checked) localStorage.setItem('mc_dontask_videos','1');
  // simulate adding a sample video
  videos.push({title:'Sample Video',duration:'00:25'});
  renderVideos();
  closeAddVideosModal();
});
addNo && addNo.addEventListener('click', ()=>{
  if(dontAsk && dontAsk.checked) localStorage.setItem('mc_dontask_videos','1');
  closeAddVideosModal();
});

function renderVideos(){
  const panel = document.querySelector('.panel[data-index="1"]');
  if(!panel) return;
  const list = panel.querySelector('.videos-list');
  const empty = panel.querySelector('.empty-msg');
  if(videos.length===0){
    list.hidden = true;
    empty.hidden = false;
  } else {
    empty.hidden = true;
    list.hidden = false;
    list.innerHTML = '';
    videos.forEach(v=>{
      const el = document.createElement('div');
      el.className = 'vid-card';
      el.innerHTML = `<div class="vid-art"></div><div class="vid-meta"><div class="vid-title">${v.title}</div><div class="vid-duration">${v.duration}</div></div>`;
      list.appendChild(el);
    });
  }
}

renderVideos();

