export type StepperOrientation = 'horizontal' | 'vertical';
export type StepType = {
	index: number;
	text: string;
	action: () => void;
};
