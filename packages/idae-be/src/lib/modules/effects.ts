import { Be, be } from '../be.js';
import type { CommonHandler, HandlerCallBackFn } from '../types.js';

enum effectsMethods {
	fade = 'fade',
	appear = 'appear',
	slideUp = 'slideUp',
	slideDown = 'slideDown',
	move = 'move',
	scale = 'scale'
}

export interface EffectOptions {
	/** Animation duration in milliseconds. Default 400. */
	duration?: number;
	/** CSS easing function. Default 'ease'. */
	easing?: string;
	/** Delay before the animation starts, in milliseconds. */
	delay?: number;
}

export interface MoveOptions extends EffectOptions {
	/** Horizontal translation in px (added to the current position). Default 0. */
	x?: number;
	/** Vertical translation in px (added to the current position). Default 0. */
	y?: number;
}

export interface ScaleOptions extends EffectOptions {
	/** Starting scale factor. Default 1. */
	from?: number;
	/** Target scale factor. Default 1. */
	to?: number;
}

export interface EffectsHandlerHandle {
	fade?: { options?: EffectOptions; callback?: HandlerCallBackFn };
	appear?: { options?: EffectOptions; callback?: HandlerCallBackFn };
	slideUp?: { options?: EffectOptions; callback?: HandlerCallBackFn };
	slideDown?: { options?: EffectOptions; callback?: HandlerCallBackFn };
	move?: { options?: MoveOptions; callback?: HandlerCallBackFn };
	scale?: { options?: ScaleOptions; callback?: HandlerCallBackFn };
}

type KeyframeSpec = {
	keyframes: Keyframe[];
	/** Inline styles to apply when the animation finishes (final state). */
	finalStyles: Record<string, string>;
};

/**
 * Animation helpers built on the native Web Animations API — no dependency.
 * When `el.animate` is unavailable (e.g. jsdom), the final state is applied
 * synchronously and the callback fires immediately.
 */
export class EffectsHandler implements CommonHandler<EffectsHandler, EffectsHandlerHandle> {
	private beElement: Be;

	static methods = Object.values(effectsMethods);

	constructor(beElement: Be) {
		this.beElement = beElement;
	}

	methods: string[] = EffectsHandler.methods;

	/**
	 * Handles effect actions.
	 * @param actions - The actions to perform.
	 * @returns The Be instance (root) for method chaining.
	 */
	handle(actions: EffectsHandlerHandle): Be {
		Object.entries(actions).forEach(([method, props]) => {
			switch (method) {
				case 'fade':
				case 'appear':
				case 'slideUp':
				case 'slideDown':
					this[method](props.options, props.callback);
					break;
				case 'move':
				case 'scale':
					this[method](props.options as never, props.callback);
					break;
			}
		});

		return this.beElement;
	}

	/**
	 * Fades the element(s) to transparent, then hides them (`display: none`).
	 * @param options - Duration/easing/delay options.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	fade(options?: EffectOptions, callback?: HandlerCallBackFn): Be {
		return this.play(
			() => ({
				keyframes: [{ opacity: 1 }, { opacity: 0 }],
				finalStyles: { opacity: '0', display: 'none' }
			}),
			options,
			callback
		);
	}

	/**
	 * Fades the element(s) in from transparent.
	 * @param options - Duration/easing/delay options.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	appear(options?: EffectOptions, callback?: HandlerCallBackFn): Be {
		return this.play(
			(el) => {
				if (window.getComputedStyle(el).display === 'none') {
					el.style.display = '';
					el.style.opacity = '0';
				}
				return {
					keyframes: [{ opacity: 0 }, { opacity: 1 }],
					finalStyles: { opacity: '1' }
				};
			},
			options,
			callback
		);
	}

	/**
	 * Collapses the element(s) vertically, then hides them (`display: none`).
	 * @param options - Duration/easing/delay options.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	slideUp(options?: EffectOptions, callback?: HandlerCallBackFn): Be {
		return this.play(
			(el) => {
				const height = el.offsetHeight;
				return {
					keyframes: [
						{ height: `${height}px`, overflow: 'hidden' },
						{ height: '0px', overflow: 'hidden' }
					],
					finalStyles: { display: 'none', height: '' }
				};
			},
			options,
			callback
		);
	}

	/**
	 * Expands the element(s) vertically from hidden.
	 * @param options - Duration/easing/delay options.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	slideDown(options?: EffectOptions, callback?: HandlerCallBackFn): Be {
		return this.play(
			(el) => {
				const wasHidden = window.getComputedStyle(el).display === 'none';
				if (wasHidden) el.style.display = '';
				const height = el.offsetHeight;
				return {
					keyframes: [
						{ height: '0px', overflow: 'hidden' },
						{ height: `${height}px`, overflow: 'hidden' }
					],
					finalStyles: { height: '' }
				};
			},
			options,
			callback
		);
	}

	/**
	 * Translates the element(s) by the given offset, leaving the translation applied.
	 * @param options - `{ x, y }` offsets in px plus duration/easing/delay.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	move(options?: MoveOptions, callback?: HandlerCallBackFn): Be {
		const { x = 0, y = 0 } = options ?? {};
		return this.play(
			() => ({
				keyframes: [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${x}px, ${y}px)` }],
				finalStyles: { transform: `translate(${x}px, ${y}px)` }
			}),
			options,
			callback
		);
	}

	/**
	 * Scales the element(s) from `from` to `to`, leaving the transform applied.
	 * @param options - `{ from, to }` scale factors plus duration/easing/delay.
	 * @param callback - Optional callback fired when the animation finishes, per node.
	 * @returns The Be instance (root).
	 */
	scale(options?: ScaleOptions, callback?: HandlerCallBackFn): Be {
		const { from = 1, to = 1 } = options ?? {};
		return this.play(
			() => ({
				keyframes: [{ transform: `scale(${from})` }, { transform: `scale(${to})` }],
				finalStyles: { transform: `scale(${to})` }
			}),
			options,
			callback
		);
	}

	/**
	 * Runs an animation on every wrapped node and fires the callback on finish.
	 * Falls back to applying the final styles synchronously when the Web
	 * Animations API is unavailable.
	 */
	private play(
		spec: (el: HTMLElement) => KeyframeSpec,
		options: EffectOptions | undefined,
		callback?: HandlerCallBackFn
	): Be {
		const { duration = 400, easing = 'ease', delay = 0 } = options ?? {};

		this.beElement.eachNode((el) => {
			const { keyframes, finalStyles } = spec(el);

			const finish = () => {
				Object.assign(el.style, finalStyles);
				callback?.({
					fragment: undefined,
					be: be(el),
					root: this.beElement
				});
			};

			if (typeof el.animate === 'function') {
				const animation = el.animate(keyframes, { duration, easing, delay, fill: 'forwards' });
				animation.onfinish = finish;
			} else {
				finish();
			}
		});

		return this.beElement;
	}

	valueOf(): Be {
		return this.beElement;
	}
}
