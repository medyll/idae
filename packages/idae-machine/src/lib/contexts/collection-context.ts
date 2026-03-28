import type { TplCollectionName } from '@medyll/idae-idbql';
import { createContext } from 'svelte';

let collection = $state<TplCollectionName>();
export const [getCollection, setCollection] = createContext<TplCollectionName>();
