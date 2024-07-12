import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import type { Writable } from 'svelte/store';


export interface UiContextType {
    drawerFlow: 'fixed' | 'relative'
    drawerOpen?: boolean
}
