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
let selected = items.findIndex(i=>i.classList.contains('selected')) || 0;
function select(idx){
  idx = Math.max(0, Math.min(items.length-1, idx));
  items.forEach((it,i)=>{
    it.classList.toggle('selected', i===idx);
    it.setAttribute('aria-selected', i===idx ? 'true' : 'false');
    if(i===idx) it.scrollIntoView({block:'center',behavior:'smooth'});
  });
  selected = idx;
}

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
