<!--
Planning.svelte — day/week/month period view for a single collection.
The start/end fields come from appscheme.timespan. Records can be opened,
created on a day, or shifted while preserving their duration.
-->
<script module lang="ts">
	export type PlanningView = 'day' | 'week' | 'month';

	export const PLANNING_VIEW_LABELS: Record<PlanningView, string> = {
		day: 'Jour',
		week: 'Semaine',
		month: 'Mois'
	};
	export const PLANNING_VIEWS = ['day', 'week', 'month'] as const;

	export function planningDays(cursor: Date, mode: PlanningView): Date[] {
		if (mode === 'day') return [new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())];
		if (mode === 'week') {
			const start = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
			const mondayOffset = (start.getDay() + 6) % 7;
			start.setDate(start.getDate() - mondayOffset);
			return Array.from({ length: 7 }, (_, index) =>
				new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
			);
		}
		const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
		return Array.from({ length: count }, (_, index) =>
			new Date(cursor.getFullYear(), cursor.getMonth(), index + 1)
		);
	}

	export function shiftPlanningCursor(cursor: Date, mode: PlanningView, direction: -1 | 1): Date {
		const next = new Date(cursor);
		if (mode === 'day') next.setDate(next.getDate() + direction);
		else if (mode === 'week') next.setDate(next.getDate() + direction * 7);
		else next.setMonth(next.getMonth() + direction);
		return next;
	}

	export function shiftDateValue(value: unknown, days: number): unknown {
		if (value == null || value === '') return value;
		const parsed = new Date(value as string);
		if (Number.isNaN(parsed.getTime())) return value;
		parsed.setDate(parsed.getDate() + days);
		if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const year = parsed.getFullYear();
			const month = String(parsed.getMonth() + 1).padStart(2, '0');
			const day = String(parsed.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		}
		return parsed.toISOString();
	}
</script>

