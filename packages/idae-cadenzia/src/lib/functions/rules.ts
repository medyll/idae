// functions/rules.ts
import { rootNotes, armorOptions, modes } from '$lib/constants/constants.js';
import type { ChordEntry } from '../types/types';

// Function to get scale notes based on the armor
export function getScaleNotes(armor: string): string[] {
	const baseScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	const armorInfo = armorOptions.find((a) => a.name === armor);

	if (!armorInfo) return baseScale;

	const sharpCount = armorInfo.value.includes('♯') ? parseInt(armorInfo.value) : 0;
	const flatCount = armorInfo.value.includes('♭') ? parseInt(armorInfo.value) : 0;

	if (sharpCount > 0) {
		const sharps = ['F', 'C', 'G', 'D', 'A', 'E', 'B'].slice(0, sharpCount);
		return baseScale.map((note) => (sharps.includes(note) ? note + '♯' : note));
	} else if (flatCount > 0) {
		const flats = ['B', 'E', 'A', 'D', 'G', 'C', 'F'].slice(0, flatCount);
		return baseScale.map((note) => (flats.includes(note) ? note + '♭' : note));
	}

	return baseScale;
}

// Function to check if a chord is in the scale
export function isChordInScale(chordEntry: ChordEntry): boolean {
	const scaleNotes = getScaleNotes(chordEntry.armor);
	const { root, quality, modifier } = chordEntry.chord;
	console.log({ scaleNotes });
	// Check if the root note is in the scale
	// if (!scaleNotes.includes(root)) return false;

	// Get chord notes considering the quality and the modifier
	const chordNotes = getChordNotes(root, quality, modifier);
	return chordNotes.every((note) => scaleNotes.includes(note));
}

// Function to get the degrees of the scale
export function getScaleDegrees(armor: string, mode: string): string[] {
	const scaleNotes = getScaleNotes(armor);
	const modeIndex = modes.indexOf(mode);
	if (modeIndex === -1) return [];

	const rotatedScale = [...scaleNotes.slice(modeIndex), ...scaleNotes.slice(0, modeIndex)];
	return rotatedScale.map((note, index) => {
		const degree = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][index];
		return `${degree} (${note})`;
	});
}

// Function to suggest valid chords based on armor and mode
export function suggestValidChords(armor: string, mode: string): string[] {
	const scaleNotes = getScaleNotes(armor);
	const degrees = getScaleDegrees(armor, mode);
	//  implement logic to suggest chords based on the scale notes and mode
	return degrees;
}

// Helper function to get chord notes based on root and quality
function getChordNotes(root: string, quality: string, modifier?: string): string[] {
	const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
	let rootIndex = chromaticScale.indexOf(root);

	// Apply modifier to root if present
	if (modifier) {
		if (modifier === '♯') rootIndex = (rootIndex + 1) % 12;
		if (modifier === '♭') rootIndex = (rootIndex - 1 + 12) % 12;
	}

	const modifiedRoot = chromaticScale[rootIndex];

	let intervals: number[] = [0]; // Root note is always included

	// Base triad
	if (quality.includes('min')) {
		intervals.push(3, 7); // Minor triad
	} else if (quality.includes('aug')) {
		intervals.push(4, 8); // Augmented triad
	} else if (quality.includes('dim')) {
		intervals.push(3, 6); // Diminished triad
	} else {
		intervals.push(4, 7); // Major triad (default)
	}

	// Sevenths
	if (quality.includes('7')) {
		if (quality.includes('maj7')) {
			intervals.push(11); // Major seventh
		} else if (quality.includes('dim')) {
			intervals.push(9); // Diminished seventh
		} else {
			intervals.push(10); // Minor seventh (dominant seventh)
		}
	}

	// Sixths
	if (quality.includes('6')) {
		intervals.push(9); // Major sixth
	}

	// Suspended chords
	if (quality.includes('sus4')) {
		intervals = intervals.filter((i) => i !== 4).concat(5);
	} else if (quality.includes('sus2')) {
		intervals = intervals.filter((i) => i !== 4).concat(2);
	}

	// Add9, add11, add13
	if (quality.includes('add9')) intervals.push(14);
	if (quality.includes('add11')) intervals.push(17);
	if (quality.includes('add13')) intervals.push(21);

	// Remove duplicates and sort
	intervals = [...new Set(intervals)].sort((a, b) => a - b);

	return intervals.map((interval) => chromaticScale[(rootIndex + interval) % 12]);
}
