import { describe, it, expect, beforeEach } from 'vitest';
import { be, Be } from '../be.js';

describe('WalkHandler', () => {
	beforeEach(() => {
		document.body.innerHTML = `
            <div id="test">
                <div class="child"></div>
                <div class="child"></div>
            </div>
        `;
	});

	it('should traverse DOM elements', () => {
		be('#test').children('.child', ({ be: child }) => {
			child.addClass('processed');
		});

		expect(document.querySelectorAll('.processed').length).toBe(2);
	});

	it('should find parent element using up()', () => {
		document.body.innerHTML = `
            <div id="parent">
                <div id="child"></div>
            </div>
        `;

		const parent = be('#child').up();

		expect(parent).toBeInstanceOf(Be);
	});

	it('should find siblings', () => {
		document.body.innerHTML = `
            <div>
                <div id="sibling1"></div>
                <div id="target"></div>
                <div id="sibling2"></div>
            </div>
        `;

		be('#target').siblings(({ be: siblings }) => {
			expect(siblings.node.length).toBe(2);
		});
	});

	it('should find closest ancestor matching selector', () => {
		document.body.innerHTML = `
            <div id="ancestor" class="ancestor">
                <div class="parent">
                    <div id="child"></div>
                </div>
            </div>
        `;

		be('#child').closest('.ancestor', ({ be: closest }) => {
			if (Array.isArray(closest?.node)) {
				expect(closest.node[0]?.id).toBe('ancestor');
			} else {
				expect(closest?.node?.id).toBe('ancestor');
			}
		});
	});

	it('should find descendants matching selector', () => {
		document.body.innerHTML = `
            <div id="ancestor">
                <div class="descendant"></div>
                <div class="descendant"></div>
            </div>
        `;

		be('#ancestor').findAll('.descendant', ({ be: descendants }) => {
			descendants.addClass('found');
		});
		expect(document.querySelectorAll('.found').length).toBe(2);
	});
});
