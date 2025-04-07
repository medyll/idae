import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('DomHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should manipulate DOM content', () => {
		be('#test').update('<p>Updated content</p>');
		expect(document.querySelector('#test')?.innerHTML).toBe('<p>Updated content</p>');

		be('#test').clear();
		expect(document.querySelector('#test')?.innerHTML).toBe('');
	});

	it('should wrap elements', () => {
		be('#test').update('<span>Content</span>').wrap('div');
		expect(document.querySelector('#test')?.parentElement?.tagName).toBe('DIV');
	});

	it('should append content', () => {
		be('#test').append('<span>Appended</span>');
		expect(document.querySelector('#test span')?.innerHTML).toBe('Appended');
	});

	it('should prepend content', () => {
		be('#test').update('<span>Original</span>').prepend('<span>Prepended</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Prepended</span><span>Original</span>'
		);
	});

	it('should insert content using afterBegin', () => {
		be('#test').update('<span>Original</span>').insert('afterbegin', '<span>Inserted</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Inserted</span><span>Original</span>'
		);
	});

	it('should insert content using afterEnd', () => {
		be('#test').update('<span id="child">Original</span>');
		be('#child').insert('afterend', '<span>Inserted</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span id="child">Original</span><span>Inserted</span>'
		);
	});

	it('should insert content using beforeBegin', () => {
		be('#test').update('<span id="child">Original</span>');
		be('#child').insert('beforebegin', '<span>Inserted</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Inserted</span><span id="child">Original</span>'
		);
	});

	it('should insert content using beforeEnd', () => {
		be('#test').update('<span>Original</span>').insert('beforeend', '<span>Inserted</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Original</span><span>Inserted</span>'
		);
	});

	it('should insert content using a string', () => {
		be('#test').update('<span>Original</span>').insert('afterbegin', '<span>Inserted</span>');
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Inserted</span><span>Original</span>'
		);
	});

	it('should insert content using an HTMLElement', () => {
		const newElement = document.createElement('span');
		newElement.textContent = 'Inserted';
		be('#test').update('<span>Original</span>').insert('afterbegin', newElement);
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Inserted</span><span>Original</span>'
		);
	});

	it('should insert content using a Be instance', () => {
		const newElement = document.createElement('span');
		newElement.textContent = 'Inserted';
		const beElement = be(newElement);
		be('#test').update('<span>Original</span>').insert('afterbegin', beElement);
		expect(document.querySelector('#test')?.innerHTML).toBe(
			'<span>Inserted</span><span>Original</span>'
		);
	});

	it('should remove elements', () => {
		be('#test').update('<span>To be removed</span>');
		be('#test span').remove();
		expect(document.querySelector('#test')?.innerHTML).toBe('');
	});

	it('should replace elements', () => {
		be('#test').update('<span>To be replaced</span>');
		be('#test span').replace('<div>Replaced</div>');
		expect(document.querySelector('#test')?.innerHTML).toBe('<div>Replaced</div>');
	});

	it('should normalize elements', () => {
		be('#test').update('Text <span>Fragment</span> Text');
		be('#test').normalize();
		expect(document.querySelector('#test')?.childNodes.length).toBe(3); // TextNode, ElementNode, TextNode
	});

	it('should clear content', () => {
		be('#test').update('<span>Content</span>');
		be('#test').clear();
		expect(document.querySelector('#test')?.innerHTML).toBe('');
	});
});
