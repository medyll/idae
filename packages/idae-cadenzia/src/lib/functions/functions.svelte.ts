// functions/functions.svelte.ts
import type { Chord, Cadence, ChordEntry } from '$lib/types/types';
import { suggestCadencesFromEntries } from '$lib/functions/cadence.js';
import { getArmorInfo } from '$lib/functions/armor.js';
import { computeMeasureInfos } from '$lib/functions/measure.js';
import { toggleModifierOnChord } from '$lib/functions/modifiers.js';

/**
 * Reactive list of current chords (Svelte `$state`).
 * Type: `Chord[]`
 */
export const chords = $state<Chord[]>([]);

/**
 * Reactive list of suggested cadences (updated by `updateCadences`).
 * Type: `Cadence[]`
 */
export const suggestedCadences = $state<Cadence[]>([]);

/**
 * Reactive list of `ChordEntry` objects representing the current progression.
 */
export const chordEntries = $state<ChordEntry[]>([]);

/**
 * Update `suggestedCadences` based on the last `ChordEntry`.
 * Uses `suggestCadencesFromEntries` for pure logic.
 */
export function updateCadences() {
	console.log('Current Chords:', $state.snapshot({ chords }));

	if (chordEntries.length === 0) {
		suggestedCadences.length = 0;
		console.log('No chords, no suggestions');
		return;
	}

	const lastEntry = chordEntries[chordEntries.length - 1];
	const lastChordMode = lastEntry.mode;

	const suggestions = suggestCadencesFromEntries(chordEntries);
	suggestedCadences.length = 0;
	suggestedCadences.push(...suggestions);

	console.log('Suggested Cadences:', $state.snapshot({ suggestedCadences }));
}

/**
 * Toggle a `modifier` on the chord at `chordIndex` and recompute suggestions.
 * (This has a side-effect on the reactive `chordEntries`.)
 *
 * @param chordIndex - Index of the chord entry to modify
 * @param modifier - Accidental symbol to toggle
 */
export function toggleModifier(chordIndex: number, modifier: string) {
	const chord = chordEntries[chordIndex].chord;
	chordEntries[chordIndex].chord = toggleModifierOnChord(chord, modifier);
	updateCadences();
}

/**
 * Wrapper around `getArmorInfo` exposing a function usable from Svelte components.
 *
 * @param armorName - Name of the key/armor
 */
export function getArmorInfoWrapper(armorName: string) {
	return getArmorInfo(armorName);
}
/**
 * Update `measureInfo` for all `chordEntries` using `computeMeasureInfos` (pure helper).
 */
export function updateMeasureInfo() {
	const updated = computeMeasureInfos(chordEntries);
	// copy back into reactive state
	chordEntries.length = 0;
	chordEntries.push(...updated);
}
/**
 * Add a default progression entry and update suggestions.
 */
export function addChordEntry() {
	const newEntry = {
		chord: { root: 'C', quality: 'maj', modifier: undefined, duration: '1' },
		timeSignature: chordEntries.length === 0 ? { numerator: 4, denominator: 4 } : undefined,
		armor: '',
		measureInfo: { start: 1, end: 1, beatStart: 0 }
	};
	chordEntries.push(newEntry);
	updateCadences();
}

/**
 * Replace the entry at `index` with an updated version (merges properties) and recompute suggestions.
 */
export function updateChordEntry(index: number, updatedEntry: Partial<ChordEntry>) {
	if (index >= 0 && index < chordEntries.length) {
		chordEntries[index] = { ...chordEntries[index], ...updatedEntry };
		updateCadences();
	}
}

/**
 * Apply incremental changes to the chord entry at `index`.
 * Handles sub-fields `chord`, `timeSignature`, `armor`, and `mode`.
 */
export function handleChordChange(index: number, changes: Partial<ChordEntry>) {
	if (index >= 0 && index < chordEntries.length) {
		const currentEntry = chordEntries[index];
		const updatedEntry: ChordEntry = { ...currentEntry };

		if (changes.chord) {
			updatedEntry.chord = { ...currentEntry.chord, ...changes.chord };
		}
		if (changes.timeSignature) {
			updatedEntry.timeSignature = changes.timeSignature;
		}
		if (changes.armor !== undefined) {
			updatedEntry.armor = changes.armor;
		}
		if (changes.mode !== undefined) {
			updatedEntry.mode = changes.mode;
		}

		chordEntries[index] = updatedEntry;
		updateCadences();
	}
}
