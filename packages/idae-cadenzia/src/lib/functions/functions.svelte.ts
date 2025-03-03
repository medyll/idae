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

function getDurationValue(duration: string): number {
	const [numerator, denominator] = duration.split('/').map(Number);
	return denominator ? numerator / denominator : numerator;
}

export function updateMeasureInfo() {
	let currentMeasure = 1;
	let currentBeat = 0;
	let currentTimeSignature = { numerator: 4, denominator: 4 };

	for (let i = 0; i < chordEntries.length; i++) {
		const entry = chordEntries[i];

		if (entry.timeSignature) {
			currentTimeSignature = entry.timeSignature;
			if (currentBeat > 0) {
				currentMeasure++;
				currentBeat = 0;
			}
		}

		const chordDuration = getDurationValue(entry.chord.duration);
		const beatsPerMeasure = currentTimeSignature.numerator;

		const measureStart = currentMeasure;
		const beatStart = currentBeat;

		currentBeat += chordDuration * beatsPerMeasure;
		while (currentBeat >= beatsPerMeasure) {
			currentMeasure++;
			currentBeat -= beatsPerMeasure;
		}

		chordEntries[i] = {
			...entry,
			measureInfo: {
				start: measureStart,
				end: currentMeasure,
				beatStart: beatStart
			}
		};
	}
}

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

export function updateChordEntry(index: number, updatedEntry: Partial<ChordEntry>) {
	if (index >= 0 && index < chordEntries.length) {
		chordEntries[index] = { ...chordEntries[index], ...updatedEntry };
		updateCadences();
	}
}

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
