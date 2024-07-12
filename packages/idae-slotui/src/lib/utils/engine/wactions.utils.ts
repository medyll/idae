
import {get, writable} from 'svelte/store';


export const startMenuStore = writable<boolean>(true);

function toggleStartMenu(event: PointerEvent) {
  if (event) event.stopPropagation();
  startMenuStore.set(!get(startMenuStore));
}


export {toggleStartMenu};