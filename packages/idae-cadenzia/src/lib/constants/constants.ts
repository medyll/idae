/* constants/constants.ts */
import type { Cadence } from '$lib/types/types';

/**
 * Liste des cadences musicales communes. Chaque cadence contient un nom
 * et la séquence des degrés (chiffres romains) qui la définissent.
 */
export const cadencePatterns: Cadence[] = [
	{ name: 'Perfect', chords: ['V', 'I'] },
	{ name: 'Plagal', chords: ['IV', 'I'] },
	{ name: 'Deceptive', chords: ['V', 'VI'] },
	{ name: 'Half', chords: ['I', 'V'] },
	{ name: 'Italian', chords: ['IV', 'V', 'I'] },
	{ name: 'German', chords: ['II', 'V', 'I'] },
	{ name: 'Phrygian', chords: ['IV', 'V', 'III'] }
];

/** Ordre des notes tonales fondamentales (utilisé pour conversion en chiffres romains). */
export const rootNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Qualités d'accords groupées par catégorie (mode, altérations, suspensions, septièmes).
 */
export const qualities = {
	mode: ['maj', 'min'],
	augDim: ['aug', 'dim'],
	sus: ['sus4', 'sus2'],
	sept: ['7', '5']
};

/** Symboles d'altération supportés (dièse, bémol, naturel). */
export const modifiers = ['♯', '♭', '♮'];

/**
 * Options d'armure (alterations) : chaque objet contient la valeur d'altération
 * et le nom de la tonalité associée.
 */
export const armorOptions = [
	{ value: '', name: 'C' },
	{ value: '1♯', name: 'G' },
	{ value: '2♯', name: 'D' },
	{ value: '3♯', name: 'A' },
	{ value: '4♯', name: 'E' },
	{ value: '5♯', name: 'B' },
	{ value: '6♯', name: 'F♯' },
	{ value: '7♯', name: 'C♯' },
	{ value: '1♭', name: 'F' },
	{ value: '2♭', name: 'B♭' },
	{ value: '3♭', name: 'E♭' },
	{ value: '4♭', name: 'A♭' },
	{ value: '5♭', name: 'D♭' },
	{ value: '6♭', name: 'G♭' },
	{ value: '7♭', name: 'C♭' }
];

/** Tableau des modes musicaux diatoniques courants. */
export const modes = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
