// tests/be.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { be, Be } from '../src/lib/be.js';

describe('Be', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should create a Be instance', () => {
		const instance = be('#test');
		expect(instance).toBeDefined();
		expect(instance).toBeInstanceOf(Be);
		expect(instance.inputNode).toBeInstanceOf(HTMLElement);
	});

	it('should normalize input to a valid DOM node', () => {
		document.body.innerHTML = `
        <div id="parent">
            <div id="child"></div>
        </div>
    `;

		const instance = be('#child');
		expect(instance.inputNode).toBeInstanceOf(HTMLElement);
		expect((instance.inputNode as HTMLElement).id).toBe('child');

		const parentInstance = be('#parent');
		expect(parentInstance.inputNode).toBeInstanceOf(HTMLElement);
		expect((parentInstance.inputNode as HTMLElement).id).toBe('parent');
	});
});
