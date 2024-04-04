export type LisItemProps = {
	icon?: string;
	primary: string;
	secondary: string;
	action?: string;
	data: Record<string, any>;
};

export type LisItemPropsKey = keyof LisItemProps;
