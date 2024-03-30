import * as effects from 'svelte/easing';
type DurationDelayType = {duration: number, delay: number,direction?:'prev'|'next'}

function slideOut(node: HTMLElement, {duration, delay}:DurationDelayType) {
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(-${50 - (eased * 50)}px,0);
        opacity: ${t}`;
    }
  };
}

function slideOutRt(node: HTMLElement, {duration, delay}:DurationDelayType) {
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(${50 - (eased * 50)}px,0);
        opacity: ${t}`;
    }
  };
}

function slideIn(node: HTMLElement, {duration, delay}:DurationDelayType) {
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(${250 - (eased * 250)}px,0);
        opacity: ${t}`;
    }
  };
}

function slideInRtl(node: HTMLElement, {duration, delay}:DurationDelayType) {
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(-${250 - (eased * 250)}px,0);
        opacity: ${t}`;
    }
  };
}

function slideInNoName(node: HTMLElement, {duration, delay,direction}:DurationDelayType) {

  const getTranslate = (eased:any)=> direction==='next' ? -(250 - (eased * 250)) : (250 - (eased * 250))
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(${getTranslate(eased)}px,0);
        opacity: ${t}`;
    }
  };
}
function slideOutNoName(node: HTMLElement, {duration, delay,direction}:DurationDelayType) {

  const getTranslate = (eased:any)=> direction==='next' ? -(250 - (eased * 250)) : (250 - (eased * 250))
  return {
    duration,
    delay,
    css: (t:number) => {
      const eased = effects.quadOut(t);
      return `transform: translate(${getTranslate(eased)}px,0);
        opacity: ${t}`;
    }
  };
}


export const transitions = {slideOut, slideOutRt, slideIn, slideInRtl,slideOutNoName,slideInNoName};