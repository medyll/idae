import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

// NOTE: `ColumnerColProps` moved to component module script during migration.
// Keep other exports intact.
export type ColumnerStoreType = Record<string, ColumnerColType>;

export interface ColumnerColType {
	columnId: string;
	state: keyof typeof states;
}

const states = ['expanded', 'equal', 'minimal', 'default'];

// Placeholder demo exports for Columner components
import type { DemoerStoryProps } from "../demoer/types.js";
export const bottomSlotDemoValues: DemoerStoryProps<any> = {};
export const columnerDemoValues: DemoerStoryProps<any> = {};
export const columnerColDemoValues: DemoerStoryProps<any> = {};
export const drawerTopDemoValues: DemoerStoryProps<any> = {};
