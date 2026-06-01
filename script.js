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
    // placeholder action - user can wire real navigation
    const label = items[selected].textContent.trim();
    alert('Open: ' + label);
  }
});

items.forEach((it, i)=>{
  it.addEventListener('click', ()=> select(i));
  it.addEventListener('dblclick', ()=> alert('Open: ' + it.textContent.trim()));
  it.addEventListener('mouseover', ()=> select(i));
  it.tabIndex = 0;
});

// ensure initial selection visible
select(selected);

