import {type Writable, writable} from 'svelte/store';
import type {ToastType} from './types.js';

export type ToastStoreType = Writable<Record<string,ToastType>>

export const toastStore:ToastStoreType = writable({});