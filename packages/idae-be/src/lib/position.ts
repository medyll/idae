import { Be } from './be.js';
import type { PositionSnapOptions } from './types.js';
import { BeUtils } from './utils.js';

enum positionMethods {
	clonePosition = 'clonePosition',
	overlapPosition = 'overlapPosition',
	snapTo = 'snapTo'
}
export class PositionHandler {
	private beElement: Be;

	static methods = Object.values(positionMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}
	/**
	 * Clones the position of a source element to this element.
	 * @param sourceElement The element or selector of the element whose position is to be cloned.
	 * @param options Additional options for positioning.
	 * @param options.offsetX Horizontal offset from the source position.
	 * @param options.offsetY Vertical offset from the source position.
	 * @param options.useTransform Whether to use CSS transform for positioning.
	 * @returns The Be instance for method chaining.
	 */
	clonePosition(
		sourceElement: string | HTMLElement,
		options: {
			offsetX?: number;
			offsetY?: number;
			useTransform?: boolean;
		} = {}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const sourceEl =
			typeof sourceElement === 'string' ? document.querySelector(sourceElement) : sourceElement;

		if (!sourceEl) return this.beElement;

		const sourceRect = sourceEl.getBoundingClientRect();
		const targetRect = (this.beElement.node as HTMLElement).getBoundingClientRect();
		const { offsetX = 0, offsetY = 0, useTransform = false } = options;

		this.beElement.eachNode((el) => {
			if (useTransform) {
				const x = sourceRect.left - targetRect.left + offsetX;
				const y = sourceRect.top - targetRect.top + offsetY;
				el.style.transform = `translate(${x}px, ${y}px)`;
			} else {
				el.style.left = `${sourceRect.left + offsetX}px`;
				el.style.top = `${sourceRect.top + offsetY}px`;
			}
		});

		return this.beElement;
	}

	/**
	 * Positions this element to overlap a target element.
	 * @param targetElement The element or selector of the element to overlap.
	 * @param options Additional options for positioning.
	 * @param options.alignment The alignment of this element relative to the target.
	 * @param options.offset The distance to offset from the target element.
	 * @param options.useTransform Whether to use CSS transform for positioning.
	 * @returns The Be instance for method chaining.
	 */
	overlapPosition(
		targetElement: string | HTMLElement,
		options: {
			alignment?: 'center' | 'top' | 'bottom' | 'left' | 'right';
			offset?: number;
			useTransform?: boolean;
		} = {}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const targetEl =
			typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;

		if (!targetEl) return this.beElement;

		const { alignment = 'center', offset = 0, useTransform = false } = options;
		const targetRect = targetEl.getBoundingClientRect();
		const selfRect = (this.beElement.node as HTMLElement).getBoundingClientRect();

		let x = 0,
			y = 0;

		switch (alignment) {
			case 'center':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
			case 'top':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.top - selfRect.height - offset;
				break;
			case 'bottom':
				x = targetRect.left + (targetRect.width - selfRect.width) / 2;
				y = targetRect.bottom + offset;
				break;
			case 'left':
				x = targetRect.left - selfRect.width - offset;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
			case 'right':
				x = targetRect.right + offset;
				y = targetRect.top + (targetRect.height - selfRect.height) / 2;
				break;
		}

		this.beElement.eachNode((el) => {
			if (useTransform) {
				el.style.transform = `translate(${x}px, ${y}px)`;
			} else {
				el.style.left = `${x}px`;
				el.style.top = `${y}px`;
			}
		});

		return this.beElement;
	}

	/**
	 * Snaps the element to a target element with specified anchor points.
	 * @param targetElement The element or selector of the element to snap to.
	 * @param options Snapping options.
	 * @param options.sourceAnchor The anchor point on the source element.
	 * @param options.targetAnchor The anchor point on the target element.
	 * @param options.offset Optional offset from the target anchor point.
	 * @returns The Be instance for method chaining.
	 */
	snapTo(
		targetElement: string | HTMLElement, // SnapToOptions
		options: {
			sourceAnchor: PositionSnapOptions;
			targetAnchor: PositionSnapOptions;
			offset?: { x: number; y: number };
		}
	): Be {
		if (this.beElement.isWhat !== 'element') return this.beElement;

		const targetEl =
			typeof targetElement === 'string' ? document.querySelector(targetElement) : targetElement;

		if (!targetEl) return this.beElement;

		const sourceRect = (this.beElement.node as HTMLElement).getBoundingClientRect();
		const targetRect = targetEl.getBoundingClientRect();
		const { sourceAnchor, targetAnchor, offset = { x: 0, y: 0 } } = options;

		let sourceX: number, sourceY: number, targetX: number, targetY: number;

		// Calculate source anchor point
		[sourceX, sourceY] = BeUtils.calculateAnchorPoint(sourceRect, sourceAnchor);

		// Calculate target anchor point
		[targetX, targetY] = BeUtils.calculateAnchorPoint(targetRect, targetAnchor);

		// Calculate final position
		const x = targetX - sourceX + offset.x;
		const y = targetY - sourceY + offset.y;

		// Apply position
		this.beElement.eachNode((el) => {
			const computedStyle = window.getComputedStyle(el);
			const position = computedStyle.position;

			if (position === 'static') {
				el.style.position = 'relative';
			}

			el.style.left = `${x}px`;
			el.style.top = `${y}px`;
		});

		return this.beElement;
	}
}
