type Steps = [number, number, number];
type Maskdd = [Ease, EaseTrigger];
type Mask = string;
type ToMask = string;
type CssRule = string;
type EaseTrigger = number;
type Ease = number;

type ProgressionType = {
	property: string;
	steps: {
		steps: Steps;
		ease: [Ease, EaseTrigger];
		reverseValue?: boolean;
	};
	iteratorMask: string;
	propertyValue?: {
		content: [Mask, ToMask];
		apply: string;
	};
};

class generateCssBlocks {
	static createProgression(options: ProgressionType) {
		const { property, iteratorMask, propertyValue } = options;
		const [from, to, increment] = options.steps.steps;
		const [ease, trigger] = options.steps.ease;

		let css = '';

		for (
			let i = from;
			i <= to;
			i += i < trigger || i >= to - trigger ? increment / ease : increment
		) {
			const iteratorTo = options.steps.reverseValue ? to - i : i;
			const prop = `${property}-${i}`;
			const content = propertyValue?.conten
				? `${propertyValue?.content[0].replace(
						'##',
						propertyValue.content[1]
					)} ${propertyValue?.apply}`
				: '';
			const newVal = `${iteratorMask.replace('##', iteratorTo.toString())}`;

			css += `${prop}-${i}: ${content} ${newVal};\r`;
			[].push();
		}
		return css;
	}
}
console.log(
	generateCssBlocks.createProgression({
		property: '--cfab-primary',
		iteratorMask: 'color-mix(in srgb, var(--cfab-primary) black ##%',
		steps: {
			steps: [0, 100, 10],
			ease: [2, 20],
			reverseValue: true
		}
	})
);
