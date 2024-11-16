<!-- components/ChordTable.svelte -->
<script lang="ts">
	import {
		qualities,
		armorOptions,
		modes,
		rootNotes,
		modifiers
	} from '$lib/constants/constants.js';
	import { getScaleNotes, isChordInScale } from '$lib/functions/rules.js';

	import type { ChordEntry } from '$lib/types/types.js';
	import { chordEntries, updateCadences, toggleModifier } from '../functions/functions.svelte.js';

	function addChordEntry() {
		chordEntries.push({
			chord: { root: 'C', quality: qualities.mode[0], modifier: undefined, duration: '1' },
			timeSignature: chordEntries.length === 0 ? { numerator: 4, denominator: 4 } : undefined,
			armor: '',
			mode: undefined
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

	function isNoteInScale(note: string, entry: ChordEntry): boolean {
		const scaleNotes = getScaleNotes(entry.armor);
		return scaleNotes.includes(note);
	}

	function isChordValid(entry: ChordEntry): boolean {
		return isChordInScale(entry);
	}
</script>

<table>
	<thead>
		<tr>
			<th>Measure</th>
			<th>Time Signature</th>
			<th>Armor</th>
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
				<td class="timeSignature">
					{#if entry.timeSignature}
						<input type="number" bind:value={entry.timeSignature.numerator} min="1" max="32" />
						/
						<input type="number" bind:value={entry.timeSignature.denominator} min="1" max="32" />
					{:else}
						<button onclick={() => toggleTimeSignature(i)}>Add Time Signature</button>
					{/if}
				</td>
				<td>
					<div>
						<label for="armor-{i}">Armor:</label>
						<select id="armor-{i}" bind:value={entry.armor} onchange={handleChordChange}>
							{#each armorOptions as armor}
								<option value={armor.name}>
									{armor.name}
									{armor.value ? `(${armor.value})` : ''}
								</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="mode-{i}">Mode:</label>
						<select id="mode-{i}" bind:value={entry.mode} onchange={handleChordChange}>
							<option value={undefined}>Select mode</option>
							{#each modes as mode}
								<option value={mode}>{mode}</option>
							{/each}
						</select>
					</div>
				</td>
				<td>
					<select bind:value={entry.chord.root} onchange={handleChordChange}>
						{#each rootNotes as note}
							<option value={note} class:not-in-scale={!isChordValid({...entry, chord: {...entry.chord, root: note}})}>
								{note}
							</option>
						{/each}
					</select>
				</td>
				<td>
					{#each Object.entries(qualities) as [group, qualityOptions]}
						<div>
							{#each qualityOptions as quality}
								<label class:not-in-scale={!isChordValid({...entry, chord: {...entry.chord, quality}})}>
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
						<label class:not-in-scale={!isChordValid({...entry, chord: {...entry.chord, modifier}})}>
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
				<td class="duration">
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
		text-align: center;
	}
	td.timeSignature {
		& input[type='number'] {
			width: 40px;
			text-align: center;
		}

		& button {
			padding: 5px 10px;
			background-color: #f0f0f0;
			border: 1px solid #ccc;
			border-radius: 3px;
		}
	}

	td.duration {
		& input[type='text'] {
			width: 60px;
			text-align: center;
		}
	}
	th {
		background-color: #f2f2f2;
	}
	select,
	input[type='text'],
	input[type='number'] {
		width: 100%;
	}

	option.not-in-scale {
		color: red;
	}

	label.not-in-scale {
		color: red;
	}
</style>
