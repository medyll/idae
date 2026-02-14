// Self-contained example behavior (no imports) — lightweight DOM demo
export function exampleInline(el?: Element){
  try{
    const host = el || document.createElement('div');
    // simple behavior: log and attach small content
    console.log('initializing exampleInline for', host);
    const der = function () { console.log('der', this); };
    const fr = function () { console.log('fr', this); };
    function getRequest(){ console.log('getRequest', this); }

    try { der.call(host); fr.call(host); getRequest.call(host); } catch(e){}

    if (!el){ document.body.appendChild(host); }
    return host;
  }catch(e){ console.error(e); }
}

export default exampleInline;
