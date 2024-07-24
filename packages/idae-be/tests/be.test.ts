// tests/be.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { be, toBe } from '../src/lib/be.js';

describe('Be', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should create a Be instance', () => {
		const instance = be('#test');
		expect(instance).toBeDefined();
		expect(instance.node).toBeInstanceOf(HTMLElement);
	});

	it('should append content', () => {
		be('#test').append(toBe('<span>Appended</span>'), ({ be: appended }) => {
			expect(appended.node.textContent).toBe('Appended');
		});
		expect(document.querySelector('#test span')).toBeDefined();
	});

	it('should set and get attributes', () => {
		be('#test').setAttr('data-test', 'value');
		expect(be('#test').getAttr('data-test')).toBe('value');
	});

	// Ajoutez d'autres tests pour couvrir les différentes fonctionnalités de votre bibliothèque
});
