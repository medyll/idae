export type Chord = {
	root: string;
	quality: string;
	augDim?: string;
	sus?: string;
	sept?: string;
	modifier?: string;
	duration: string;
};

export type TimeSignature = {
	numerator: number;
	denominator: number;
};

export type ChordEntry = {
	chord: Chord;
	timeSignature?: { numerator: number; denominator: number };
	armor: string;
	mode?: string;
	measureInfo: {
		start: number;
		end: number;
		beatStart: number;
	};
};

export type Cadence = {
	name: string;
	chords: string[];
};
