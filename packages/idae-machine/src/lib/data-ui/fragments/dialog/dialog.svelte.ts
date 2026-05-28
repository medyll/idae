import { mount, unmount, type Snippet } from 'svelte';
import Dialog from './Dialog.svelte';

export interface OpenDialogOptions {
	iconClose?: string;
	center?: boolean;
	/** Body content. */
	children?: Snippet;
	header?: Snippet;
	footer?: Snippet;
	/** Mount target. Defaults to document.body. */
	target?: HTMLElement;
	onClose?: () => void;
}

export interface DialogHandle {
	close: () => void;
}

/**
 * Imperatively open a floating draggable dialog.
 * Returns a handle with `.close()`. The dialog removes itself from the DOM on close.
 */
export function openDialog(options: OpenDialogOptions = {}): DialogHandle {
	const { target = document.body, onClose, ...props } = options;

	let instance: Record<string, unknown> | undefined;

	const dispose = () => {
		if (!instance) return;
		const ref = instance;
		instance = undefined;
		unmount(ref);
		onClose?.();
	};

	instance = mount(Dialog, {
		target,
		props: {
			...props,
			open: true,
			removeOnClose: true,
			onClose: dispose
		}
	}) as Record<string, unknown>;

	return { close: dispose };
}
