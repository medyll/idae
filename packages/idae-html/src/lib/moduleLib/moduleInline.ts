// Self-contained module demo — lightweight DOM demo
export function moduleInline(el?: Element){
  try{
    const host = el || document.createElement('div');
    const der = function () { console.log('der', this); };
    const fr = function () { console.log('fr', this); };
    function getRequest(){ console.log('getRequest', this); }
    try { der.call(host); fr.call(host); getRequest.call(host); } catch(e){}
    if (!el) document.body.appendChild(host);
    return host;
  }catch(e){ console.error(e); }
}

export default moduleInline;
