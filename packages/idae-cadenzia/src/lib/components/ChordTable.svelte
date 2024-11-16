<!-- components/ChordTable.svelte -->
<script lang="ts">
	import {
		chordEntries,
		updateCadences,
		qualities,
		rootNotes,
		modifiers,
		toggleModifier
	} from '../functions/functions.svelte.js'; 

	function addChordEntry() {
		chordEntries.push({
			chord: { root: 'C', quality: qualities.mode[0], modifier: undefined, duration: '1' },
			timeSignature: chordEntries.length === 0 ? { numerator: 4, denominator: 4 } : undefined
		});
		updateCadences();
	}

	function removeChordEntry(index: number) {
		chordEntries.splice(index, 1);
		updateCadences();
	}

	function handleChordChange() {
		updateCadences();
	}

	function toggleTimeSignature(index: number) {
		if (chordEntries[index].timeSignature) {
			chordEntries[index].timeSignature = undefined;
		} else {
			chordEntries[index].timeSignature = { numerator: 4, denominator: 4 };
		}
	}
</script>

<table>
	<thead>
		<tr>
			<th>Measure</th>
			<th>Time Signature</th>
			<th>Root</th>
			<th>Quality</th>
			<th>Modifier</th>
			<th>Duration</th>
			<th>Action</th>
		</tr>
	</thead>
	<tbody>
		{#each chordEntries as entry, i}
			<tr>
				<td>{i + 1}</td>
				<td>
					{#if entry.timeSignature}
						<input type="number" bind:value={entry.timeSignature.numerator} min="1" max="32" />
						/
						<input type="number" bind:value={entry.timeSignature.denominator} min="1" max="32" />
					{:else}
						<button onclick={() => toggleTimeSignature(i)}>Add Time Signature</button>
					{/if}
				</td>
				<td>
					<select bind:value={entry.chord.root} onchange={handleChordChange}>
						{#each rootNotes as note}
							<option value={note}>{note}</option>
						{/each}
					</select>
				</td>
				<td>
					{#each Object.entries(qualities) as [group, qualityOptions]}
						<div>
							{#each qualityOptions as quality}
								<label>
									<input
										type="radio"
										name={`quality-${group}-${i}`}
										value={quality}
										checked={entry.chord[group] === quality}
										onchange={() => {
											entry.chord[group] = quality;
											entry.chord.quality = quality;
											handleChordChange();
										}}
									/>
									{quality}
								</label>
							{/each}
						</div>
						<hr />
					{/each}
				</td>
				<td>
					{#each modifiers as modifier}
						<label>
							<input
								type="radio"
								name={`modifier-${i}`}
								value={modifier}
								checked={entry.chord.modifier === modifier}
								onchange={() => toggleModifier(i, modifier)}
							/>
							{modifier}
						</label>
					{/each}
				</td>
				<td>
					<input
						type="text"
						bind:value={entry.chord.duration}
						onchange={handleChordChange}
						placeholder="e.g., 1, 1/2, 3/4"
					/>
				</td>
				<td>
					<button onclick={() => removeChordEntry(i)}>Remove</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<button onclick={addChordEntry}>Add Chord</button>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1em;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}
	th {
		background-color: #f2f2f2;
	}
	select,
	input[type='text'],
	input[type='number'] {
		width: 100%;
	}
</style>
