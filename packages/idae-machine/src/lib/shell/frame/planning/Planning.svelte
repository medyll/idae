<!--
Planning.svelte — period view for a single collection (registry key `planning`).
Inspired by idae-legacy's task planning: a month grid with day columns; each
record is laid out as a bar spanning its timespan (start → end). The start/end
fields come from `appscheme.timespan` (see SCHEMA-CONVENTIONS §9) — a collection
without a timespan cannot be planned and renders an empty state.

Receives `collection` as its frame parameter. Reads records via machine.store
(reactive). Click a bar → open the record fiche; double-click a day → create.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import Icon from '@iconify/svelte';

	let { collection }: { collection: string } = $props();

	// ── timespan qualifier from appscheme ────────────────────────────────────
	const appschemeStore = machine.store<{ code: string; timespan?: { start: string; end: string } }>('appscheme');
	const timespan = $derived(
		appschemeStore.records.find((s) => s.code === collection)?.timespan
	);

	// ── records ──────────────────────────────────────────────────────────────
	// Per-collection frame: wrap the store read in $derived so `collection` is a
	// reactive dependency (mirrors Synthesis.svelte, the golden per-collection frame).
	const recordsStore = $derived(machine.store<Record<string, unknown>>(collection));
	const collLogic = $derived(machine.logic.collection(collection));

	function recordLabel(rec: Record<string, unknown>): string {
		return collLogic?.collectionValues.presentation(rec) || String(rec.code ?? rec.id ?? '—');
	}

	// ── month cursor ─────────────────────────────────────────────────────────
	// Anchor on the month with the most records so the view opens on real data.
	function initialCursor(): { year: number; month: number } {
		const start = timespan?.start;
		let ref = new Date();
		if (start) {
			const dates = recordsStore.records
				.map((r) => parseDate(r[start]))
				.filter((d): d is Date => d != null)
				.sort((a, b) => a.getTime() - b.getTime());
			if (dates.length) ref = dates[Math.floor(dates.length / 2)];
		}
		return { year: ref.getFullYear(), month: ref.getMonth() };
	}

	let cursor = $state<{ year: number; month: number } | null>(null);
	const view = $derived(cursor ?? initialCursor());

	function parseDate(v: unknown): Date | null {
		if (v == null || v === '') return null;
		const d = new Date(v as string);
		return Number.isNaN(d.getTime()) ? null : d;
	}
	/** Whole-day index (UTC midnight) so day math ignores time-of-day. */
	function dayIndex(d: Date): number {
		return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
	}

	const days = $derived.by(() => {
		const count = new Date(view.year, view.month + 1, 0).getDate();
		return Array.from({ length: count }, (_, i) => new Date(view.year, view.month, i + 1));
	});
	const monthLabel = $derived(
		new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(
			new Date(view.year, view.month, 1)
		)
	);

	// ── bars: one lane per record, clamped to the visible month ───────────────
	type Bar = { rec: Record<string, unknown>; label: string; colStart: number; colSpan: number };
	const bars = $derived.by((): Bar[] => {
		if (!timespan) return [];
		const first = dayIndex(new Date(view.year, view.month, 1));
		const last = dayIndex(new Date(view.year, view.month, days.length));
		const out: Bar[] = [];
		for (const rec of recordsStore.records) {
			const s = parseDate(rec[timespan.start]);
			const e = parseDate(rec[timespan.end]) ?? s;
			if (!s || !e) continue;
			const si = dayIndex(s), ei = dayIndex(e);
			if (ei < first || si > last) continue; // outside this month
			const colStart = Math.max(si, first) - first + 1; // 1-based grid column
			const colEnd = Math.min(ei, last) - first + 1;
			out.push({ rec, label: recordLabel(rec), colStart, colSpan: Math.max(1, colEnd - colStart + 1) });
		}
		return out.sort((a, b) => a.colStart - b.colStart);
	});

	function prevMonth(): void {
		const m = view.month - 1;
		cursor = m < 0 ? { year: view.year - 1, month: 11 } : { year: view.year, month: m };
	}
	function nextMonth(): void {
		const m = view.month + 1;
		cursor = m > 11 ? { year: view.year + 1, month: 0 } : { year: view.year, month: m };
	}
	function today(): void {
		const now = new Date();
		cursor = { year: now.getFullYear(), month: now.getMonth() };
	}

	function openRecord(rec: Record<string, unknown>): void {
		machine.framer.loadFrame('fiche', collection, rec.id as number);
	}
	function createOn(day: Date): void {
		if (!timespan) return;
		const iso = day.toISOString().slice(0, 10);
		machine.framer.loadInDialog('form', collection, undefined, { [`vars[${timespan.start}]`]: iso });
	}

	const isToday = (d: Date) => dayIndex(d) === dayIndex(new Date());
	const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
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
			<button type="button" class="btn-icon" aria-label="Mois précédent" onclick={prevMonth}>
				<Icon icon="ph:caret-left" />
			</button>
			<button type="button" class="planning-today" onclick={today}>Aujourd'hui</button>
			<button type="button" class="btn-icon" aria-label="Mois suivant" onclick={nextMonth}>
				<Icon icon="ph:caret-right" />
			</button>
			<span class="planning-month">{monthLabel}</span>
			<span class="planning-count">{bars.length} / {recordsStore.records.length}</span>
		</planning-toolbar>

		<planning-grid style="--planning-days: {days.length};">
			<planning-axis>
				{#each days as day (day.getTime())}
					<planning-day
						role="button"
						tabindex="0"
						class:is-today={isToday(day)}
						class:is-weekend={isWeekend(day)}
						ondblclick={() => createOn(day)}
						title={day.toLocaleDateString('fr-FR')}
					>
						<span class="planning-day-num">{day.getDate()}</span>
						<span class="planning-day-dow">{day.toLocaleDateString('fr-FR', { weekday: 'narrow' })}</span>
					</planning-day>
				{/each}
			</planning-axis>

			<planning-lanes>
				{#each bars as bar (bar.rec.id ?? bar.rec.code)}
					<planning-lane>
						<button
							type="button"
							class="planning-bar"
							style="grid-column: {bar.colStart} / span {bar.colSpan};"
							onclick={() => openRecord(bar.rec)}
							title={bar.label}
						>
							{bar.label}
						</button>
					</planning-lane>
				{:else}
					<planning-lane>
						<span class="planning-empty-row">Aucun enregistrement ce mois-ci.</span>
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
		}
		.planning-today {
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-sm);
			background: var(--color-surface-raised);
			cursor: pointer;
			color: var(--color-text);
		}
		.planning-today:hover { background: var(--color-surface-hover); }
		.planning-month {
			font-weight: var(--font-semibold);
			text-transform: capitalize;
		}
		.planning-count {
			margin-left: auto;
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
			grid-template-columns: repeat(var(--planning-days), minmax(2rem, 1fr));
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
		}
		planning-day.is-weekend { background: var(--color-surface-sunken); }
		planning-day.is-today {
			background: color-mix(in oklch, var(--color-primary) 18%, transparent);
			font-weight: var(--font-semibold);
		}
		planning-day:hover { background: var(--color-surface-hover); }
		.planning-day-dow { color: var(--color-text-muted); text-transform: uppercase; }

		planning-lanes {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding: var(--gutter-xs) 0;
		}
		planning-lane {
			display: grid;
			grid-template-columns: repeat(var(--planning-days), minmax(2rem, 1fr));
			min-height: 1.75rem;
		}
		.planning-bar {
			all: unset;
			display: flex;
			align-items: center;
			padding: 0 var(--pad-sm);
			height: 1.5rem;
			border-radius: var(--radius-full);
			background: var(--color-primary);
			color: var(--color-on-primary, #fff);
			font-size: var(--text-xs);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			cursor: pointer;
		}
		.planning-bar:hover { filter: brightness(1.08); }
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
