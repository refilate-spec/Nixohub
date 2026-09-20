const KEY='ags_recent',MAX=12;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(Boolean)}catch{return[]}};
const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,MAX)));
export const Recent={
  getAll:read,
  add:id=>{const next=[id,...read().filter(x=>x!==id)].slice(0,MAX);write(next);window.dispatchEvent(new CustomEvent('ags:recent'));},
  clear:()=>{write([]);window.dispatchEvent(new CustomEvent('ags:recent'));}
};
