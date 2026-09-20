import {brands,categories} from './StoreData.js';

const arr = v => Array.isArray(v) ? v : (v ? [v] : []);
const norm = v => String(v ?? '').toLowerCase().trim();
export const StoreEngine = {
  all(){ return brands; },
  getBrandById(id){ return brands.find(b=>b.id===id) || null; },
  getBrandBySlug(slug){ return brands.find(b=>b.slug===slug || b.id===slug) || null; },
  getBrandsByCategory(category){ return brands.filter(b=>b.category===category); },
  getFeaturedBrands(){ return brands.filter(b=>b.featured); },
  getPopularBrands(){ return brands.filter(b=>b.popular); },
  getTrendingBrands(){ return brands.filter(b=>b.trending); },
  getFreeBrands(){ return brands.filter(b=>b.pricing==='free'); },
  getFreemiumBrands(){ return brands.filter(b=>b.pricing==='freemium'); },
  getPremiumBrands(){ return brands.filter(b=>b.pricing==='paid'); },
  getDealBrands(){ return brands.filter(b=>StoreEngine.isDealActive(b)); },
  isDealActive(b){ return !!(b.deal && b.deal.active && (!b.deal.expires || new Date(b.deal.expires+'T23:59:59') >= new Date())); },
  categoryCount(id){ return brands.filter(b=>b.category===id).length; },
  alternatives(brand,limit=6){
    const explicit = arr(brand?.alternatives).map(id=>StoreEngine.getBrandById(id)).filter(Boolean);
    if(explicit.length) return explicit.slice(0,limit);
    return StoreEngine.related(brand,limit);
  },
  related(brand,limit=6){
    if(!brand) return [];
    const baseTags = new Set(arr(brand.tags).map(norm));
    const baseUses = new Set(arr(brand.useCases).map(norm));
    return brands.filter(b=>b.id!==brand.id).map(b=>{
      let score=0;
      if(b.category===brand.category) score+=8;
      if(b.subcategory===brand.subcategory) score+=4;
      score += arr(b.tags).reduce((s,t)=>s+(baseTags.has(norm(t))?3:0),0);
      score += arr(b.useCases).reduce((s,u)=>s+(baseUses.has(norm(u))?2:0),0);
      score += arr(b.features).reduce((s,f)=>s+(baseTags.has(norm(f))?1:0),0);
      return {b,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.b.name.localeCompare(b.b.name)).slice(0,limit).map(x=>x.b);
  },
  search(query){
    const q=norm(query); if(!q) return [];
    const terms=q.split(/\s+/).filter(Boolean);
    return brands.map(b=>({b,score:searchScore(b,terms)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score || a.b.name.localeCompare(b.b.name)).map(x=>x.b);
  },
  filter(list,filters={}){
    return list.filter(b=>{
      if(filters.category && b.category!==filters.category) return false;
      if(filters.pricing && b.pricing!==filters.pricing) return false;
      if(filters.useCase && !arr(b.useCases).some(x=>norm(x)===norm(filters.useCase))) return false;
      if(filters.feature && !arr(b.features).some(x=>norm(x)===norm(filters.feature)) && !arr(b.tags).some(x=>norm(x)===norm(filters.feature))) return false;
      return true;
    });
  },
  sort(list,key='popular'){
    const a=[...list];
    if(key==='az') return a.sort((x,y)=>x.name.localeCompare(y.name));
    if(key==='rating') return a.sort((x,y)=>(y.rating??-1)-(x.rating??-1));
    if(key==='free') return a.sort((x,y)=>pricingRank(x)-pricingRank(y));
    if(key==='newest') return a.sort((x,y)=>Number(!!y.badges?.includes('New'))-Number(!!x.badges?.includes('New')) || x.name.localeCompare(y.name));
    if(key==='featured') return a.sort((x,y)=>Number(y.featured)-Number(x.featured) || Number(y.popular)-Number(x.popular));
    return a.sort((x,y)=>Number(y.popular)-Number(x.popular) || Number(y.featured)-Number(x.featured) || x.name.localeCompare(y.name));
  },
  featureOptions(list=brands){
    const s=new Set(); list.forEach(b=>[...arr(b.features),...arr(b.tags)].forEach(x=>x&&s.add(String(x))));
    return [...s].sort((a,b)=>a.localeCompare(b));
  },
  useCaseOptions(list=brands){
    const s=new Set(); list.forEach(b=>arr(b.useCases).forEach(x=>x&&s.add(String(x))));
    return [...s].sort((a,b)=>a.localeCompare(b));
  },
  categoryOptions(){return categories;}
};

function pricingRank(b){return ({free:0,freemium:1,'free-trial':2,paid:3,custom:4}[b.pricing]??5);}
function searchScore(b,terms){
  const name=norm(b.name), category=norm(b.category), sub=norm(b.subcategory);
  const tags=arr(b.tags).map(norm), keywords=arr(b.keywords).map(norm), features=arr(b.features).map(norm), uses=arr(b.useCases).map(norm), desc=norm(b.description);
  let score=0;
  for(const t of terms){
    if(name===t) score+=100;
    else if(name.startsWith(t)) score+=55;
    else if(name.includes(t)) score+=35;
    if(category===t) score+=45;
    if(sub===t) score+=40;
    if(tags.includes(t)) score+=32;
    else if(tags.some(x=>x.includes(t))) score+=20;
    if(keywords.includes(t)) score+=28;
    else if(keywords.some(x=>x.includes(t))) score+=16;
    if(features.includes(t)) score+=22;
    else if(features.some(x=>x.includes(t))) score+=12;
    if(uses.includes(t)) score+=18;
    else if(uses.some(x=>x.includes(t))) score+=10;
    if(desc.includes(t)) score+=8;
  }
  return score;
}
