import {writable, get} from 'svelte/store';
import type Window from './Window.svelte';

export interface Wstore {
  instances: Record<string,Window>
  activatedFrame?: string
}

function ccWindowStore(){
  const {subscribe, set, update} =  writable<Wstore>({
    instances:{},
  });
  return {
    subscribe,
    set,
    get,
    create:(payload:any)=>update({...payload}),
    open:(payload:any)=>update({...payload}),
  }
}

export const wStore = ccWindowStore();


