import { describe, it, expect } from 'vitest';
import { Be } from './be.js';

describe('Be', () => {
	it('should create an instance of Be', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		expect(beInstance).toBeInstanceOf(Be);
	});

	it('should add a class to the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.classAdd('test-class');
		expect(element.classList.contains('test-class')).toBe(true);
	});

	it('should remove a class from the element', () => {
		const element = document.createElement('div');
		element.classList.add('test-class');
		const beInstance = Be.elem(element);
		beInstance.classRemove('test-class');
		expect(element.classList.contains('test-class')).toBe(false);
	});

	it('should toggle a class on the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.classToggle('test-class');
		expect(element.classList.contains('test-class')).toBe(true);
		beInstance.classToggle('test-class');
		expect(element.classList.contains('test-class')).toBe(false);
	});

	it('should find an element within the element', () => {
		const parentElement = document.createElement('div');
		const childElement = document.createElement('span');
		parentElement.appendChild(childElement);
		const beInstance = Be.elem(parentElement);
		const foundElement = beInstance.find('span');
		expect(foundElement).toBe(childElement);
	});

	it('should find all elements within the element', () => {
		const parentElement = document.createElement('div');
		const childElement1 = document.createElement('span');
		const childElement2 = document.createElement('span');
		parentElement.appendChild(childElement1);
		parentElement.appendChild(childElement2);
		const beInstance = Be.elem(parentElement);
		const foundElements = beInstance.findAll('span');
		expect(foundElements).toEqual([childElement1, childElement2]);
	});

	it('should set the inner HTML of the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.htmlSet('<p>Test</p>');
		expect(element.innerHTML).toBe('<p>Test</p>');
	});

	it('should set the text content of the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.textSet('Test');
		expect(element.textContent).toBe('Test');
	});

	it('should find the parent element', () => {
		const parentElement = document.createElement('div');
		const childElement = document.createElement('span');
		parentElement.appendChild(childElement);
		const beInstance = Be.elem(childElement);
		const foundParentElement = beInstance.up();
		expect(foundParentElement).toBe(parentElement);
	});

	it('should find the next sibling element', () => {
		const parentElement = document.createElement('div');
		const siblingElement = document.createElement('span');
		parentElement.appendChild(siblingElement);
		const beInstance = Be.elem(parentElement);
		const foundSiblingElement = beInstance.next();
		expect(foundSiblingElement).toBe(siblingElement);
	});

	it('should find the previous sibling element', () => {
		const parentElement = document.createElement('div');
		const siblingElement = document.createElement('span');
		parentElement.appendChild(siblingElement);
		const beInstance = Be.elem(siblingElement);
		const foundSiblingElement = beInstance.previous();
		expect(foundSiblingElement).toBe(parentElement);
	});

	it('should set styles on the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.setStyle({ color: 'red', fontSize: '16px' });
		expect(element.style.color).toBe('red');
		expect(element.style.fontSize).toBe('16px');
	});

	it('should add an event listener to the element', () => {
		const element = document.createElement('button');
		const beInstance = Be.elem(element);
		const clickHandler = jest.fn();
		beInstance.on('click', clickHandler);
		element.click();
		expect(clickHandler).toHaveBeenCalled();
	});

	it('should remove an event listener from the element', () => {
		const element = document.createElement('button');
		const beInstance = Be.elem(element);
		const clickHandler = jest.fn();
		beInstance.on('click', clickHandler);
		beInstance.off('click', clickHandler);
		element.click();
		expect(clickHandler).not.toHaveBeenCalled();
	});

	it('should append content to the element', () => {
		const element = document.createElement('div');
		const beInstance = Be.elem(element);
		beInstance.append('<p>Test</p>');
		expect(element.innerHTML).toBe('<p>Test</p>');
	});

	it('should remove the element', () => {
		const element = document.createElement('div');
		const parentElement = document.createElement('div');
		parentElement.appendChild(element);
		const beInstance = Be.elem(element);
		beInstance.remove();
		expect(parentElement.contains(element)).toBe(false);
	});

	it('should make an AJAX fetch request', async () => {
		const mockResponse = { data: 'test' };
		const mockFetch = jest.fn().mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockResponse)
		});
		global.fetch = mockFetch;
		const beInstance = Be.elem('http://example.com');
		const response = await beInstance.fetch({ url: 'http://example.com', method: 'GET' });
		expect(mockFetch).toHaveBeenCalledWith('http://example.com', {
			method: 'GET',
			body: undefined,
			headers: {}
		});
		expect(response).toEqual(mockResponse);
	});
});
