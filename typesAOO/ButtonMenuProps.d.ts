import type { CommonProps, ElementProps, IconObj } from '$lib/types/index.js';
import type { MenuProps } from '$lib/ui/menu/types.js';
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';
import type { UsePopperProps } from '$lib/ui/popper/usePopper.js';
import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
export type ButtonMenuProps = ButtonProps & {
    menuProps?: MenuListProps;
    popperProps?: PopperProps;
    menuItem?: Snippet;
};