import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Dialog from './Dialog.svelte';

describe('Dialog', () => {
	afterEach(() => {
		cleanup();
	});

	it('keeps framed hosts inside the dialog body', () => {
		const { container } = render(Dialog, {
			id: 'dialog-frame',
			modulePath: 'explorer'
		});

		const body = container.querySelector('.idae-dialog__body');
		expect(body?.classList.contains('idae-dialog__body--framed')).toBe(true);
	});

	it('keeps padded body for snippet content', () => {
		const { container } = render(Dialog, {
			id: 'dialog-children'
		});

		const body = container.querySelector('.idae-dialog__body');
		expect(body?.classList.contains('idae-dialog__body--framed')).toBe(false);
	});

	it('is draggable and not fullscreen by default', () => {
		const { container } = render(Dialog, { id: 'dialog-defaults' });
		const dialog = container.querySelector('dialog');
		const header = container.querySelector<HTMLElement>('[data-drag-handle]');

		expect(dialog?.classList.contains('idae-dialog--fullscreen')).toBe(false);
		expect(header?.style.cursor).toBe('grab');
	});

	it('fills the viewport without enabling drag when requested', () => {
		const { container } = render(Dialog, {
			id: 'dialog-fullscreen',
			fullscreen: true,
			draggable: false
		});
		const dialog = container.querySelector('dialog');
		const header = container.querySelector<HTMLElement>('[data-drag-handle]');

		expect(dialog?.classList.contains('idae-dialog--fullscreen')).toBe(true);
		expect(header?.style.cursor).toBe('');
	});
});
