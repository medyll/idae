<!-- components/ChordVisualization.svelte -->
<script lang="ts">
	import { chordEntries } from '$lib/functions/functions.svelte';
	import type { ChordEntry } from '$lib/types/types';

	function getChordName(entry: ChordEntry) {
		const { chord } = entry;
		let name = chord.root;

		if (chord.modifier) {
			name += chord.modifier;
		}

		name += chord.mode ?? '';
		name += chord.augDim ?? '';
		name += chord.sus ?? '';
		name += chord.sept ?? '';

		return name;
	}

	function getDurationValue(duration: string): number {
		if (duration.includes('/')) {
			const [numerator, denominator] = duration.split('/').map(Number);
			return numerator / denominator;
		}
		return Number(duration);
	}
</script>

<div class="visualization">
	<h3>Chord Visualization</h3>
	{#if chordEntries.length === 0}
		<p>No chords to visualize.</p>
	{:else}
		<div class="chord-sequence">
			{#each chordEntries as entry, i}
				{#if entry.timeSignature}
					<div class="signature">
						- Signature: {entry.timeSignature.numerator}/{entry.timeSignature.denominator}
					</div>
				{/if}
				<div 
					class="chord" 
					style="--baseTime:{getDurationValue(entry.chord.duration)}"
				>
					<span>{getChordName(entry)}</span>
					<span>{entry.chord.duration}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.visualization {
		margin-top: 20px;
		padding: 10px;
		background-color: #e0e0e0;
	}
	.signature {
		flex-basis: 100%;
		width: 100%;
	}
	.chord-sequence {
		display: flex;
		flex-wrap: wrap;
		gap: 10px; /* Space between chords */
	}
	.chord {
		padding: 10px;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
		text-align: center;
		width: calc(200px * var(--baseTime, 1));
		min-width: 30px; /* Ensure a minimum width for very short durations */
		max-width: 100%; /* Prevent oversized chords */
	}
</style>