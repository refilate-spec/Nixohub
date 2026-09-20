const KEY='ags_saved';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(Boolean)}catch{return[]}};
const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,500)));
export const Favorites={
  getAll:read,
  has:id=>read().includes(id),
  toggle:id=>{const a=read();const next=a.includes(id)?a.filter(x=>x!==id):[id,...a];write(next);window.dispatchEvent(new CustomEvent('ags:saved',{detail:{id, saved:next.includes(id)}}));return next.includes(id)},
  remove:id=>{write(read().filter(x=>x!==id));window.dispatchEvent(new CustomEvent('ags:saved',{detail:{id,saved:false}}))},
  clear:()=>{write([]);window.dispatchEvent(new CustomEvent('ags:saved',{detail:{clear:true}}))}
};
