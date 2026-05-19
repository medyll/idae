export interface ImageMeta {
	width:    number;
	height:   number;
	format:   string;
	hasAlpha: boolean;
	focus?:   { x: number; y: number };
}
