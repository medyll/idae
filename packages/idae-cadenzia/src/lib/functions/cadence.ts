import type { ChordEntry, Cadence } from '$lib/types/types';
import { cadencePatterns, rootNotes } from '$lib/constants/constants.js';

/**
 * Convert a chord root and optional accidental into a roman numeral
 * representation for harmonic analysis (e.g. 'C' -> 'I', 'G' -> 'V').
 *
 * @param chordRoot - The root note name (e.g. 'C')
 * @param modifier - Optional accidental ('♯' | '♭')
 * @returns The corresponding roman numeral (e.g. 'V') or `null` if unknown
 */
export function chordToRoman(chordRoot: string, modifier?: string) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const rootIndex = rootNotes.indexOf(chordRoot.toUpperCase());
  let roman = rootIndex !== -1 ? romanNumerals[rootIndex] : null;
  if (!roman) return null;
  if (modifier === '♯') roman += '#';
  else if (modifier === '♭') roman += 'b';
  return roman;
}

/**
 * Suggests possible cadences from the provided chord entries.
 * Suggestions are based on the last chord in the progression.
 *
 * @param entries - Array of chord entries (progression)
 * @param patterns - Optional: cadence patterns to match against
 * @returns Array of matching cadences
 */
export function suggestCadencesFromEntries(entries: ChordEntry[], patterns: Cadence[] = cadencePatterns) {
  if (!entries || entries.length === 0) return [] as Cadence[];
  const lastEntry = entries[entries.length - 1];
  const lastChord = lastEntry.chord;
  const lastChordRoman = chordToRoman(lastChord.root, lastChord.modifier);
  if (!lastChordRoman) return [] as Cadence[];
  return patterns.filter((p) => p.chords[0] === lastChordRoman);
}

export default { chordToRoman, suggestCadencesFromEntries };