<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import Icon from '@iconify/svelte';

	let { collection }: { collection: string } = $props();

	const appschemeStore = machine.store<{
		code: string;
		timespan?: { start: string; end: string };
	}>('appscheme');
	const timespan = $derived(appschemeStore.records.find((scheme) => scheme.code === collection)?.timespan);
	const recordsStore = $derived(machine.store<Record<string, unknown>>(collection));
	const collLogic = $derived(machine.logic.collection(collection));

	let mode = $state<PlanningView>('month');
	let cursor = $state<Date | null>(null);
	let draggedRecord = $state<Record<string, unknown> | null>(null);
	let feedback = $state('');

	function parseDate(value: unknown): Date | null {
		if (value == null || value === '') return null;
		const parsed = new Date(value as string);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	}

	function dayIndex(date: Date): number {
		return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
	}

	function initialCursor(): Date {
		const start = timespan?.start;
		if (!start) return new Date();
		const dates = recordsStore.records
			.map((record) => parseDate(record[start]))
			.filter((date): date is Date => date != null)
			.sort((left, right) => left.getTime() - right.getTime());
		return dates.length ? dates[Math.floor(dates.length / 2)] : new Date();
	}

	const activeCursor = $derived(cursor ?? initialCursor());
	const days = $derived(planningDays(activeCursor, mode));
	const periodLabel = $derived.by(() => {
		if (mode === 'day') {
			return activeCursor.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
		}
		if (mode === 'week') {
			const first = days[0];
			const last = days.at(-1) ?? first;
			return `${first.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – ${last.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
		}
		return activeCursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
	});

	function recordLabel(record: Record<string, unknown>): string {
		return collLogic?.collectionValues.presentation(record) || String(record.code ?? record.id ?? '—');
	}

	type Bar = {
		record: Record<string, unknown>;
		label: string;
		columnStart: number;
		columnSpan: number;
	};

	const bars = $derived.by((): Bar[] => {
		if (!timespan || !days.length) return [];
		const first = dayIndex(days[0]);
		const last = dayIndex(days.at(-1) ?? days[0]);
		const visible: Bar[] = [];
		for (const record of recordsStore.records) {
			const start = parseDate(record[timespan.start]);
			const end = parseDate(record[timespan.end]) ?? start;
			if (!start || !end) continue;
			const startIndex = dayIndex(start);
			const endIndex = dayIndex(end);
			if (endIndex < first || startIndex > last) continue;
			const columnStart = Math.max(startIndex, first) - first + 1;
			const columnEnd = Math.min(endIndex, last) - first + 1;
			visible.push({
				record,
				label: recordLabel(record),
				columnStart,
				columnSpan: Math.max(1, columnEnd - columnStart + 1)
			});
		}
		return visible.sort((left, right) => left.columnStart - right.columnStart);
	});

	function move(direction: -1 | 1): void {
		cursor = shiftPlanningCursor(activeCursor, mode, direction);
	}

	function goToday(): void {
		cursor = new Date();
	}

	function selectMode(next: PlanningView): void {
		mode = next;
		cursor = new Date(activeCursor);
	}

	function openRecord(record: Record<string, unknown>): void {
		void machine.framer.loadInDialog('fiche', collection, record.id as number);
	}

	function createOn(day: Date): void {
		if (!timespan) return;
		const value = String(
			shiftDateValue(
			`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`,
			0
			)
		);
		void machine.framer.loadInDialog('form', collection, undefined, {
			vars: { [`vars[${timespan.start}]`]: value }
		});
	}

	function beginDrag(event: DragEvent, record: Record<string, unknown>): void {
		draggedRecord = record;
		event.dataTransfer?.setData('text/plain', String(record.id ?? record.code ?? ''));
		if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
	}

	async function dropOn(day: Date): Promise<void> {
		const record = draggedRecord;
		draggedRecord = null;
		if (!timespan || !record) return;
		const start = parseDate(record[timespan.start]);
		if (!start) return;
		const offset = dayIndex(day) - dayIndex(start);
		if (!offset) return;
		feedback = `Déplacement de ${recordLabel(record)}…`;
		try {
			await machine.collection(collection).update(record.id as never, {
				[timespan.start]: shiftDateValue(record[timespan.start], offset),
				[timespan.end]: shiftDateValue(record[timespan.end], offset)
			});
			feedback = `${recordLabel(record)} déplacé de ${offset} jour${Math.abs(offset) > 1 ? 's' : ''}.`;
		} catch (error) {
			feedback = error instanceof Error ? error.message : 'Le déplacement a échoué.';
		}
	}

	const isToday = (day: Date) => dayIndex(day) === dayIndex(new Date());
	const isWeekend = (day: Date) => day.getDay() === 0 || day.getDay() === 6;
</script>

<planning-component>
	{#if !timespan}
		<planning-empty>
			<Icon icon="ph:calendar-x" class="planning-empty-icon" />
			<p><strong>{collection}</strong> n'a pas de période (timespan).</p>
			<p class="planning-empty-hint">Une collection planifiable a une paire de champs date/heure début→fin.</p>
		</planning-empty>
	{:else}
		<planning-toolbar>
			<button type="button" class="btn-icon" aria-label="Période précédente" onclick={() => move(-1)}>
				<Icon icon="ph:caret-left" />
			</button>
			<button type="button" class="planning-today" onclick={goToday}>Aujourd'hui</button>
			<button type="button" class="btn-icon" aria-label="Période suivante" onclick={() => move(1)}>
				<Icon icon="ph:caret-right" />
			</button>
			<planning-period>{periodLabel}</planning-period>
			<planning-view-switch aria-label="Échelle du planning">
				{#each PLANNING_VIEWS as viewMode (viewMode)}
					<button
						type="button"
						class="planning-view"
						class:active={mode === viewMode}
						onclick={() => selectMode(viewMode as PlanningView)}
					>
						{PLANNING_VIEW_LABELS[viewMode]}
					</button>
				{/each}
			</planning-view-switch>
			<span class="planning-count">{bars.length} / {recordsStore.records.length}</span>
		</planning-toolbar>

		{#if feedback}<planning-feedback aria-live="polite">{feedback}</planning-feedback>{/if}

		<planning-grid style:--planning-days={days.length}>
			<planning-axis>
				{#each days as day (day.getTime())}
					<planning-day
						role="button"
						tabindex="0"
						class:is-today={isToday(day)}
						class:is-weekend={isWeekend(day)}
						ondblclick={() => createOn(day)}
						onkeydown={(event: KeyboardEvent) => {
							if (event.key === 'Enter') createOn(day);
						}}
						ondragover={(event: DragEvent) => event.preventDefault()}
						ondrop={() => void dropOn(day)}
						title={`${day.toLocaleDateString('fr-FR')} — double-clic pour créer`}
					>
						<span class="planning-day-num">{day.getDate()}</span>
						<span class="planning-day-dow">{day.toLocaleDateString('fr-FR', { weekday: 'narrow' })}</span>
					</planning-day>
				{/each}
			</planning-axis>

			<planning-lanes>
				{#each bars as bar (bar.record.id ?? bar.record.code)}
					<planning-lane>
						<button
							type="button"
							class="planning-bar"
							style:grid-column={`${bar.columnStart} / span ${bar.columnSpan}`}
							draggable="true"
							ondragstart={(event) => beginDrag(event, bar.record)}
							ondragend={() => (draggedRecord = null)}
							onclick={() => openRecord(bar.record)}
							title={`${bar.label} — glisser pour déplacer`}
						>
							{bar.label}
						</button>
					</planning-lane>
				{:else}
					<planning-lane>
						<span class="planning-empty-row">Aucun enregistrement sur cette période.</span>
					</planning-lane>
				{/each}
			</planning-lanes>
		</planning-grid>
	{/if}
</planning-component>

<style>
	@layer components {
		planning-component {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;
			background: var(--color-surface);
			color: var(--color-text);
		}

		planning-toolbar {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			padding: var(--pad-sm) var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
			flex-wrap: wrap;
		}
		planning-period {
			display: inline;
			font-weight: var(--font-semibold);
			text-transform: capitalize;
		}
		planning-view-switch {
			display: inline-flex;
			gap: var(--gutter-xs);
			margin-left: auto;
		}
		planning-feedback {
			display: block;
			padding: var(--pad-xs) var(--pad-md);
			background: var(--color-surface-active);
			color: var(--color-text);
			font-size: var(--text-sm);
		}
		.planning-today,
		.planning-view {
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-sm);
			background: var(--color-surface-raised);
			cursor: pointer;
			color: var(--color-text);
			font-size: var(--text-sm);
			&:hover { background: var(--color-surface-hover); }
			&.active {
				background: var(--color-surface-active);
				border-color: var(--color-primary);
				color: var(--color-primary);
			}
		}
		.planning-count {
			font-size: var(--text-sm);
			color: var(--color-text-muted);
		}

		planning-grid {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-height: 0;
			overflow: auto;
		}
		planning-axis {
			display: grid;
			grid-template-columns: repeat(var(--planning-days), minmax(var(--gutter-xl), 1fr));
			position: sticky;
			top: 0;
			z-index: var(--z-dropdown);
			background: var(--color-surface-alt);
			border-bottom: var(--border-width) solid var(--color-border);
		}
		planning-day {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: var(--pad-xs) 0;
			font-size: var(--text-xs);
			border-right: var(--border-width) solid var(--color-border);
			cursor: pointer;
			&.is-weekend { background: var(--color-surface-sunken); }
			&.is-today {
				background: color-mix(in oklch, var(--color-primary) 18%, transparent);
				font-weight: var(--font-semibold);
			}
			&:hover { background: var(--color-surface-hover); }
		}
		.planning-day-dow {
			color: var(--color-text-muted);
			text-transform: uppercase;
		}

		planning-lanes {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding: var(--pad-xs) 0;
		}
		planning-lane {
			display: grid;
			grid-template-columns: repeat(var(--planning-days), minmax(var(--gutter-xl), 1fr));
			min-height: calc(var(--gutter-md) + var(--gutter-sm));
		}
		.planning-bar {
			all: unset;
			display: flex;
			align-items: center;
			padding: 0 var(--pad-sm);
			min-height: calc(var(--gutter-md) + var(--gutter-sm));
			border-radius: var(--radius-full);
			background: var(--color-primary);
			color: var(--default-color-surface-light);
			font-size: var(--text-xs);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			cursor: grab;
			&:hover { background: color-mix(in oklch, var(--color-primary), black 10%); }
			&:active { cursor: grabbing; }
		}
		.planning-empty-row {
			grid-column: 1 / -1;
			padding: var(--pad-sm);
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}

		planning-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--gutter-sm);
			height: 100%;
			color: var(--color-text-muted);
			text-align: center;
		}
		planning-empty :global(.planning-empty-icon) { font-size: var(--text-3xl); }
		.planning-empty-hint { font-size: var(--text-sm); }
	}
</style>
