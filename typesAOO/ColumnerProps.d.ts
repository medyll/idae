import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export interface ColumnType {
    columnId: string;
    state: keyof typeof states;
}