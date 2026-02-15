import type { Chord } from '$lib/types/types';

/**
 * Toggle a `modifier` on a given `Chord`.
 * If the modifier is already present it will be removed, otherwise it will be applied.
 *
 * @param chord - The chord to modify
 * @param modifier - Accidental symbol to toggle (e.g. '♯')
 * @returns A new `Chord` object with the updated modifier (immutable)
 */
export function toggleModifierOnChord(chord: Chord, modifier: string): Chord {
  return { ...chord, modifier: chord.modifier === modifier ? undefined : modifier };
}

export default { toggleModifierOnChord };
