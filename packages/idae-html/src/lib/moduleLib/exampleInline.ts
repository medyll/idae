// Self-contained example behavior (no imports) — lightweight DOM demo
(function(){
  try{
    document.querySelectorAll('[data-cssDom]').forEach(function(el){
      console.log('exampleInline element', el);
    });

    window.der = function () { console.log('der', this); };
    var fr = function () { console.log('fr', this); };
    function getRequest(){ console.log('getRequest', this); }

    try { window.der(); fr(); getRequest(); } catch(e){}
  }catch(e){}
})();

export {};
