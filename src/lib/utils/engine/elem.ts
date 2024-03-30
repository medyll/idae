const elem = (node: HTMLElement) => {
  return {
    find    : (qy: string) => { return node.querySelector(qy);},
    findAll : (qy: string) => { return node.querySelectorAll(qy);},
    up      : (qy?: string | undefined, index?: number) => {
      if (!qy) return node.parentNode;
      return _recursivelyFind(node, 'parentNode', qy, index);
    },
    next    : (qy?: string | undefined, index?: number) => {
      if (!qy) return node.parentNode;
      return _recursivelyFind(node, 'nextSibling', qy, index);
    },
    previous: (qy?: string | undefined, index?: number) => {
      if (!qy) return node.parentNode;
      return _recursivelyFind(node, 'previousSibling', qy, index);
    },
    setStyle: (element: HTMLElement, styles: Record<string, any>) => {
      const elementStyle = element.style;
      for (const property in styles) {
        // @ts-ignore
        elementStyle[property] = styles[property];
      }
      
      return element;
    }
  };
};

function _recursivelyFind(element: HTMLElement | Element | any, property: keyof HTMLElement, expression: string | number, index?: number) {
  expression = expression || 0;
  index      = index || 0;
  /*if (Object.isNumber(expression)) {
   index = expression, expression = null;
   }*/
  
  while (element = element[property]) {
    if (element.nodeType !== 1) continue;
    
    if (!element.matches(expression)) continue;
    
    if (--index >= 0) continue;
    
    return element;
  }
}

function setStyle(element: HTMLElement, styles: Record<string, any>) {
  const elementStyle = element.style;
  
  for (const property in styles) {
    // @ts-ignore
    elementStyle[property] = styles[property];
  }
  
  return element;
}

export {elem};

