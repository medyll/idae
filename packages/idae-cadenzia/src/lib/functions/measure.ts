import type { ChordEntry, TimeSignature } from '$lib/types/types';

/**
 * Convertit une durée donnée en valeur numérique (ex: '1/4' -> 0.25).
 * Accepte des entiers ou des fractions au format 'numerator/denominator'.
 *
 * @param duration - Chaîne de durée (ex: '1', '1/4')
 * @returns Valeur numérique représentant la fraction de mesure
 */
export function getDurationValue(duration: string): number {
  const parts = duration.split('/').map(Number);
  if (parts.length === 1) return parts[0];
  const [numerator, denominator] = parts;
  return denominator ? numerator / denominator : numerator;
}

/**
 * Calcule et renvoie une nouvelle liste d'`entries` avec `measureInfo` rempli
 * pour chaque entrée. La fonction n'altère pas l'entrée d'origine (retourne une
 * copie profonde).
 *
 * @param entries - Tableau d'entrées d'accords à traiter
 * @param defaultTimeSignature - Signature par défaut si aucune fournie
 * @returns Nouveau tableau d'entrées avec `measureInfo` calculé
 */
export function computeMeasureInfos(entries: ChordEntry[], defaultTimeSignature: TimeSignature = { numerator: 4, denominator: 4 }) {
  const out = JSON.parse(JSON.stringify(entries)) as ChordEntry[];
  let currentMeasure = 1;
  let currentBeat = 0;
  let currentTimeSignature = { ...defaultTimeSignature };

  for (let i = 0; i < out.length; i++) {
    const entry = out[i];

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

    out[i].measureInfo = {
      start: measureStart,
      end: currentMeasure,
      beatStart: beatStart
    };
  }

  return out;
}

export default { getDurationValue, computeMeasureInfos };
