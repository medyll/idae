interface DraggableProps {
  disabled?: true

}

export function draggebler(node: HTMLElement, props: DraggableProps) {
  
  let parentNode = document.body;
  
  let left = node.offsetLeft;
  let top  = node.offsetTop;
  
  let moving = false;
  
  let target = node.querySelector('.handle') ?? node;
  
  target.style.userSelect = 'none';
  
  target.addEventListener('mousedown', onMouseDown, true);
  window.addEventListener('mouseup', onMouseUp, true);
  window.addEventListener('mousemove', onMouseMove, true);
  
  function onMouseDown() {
    moving = true;
  }
  
  function onMouseMove(e) {
    if (moving) {
      left += e.movementX;
      top += e.movementY;
      node.style.top= `${top}px`
      node.style.left= `${left}px`
      // node.style.transform= `translate(${left}px,${top + 'px'})`
    }
  }
  
  function onMouseUp() {
    moving = false;
  }
  
  function setPosition(){
  
  
  }
  
  return (() => {
    target.removeEventListener('mousedown', onMouseDown, true);
    window.removeEventListener('mouseup', onMouseUp, true);
    window.removeEventListener('mousemove', onMouseMove, true);
  });
};
