// Self-contained module demo — lightweight DOM demo
(function(){
  try{
    window.der = function () { console.log('der', this); };
    var fr = function () { console.log('fr', this); };
    function getRequest(){ console.log('getRequest', this); }
    try { window.der(); fr(); getRequest(); } catch(e){}
  }catch(e){}
})();

export {};
