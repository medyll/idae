// functions/functions.svelte.ts
import { rootNotes, cadencePatterns, armorOptions } from '$lib/constants/constants.js';
import type { Chord, Cadence, ChordEntry } from '$lib/types/types';

export const chords = $state<Chord[]>([]);
export const suggestedCadences = $state<Cadence[]>([]);
export const chordEntries = $state<ChordEntry[]>([]);

export function updateCadences() {
	console.log('Current Chords:', $state.snapshot({ chords }));

	if (chordEntries.length === 0) {
		suggestedCadences.length = 0;
		console.log('No chords, no suggestions');
		return;
	}

	const lastEntry = chordEntries[chordEntries.length - 1];
	const lastChordMode = lastEntry.mode;

	const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
	const lastChord = chordEntries[chordEntries.length - 1].chord;

	const rootIndex = rootNotes.indexOf(lastChord.root.toUpperCase());
	let lastChordRoman = rootIndex !== -1 ? romanNumerals[rootIndex] : null;

	if (lastChord.modifier === '♯') {
		lastChordRoman += '#';
	} else if (lastChord.modifier === '♭') {
		lastChordRoman += 'b';
	}

	console.log('Last Chord Roman:', lastChordRoman);

	const suggestions = cadencePatterns.filter((cadence) => {
		return cadence.chords[0] === lastChordRoman;
	});

	suggestedCadences.length = 0;
	suggestedCadences.push(...suggestions);

	console.log('Suggested Cadences:', $state.snapshot({ suggestedCadences }));
}

export function toggleModifier(chordIndex: number, modifier: string) {
	const chord = chordEntries[chordIndex].chord;
	chord.modifier = chord.modifier === modifier ? undefined : modifier;
	updateCadences();
}

export function getArmorInfo(armorName: string) {
	const armor = armorOptions.find((a) => a.name === armorName);
	return armor ? `${armor.name}${armor.value ? ` (${armor.value})` : ''}` : '';
}
