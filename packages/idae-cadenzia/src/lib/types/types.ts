/**
 * Represents a musical chord.
 * - `root`: tonic note (e.g. 'C', 'G')
 * - `quality`: chord quality (e.g. 'maj', 'min')
 * - `augDim`, `sus`, `sept`: optional extensions
 * - `modifier`: accidental (♯, ♭, etc.)
 * - `duration`: duration as integer or fraction (e.g. '1', '1/4')
 */
export type Chord = {
  root: string;
  quality: string;
  augDim?: string;
  sus?: string;
  sept?: string;
  modifier?: string;
  duration: string;
};

/**
 * Time signature used for beat/measure calculations.
 */
export type TimeSignature = {
  numerator: number;
  denominator: number;
};

/**
 * Progression entry: a chord with metadata (time signature, key/armor, mode).
 */
export type ChordEntry = {
	chord: Chord;
	timeSignature?: { numerator: number; denominator: number };
	/** Name of the key/armor associated (e.g. 'C', 'G') */
	armor: string;
	mode?: string;
	/** Calculated measure information (start = starting measure number) */
	measureInfo: {
		start: number;
		end: number;
		beatStart: number;
	};
};

/**
 * Description of a musical cadence (name + sequence of scale degrees in roman numerals).
 */
export type Cadence = {
	name: string;
	chords: string[];
};
