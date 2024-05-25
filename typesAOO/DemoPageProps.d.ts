import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type DemoPageProps = CommonProps & {
    title: string;
    code: string;
    subTitle?: string;
    component?: string;
    demoerCode: Snippet;
    children: Snippet;
    slots: {
        code: Snippet;
    };
};