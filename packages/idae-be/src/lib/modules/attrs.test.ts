import { describe, it, expect, beforeEach } from 'vitest';
import { be } from '../be.js';

describe('AttrHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test"></div>';
	});

	it('should set and get attributes', () => {
		be('#test').setAttr('attr', 'value');
		expect(be('#test').getAttr('attr')).toBe('value');
	});
});
