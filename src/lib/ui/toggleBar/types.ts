import type { ContentSwitcherProps } from '$lib/base/contentSwitcher/types.js';
import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type ToggleBarProps = CommonProps & {
	/** title of the toggle bar */
	title?: string;

	/** icon of the toggle bar */
	icon?: string;

	/** orientation of the toggle bar */
	orientation?: 'right' | 'left';

	contentSwitcherProps?: ContentSwitcherProps;

	toggleBarIcon?: Snippet;
	toggleBarTitle?: Snippet;
	toggleBarButtons?: Snippet;
	contentSwitcherIcon?: Snippet;
	contentSwitcherReveal?: Snippet;
};
