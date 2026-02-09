import type { Chord } from '$lib/types/types';

/**
 * Active/désactive un `modifier` sur un `Chord` donné.
 * Si le modifier est déjà présent il est supprimé, sinon il est appliqué.
 *
 * @param chord - Accord à modifier
 * @param modifier - Symbole d'altération à basculer (ex: '♯')
 * @returns Nouveau `Chord` mis à jour (immutabilité)
 */
export function toggleModifierOnChord(chord: Chord, modifier: string): Chord {
  return { ...chord, modifier: chord.modifier === modifier ? undefined : modifier };
}

export default { toggleModifierOnChord };
