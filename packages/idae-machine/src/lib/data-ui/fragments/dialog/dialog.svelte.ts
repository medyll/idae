import { mount, unmount } from 'svelte';
import Dialog from './Dialog.svelte';

export interface OpenDialogOptions {
	/** Frame id — content-keyed by framer.loadInDialog. */
	id: string;
	iconClose?: string;
	center?: boolean;
	/** Render a backdrop scrim behind the dialog. */
	modal?: boolean;
	/** Allow closing via button / Escape / backdrop. Defaults to true. */
	closable?: boolean;
	/** Mount target. Defaults to document.body. */
	target?: HTMLElement;
	onClose?: () => void;
}

export interface DialogHandle {
	close: () => void;
}

/**
 * Mount a floating draggable Dialog frame on `target` (default body).
 * Content is driven by framer: the Dialog auto-registers under `id`, then framer.load()
 * calls controls.load() to mount the resolved component. Returns a handle with `.close()`.
 * Prefer `machine.framer.loadInDialog(...)` over calling this directly.
 */
export function openDialog(options: OpenDialogOptions): DialogHandle {
	console.log('[Dialog] openDialog called with id:', options.id);
	const { target = document.body, onClose, ...props } = options;

	let instance: Record<string, unknown> | undefined;

	const dispose = () => {
		console.log('[Dialog] dispose called');
		if (!instance) return;
		const ref = instance;
		instance = undefined;
		unmount(ref);
		onClose?.();
	};

	try {
		console.log('[Dialog] mounting Dialog component');
		instance = mount(Dialog, {
			target,
			props: {
				...props,
				open: true,
				removeOnClose: true,
				onClose: dispose
			}
		}) as Record<string, unknown>;
		console.log('[Dialog] Dialog mounted successfully');
	} catch (err) {
		console.error('[Dialog] Error mounting Dialog:', err);
		throw err;
	}

	console.log('[Dialog] returning handle');
	return { close: dispose };
}
