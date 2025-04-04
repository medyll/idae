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

		const siblings = be('#target').siblings();
		expect(siblings.inputNode.length).toBe(2);
		/* expect(siblings[0].node.id).toBe('sibling1');
		expect(siblings[1].node.id).toBe('sibling2'); */
	});

	it('should find closest ancestor matching selector', () => {
		document.body.innerHTML = `
            <div class="ancestor">
                <div class="parent">
                    <div id="child"></div>
                </div>
            </div>
        `;

		const closest = be('#child').closest('.ancestor');
		expect(closest.inputNode.classList.contains('ancestor')).toBe(true);
	});

	it('should find descendants matching selector', () => {
		document.body.innerHTML = `
            <div id="ancestor">
                <div class="descendant"></div>
                <div class="descendant"></div>
            </div>
        `;

		const descendants = be('#ancestor').find('.descendant');
		expect(descendants.length).toBe(2);
	});
});
