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
});
