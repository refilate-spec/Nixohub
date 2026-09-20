import {StoreEngine} from './StoreEngine.js';
const KEY='ags_search_history',MAX=10;
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(Boolean)}catch{return[]}};
const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,MAX)));
export const SearchEngine={
  query(q){return StoreEngine.search(q)},
  saveQuery(q){const x=String(q||'').trim();if(!x)return;write([x,...read().filter(v=>v.toLowerCase()!==x.toLowerCase())])},
  history:read,
  clearHistory(){write([])},
  suggestions(q){
    const x=String(q||'').trim().toLowerCase(); if(!x) return read().slice(0,6);
    const candidates=[...new Set([...read(),...StoreEngine.all().flatMap(b=>[b.name,...(b.tags||[])])])];
    return candidates.filter(v=>String(v).toLowerCase().includes(x)).slice(0,7);
  }
};
