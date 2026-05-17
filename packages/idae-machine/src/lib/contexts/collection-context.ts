import type { TplCollectionName } from '$lib/types/machine-model.js';
import { createContext } from 'svelte';

let collection = $state<TplCollectionName>();
export const [getCollection, setCollection] = createContext<TplCollectionName>();
