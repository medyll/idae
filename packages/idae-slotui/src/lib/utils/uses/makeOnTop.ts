interface DraggableProps {

}

export function makeOnTop(node: HTMLElement, props?: DraggableProps) {
  
  
  node.addEventListener('mousedown', onMouseDown, true);
  
  function onMouseDown() {
    let max = Math.max(
      ...Array.from(document.querySelectorAll('body *'), (el) =>
        parseFloat(window.getComputedStyle(el).zIndex)
      ).filter((zIndex) => !Number.isNaN(zIndex)),
      0
    );
    
    if( node.style.zIndex != `${max}`) node.style.zIndex = `${max+2}`
  }
  
  return () => {
    node.removeEventListener('mousedown', onMouseDown, true);
  };
};


