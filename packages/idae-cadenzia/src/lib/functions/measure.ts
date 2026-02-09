import type { ChordEntry, TimeSignature } from '$lib/types/types';

/**
 * Convert a duration string into a numeric value (e.g. '1/4' -> 0.25).
 * Accepts integers or fractions in the form 'numerator/denominator'.
 *
 * @param duration - Duration string (e.g. '1', '1/4')
 * @returns Numeric value representing the fraction of a measure
 */
export function getDurationValue(duration: string): number {
  const parts = duration.split('/').map(Number);
  if (parts.length === 1) return parts[0];
  const [numerator, denominator] = parts;
  return denominator ? numerator / denominator : numerator;
}

/**
 * Compute and return a new list of entries with `measureInfo` populated for
 * each entry. This function does not mutate the original input (returns a deep copy).
 *
 * @param entries - Array of chord entries to process
 * @param defaultTimeSignature - Default time signature used when none is provided
 * @returns New array of entries with calculated `measureInfo`
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
