 

export interface Sx4uProps extends Partial<CSSStyleDeclaration> {
  p?: number[];
  px?: number,
  py?: number,
  m?: number[];
  mx?: number,
  my?: number,
  w?: number;
  h?: number;
  debug?: boolean;
  radius?: number;
  brd?: number;
  brdb?: number;
  brdt?: number;
  brdr?: number;
  brdl?: number;
  brdx?: number;
  brdy?: number;
  alignCenter?: boolean;
  shad?: boolean;
  rot?: number;
  dsp?: CSSStyleDeclaration['display'];
  sm?: Sx4uProps
  md?: Sx4uProps
  lg?: Sx4uProps
}

/**
 *
 * @param {HTMLElement} node
 * @param {Sx4uProps} sxArgs
 */
export function sx4u(node: HTMLElement, sxArgs: Sx4uProps) {
  let sxTransformRules: Partial<Record<keyof Sx4uProps, any>> = {};
  const sx4uClassPrefix                                       = node.classList[0] ?? 'random-letter-number';
  const sx4uClassName                                         = 'sx4u-' + node.tagName.toLowerCase() + '-' + sx4uClassPrefix;
  
  const test = node.className.includes('sx4u-');
  if (test) return;
  // add sx4uClassName
  node.classList.add(sx4uClassName);
  
  const transformKeys: Partial<Record<keyof Sx4uProps, any>> = {
    p   : 'padding',
    px  : ['paddingLeft', 'paddingRight'],
    py  : ['paddingTop', 'paddingBottom'],
    m   : 'margin',
    mx  : ['marginLeft', 'marginRight'],
    my  : ['marginTop', 'marginBottom'],
    brd : ['border'],
    brdt: ['borderTop'],
    brdr: ['borderRight'],
    brdb: ['borderBottom'],
    brdl: ['borderLeft'],
    brdx: ['borderLeft', 'borderRight'],
    brdy: ['borderTop', 'borderBottom'],
    sm  : '(max-width: 1250px)',
  };
  
  // dimensions
  sxTransformRules = {
    p : (p) => transDimensions(p, transformKeys['p']),
    px: (px) => transNumericProps(px, transformKeys['px']),
    py: (py) => transNumericProps(py, transformKeys['py']),
    m : (m) => transDimensions(m, transformKeys['m']),
    mx: (mx) => transNumericProps(mx, transformKeys['mx']),
    my: (my) => transNumericProps(my, transformKeys['my']),
    w : (w) => transNumericProps(w, ['width']),
    h : (h) => transNumericProps(h, ['height']),
  };
  // add borders
  sxTransformRules = {
    ...sxTransformRules,
    brd : (brd) => transBorderProps(brd, transformKeys['brd']),
    brdt: (brdt) => transBorderProps(brdt, transformKeys['brdt']),
    brdr: (brdr) => transBorderProps(brdr, transformKeys['brdr']),
    brdb: (brdb) => transBorderProps(brdb, transformKeys['brdb']),
    brdl: (brdl) => transBorderProps(brdl, transformKeys['brdl']),
    brdx: (brdx) => transBorderProps(brdx, transformKeys['brdx']),
    brdy: (brdy) => transBorderProps(brdy, transformKeys['brdy']),
  };
  // add media queries
  sxTransformRules = {
    ...sxTransformRules,
    sm: (sm) => doMediaQuy('sm', sm),
    md: (md) => doMediaQuy('md', md),
    lg: (lg) => doMediaQuy('lg', lg),
  };
  // add helpers
  sxTransformRules = {
    ...sxTransformRules,
    rot   : (rotate) => {return {transform: `rotate(${rotate}deg)`};},
    radius: (radius) => {return {borderRadius: typeof (radius) === 'number' ? `${radius}px` : radius};},
    shad  : (shadow) => {return {boxShadow: `0px 0px ${shadow}px rgba(196, 211, 241, 0.85)`};},
  };
  
  const diff = sx4uTransform(sxArgs);
  insertSxStyleSheet(diff);
  
  function sx4uTransform(sxArgs: Sx4uProps): Record<string, any> {
    return Object.keys(sxArgs).reduce(function (previousValue, sx4uKey, index) {
      let newVal;
      if (sxTransformRules[sx4uKey]) {
        newVal = {...previousValue, ...sxTransformRules[sx4uKey](sxArgs[sx4uKey as any])};
      } else {
        // common CSSStyleDeclaration
        newVal = {...previousValue, [sx4uKey]: sxArgs[sx4uKey]};
      }
      
      return newVal;
    }, {});
  }
  
  function doMediaQuy(mqy: string, qyargs: Sx4uProps) {
    return {[`@media ${transformKeys[mqy]}`]: sx4uTransform(qyargs)};
  }
  
  function transDimensions(values: number | number[], arg?: string) {
    if (Array.isArray(values)) {
      const res = values.map((val, index) => {
        return transNumericProps(val);
      }, []).join(' ');
      
      return arg ? {[arg]: res} : res;
    } else {
      return arg ? {[arg]: transNumericProps(values)} : transNumericProps(values);
    }
  }
  
  function transNumericProps(val: number, prop?: string[]) {
    if (prop && prop.length) {
      return prop.reduce((prev, arg, index) => {
        return {...prev, [arg]: transNumericProps(val)};
      }, {});
    } else {
      return (val) / 2 + 'rem';
    }
  }
  
  function transBorderProps(val: number, prop?: string[]) {
    return prop.reduce((prev, arg, index) => {
      return {...prev, [arg]: `${val}px solid red`};
    }, {});
  }
  
  function camelCaseToDash(str: string) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
  }
  
  function insertSxStyleSheet(diff) {
    
    let str       = doLoop(diff);
    // create style fragment
    const styleEl = document.createElement('style', {is: 'new'});
    styleEl.setAttribute('type', 'text/css');
    document.head.appendChild(styleEl);
    // take sheet
    let styleSheet    = styleEl.sheet;
    // styleSheet.insertRule('.daRule {'+str+'}',styleSheet.cssRules.length); // , styleSheet.cssRules.length
    styleEl.innerText = `.${sx4uClassName}{${str}}.${sx4uClassName}{} `; // , styleSheet.cssRules.length
    
    function doLoop(diff) {
      let ret = '';
      for (const red of Object.keys(diff)) {
        if (typeof (diff[red]) === 'object') {
          ret += camelCaseToDash(red) + '{' + doLoop(diff[red]) + '};';
        }
        if (typeof (diff[red]) === 'string') {
          ret += camelCaseToDash(red) + ': ' + diff[red] + ';';
        }
      }
      return ret;
    }
  }
  
  return {
    'data-action': 'res'
  }
}

