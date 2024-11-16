export type Chord = {
	root: string;
	quality: string;
	mode?: string;
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
	timeSignature?: TimeSignature;
};

export type Cadence = {
	name: string;
	chords: string[];
};
