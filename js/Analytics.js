const handlers=new Set();
export const Analytics={
  on(fn){if(typeof fn==='function')handlers.add(fn);return()=>handlers.delete(fn)},
  track(event,payload={}){const data={event,payload,timestamp:new Date().toISOString()};window.dispatchEvent(new CustomEvent('ags:analytics',{detail:data}));handlers.forEach(fn=>{try{fn(data)}catch(e){console.debug('AGS analytics handler failed',e)}});if(localStorage.getItem('ags_debug')==='1')console.debug('[AGS]',data)}
};
