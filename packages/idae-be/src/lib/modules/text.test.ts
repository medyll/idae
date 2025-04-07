import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('TextHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test">Original</div>';
	});

	it('should update text content', () => {
		be('#test').updateText('Updated');
		expect((document.querySelector('#test') as HTMLElement)?.innerText).toBe('Updated');
	});

	it('should append text content', () => {
		be('#test').appendText(' Appended');
		expect((document.querySelector('#test') as HTMLElement)?.innerHTML).toBe('Original Appended');
	});

	it('should prepend text content', () => {
		be('#test').prependText('Prepended ');

		expect((document.querySelector('#test') as HTMLElement)?.innerHTML).toBe('Prepended Original');
	});

	it('should replace the element with new content', () => {
		be('#test').replaceText('Replaced');
		// expect(document.querySelector('#test')).toBeNull();
		expect((document.querySelector('#test') as HTMLElement)?.innerHTML).toBe('Replaced');
	});

	it('should remove the element', () => {
		be('#test').removeText();
		expect(document.querySelector('#test')).toBeNull();
	});

	it('should clear the element content', () => {
		be('#test').clearText();
		expect((document.querySelector('#test') as HTMLElement)?.innerHTML).toBe('');
	});

	it('should normalize the element content', () => {
		document.body.innerHTML = '<div id="test">Text <span>Fragment</span> Text</div>';
		be('#test').normalizeText();
		const testElement = document.querySelector('#test') as HTMLElement;
		expect(testElement?.childNodes.length).toBe(3); // TextNode, ElementNode, TextNode
		expect(testElement?.childNodes[0].nodeValue).toBe('Text ');
		expect(testElement?.childNodes[2].nodeValue).toBe(' Text');
	});

	it('should wrap the element with a new element', () => {
		be('#test').wrapText('<div class="wrapper"></div>');
		const wrapper = document.querySelector('.wrapper') as HTMLElement;
		expect(wrapper).not.toBeNull();
		expect(wrapper?.querySelector('#test')).not.toBeNull();
	});
});
