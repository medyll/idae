import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
interface BreadListType {
    action?: () => void;
    breads?: BreadListItemType[];
}