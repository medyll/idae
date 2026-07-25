<!--
Space.svelte — collection workspace frame (zone main). Port of the legacy
"Espace <table>" screen (app_explorer.php + app_explorer_home*): scheme header
(icon/name/color, Créer, vues récentes), total, classification breakdown
(statut/type/categorie/groupe — 'END' status excluded from the denominator, as
legacy did), forward-FK cards with orphan counts, reverse-FK "Voir aussi" grouped
by appscheme_type, period counters (mois/semaine), and a search column (free
text + alphabet + FK filters) narrowing the main list.

Mounted via machine.framer.loadFrame('space', collection) — one instance per
collection. Reads via machine.store (reactive); writes via machine.menu.verbs
(machine.action under the hood). Schema (scheme.fks/scheme.fields) is static
post-boot data, read once at setup, like Today.svelte. machine.store() registers
a subscription at call time and must not be re-invoked inside $derived (CLAUDE.md
invariant 10) — the classification/forward-FK option stores are therefore opened
once, in a setup-time loop over the (fixed, per-instance) scheme.fks entries.

Records store a relation either as the nested join snapshot (`record.fks.<name>` =
{id|code}) or as a flat scalar field (`category: "compact"` — what seeded/server data
actually holds). Classification and forward-FK aggregates therefore read through
resolveFkKey, which tries nested then flat (via scheme.findFkField), the same order as
dataRelationUtils.resolveForwardRelations. FkFilter emits its where against whichever
form applies.

A FK is a CLASSIFICATION when its target collection is declared `isStatus`/`isType`/
`isGroup` (see server/src/models/agile/agileScheme.ts for the canonical shape:
`project_status: { isStatus: true }` + `project.fkRelations.project_status`). Those
flags are the house replacement for the legacy `<table>_statut` referential — note the
English `_status` spelling, which publishModel also falls back on by suffix.

They are read from the `appscheme` records, NOT from machine.logic: MachineServer's
getModel() rebuilds the client model from the appscheme docs and does not carry
isStatus/isType/isGroup over, so `machine.logic.collection(x).model.isStatus` is always
undefined client-side. publishModel writes both the flags and the equivalent
`fks.appscheme_type.code` ('status' | 'type' | 'group' | 'standard') onto the doc.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';
	import type { Where } from '$lib/types/index.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import DataCount from '$lib/data-ui/data/DataCount.svelte';
	import Tile from '$lib/data-ui/fragments/Tile.svelte';
	import InfoLine from '$lib/data-ui/fragments/InfoLine.svelte';
	import Find from '$lib/data-ui/controls/Find.svelte';
	import AlphabetFilter from '$lib/data-ui/controls/AlphabetFilter.svelte';
	import FkFilter from '$lib/data-ui/controls/FkFilter.svelte';

	type RecordRow = Record<string, unknown> & {
		id?: unknown;
		fks?: Record<string, { code?: unknown } | undefined>;
	};
	type HistoryRow = {
		id?: unknown;
		collection?: string;
		collection_value?: unknown;
		label?: string;
		count?: number;
		lastSeen?: string;
	};
	type AppschemeRow = {
		code: string;
		name?: string;
		icon?: string;
		color?: string;
		isStatus?: boolean;
		isType?: boolean;
		isGroup?: boolean;
		fks?: { appscheme_type?: { code?: string } };
	};
	type AppschemeTypeRow = { code: string; name?: string };
	type OptionRow = { id?: unknown; code?: unknown; name?: unknown };

	let {
		collection,
		collectionId,
		vars
	}: {
		collection: string;
		collectionId?: string | number;
		vars?: Record<string, string>;
	} = $props();

	const logicScheme = machine.logic.collection(collection);
	const canCreate = machine.rights.checkAccess(collection, 'C');

	// Must stay collection-scoped: dataListPrefsScope() returns the override verbatim,
	// so a bare 'space' would make every collection's Espace share one prefs slot
	// (search/sort/mode bleeding across collections, persisted under a single key).
	const prefsScope = `space.${collection}`;

	// Setup-time subscriptions — see file header.
	const schemeStore = machine.store<AppschemeRow>('appscheme', { code: collection });
	const historyStore = machine.store<HistoryRow>('appuser_history', { collection });
	const mainStore = machine.store<RecordRow>(collection);
	const appschemeAllStore = machine.store<AppschemeRow>('appscheme');
	const appschemeTypeStore = machine.store<AppschemeTypeRow>('appscheme_type');

	const fksEntries = logicScheme ? Object.entries(logicScheme.fks) : [];

	// Records carry an FK either as the nested join snapshot (record.fks.<name> = {id|code})
	// or — as seed/legacy data actually does — as a flat scalar field (e.g. `category: "compact"`).
	// scheme.findFkField resolves the flat field name/index for the fallback; see MachineScheme
	// and dataRelationUtils.resolveForwardRelations, which apply the same nested-then-flat order.
	function resolveFkKey(
		record: RecordRow,
		fkName: string,
		fieldInfo: { fieldName: string; targetIndex: string } | null
	): unknown {
		const nested = record.fks?.[fkName] as { code?: unknown; id?: unknown } | undefined;
		if (nested?.code != null) return nested.code;
		if (nested?.id != null) return nested.id;
		if (fieldInfo) return record[fieldInfo.fieldName];
		return undefined;
	}

	function matchesOption(value: unknown, option: OptionRow): boolean {
		return value != null && (value === option.code || value === option.id);
	}

	/**
	 * Classification kind of an FK target, from its appscheme record. Explicit flags win;
	 * `fks.appscheme_type.code` is the equivalent published form (publishModel derives it
	 * from the same flags, falling back to the `_status`/`_type`/`_group` name suffix).
	 * null = plain relation, rendered as a répartition card instead.
	 */
	function classKind(meta: AppschemeRow | undefined): 'status' | 'type' | 'group' | null {
		if (!meta) return null;
		if (meta.isStatus) return 'status';
		if (meta.isType) return 'type';
		if (meta.isGroup) return 'group';
		const published = meta.fks?.appscheme_type?.code;
		return published === 'status' || published === 'type' || published === 'group'
			? published
			: null;
	}

	// One subscription per declared FK target. The FK set is static, so opening the
	// stores here is setup-safe; which of them counts as a classification is decided
	// reactively below, since it depends on appscheme records loaded after boot.
	const fkStores = fksEntries.map(([fkName, fk]) => ({
		fkName,
		fk,
		fieldInfo: logicScheme?.findFkField(fk.code) ?? null,
		optionsStore: machine.store<OptionRow>(fk.code)
	}));

	const classifiedFks = $derived.by(() => {
		const appschemes = appschemeAllStore.records as AppschemeRow[];
		return fkStores.map((entry) => ({
			...entry,
			kind: classKind(appschemes.find((s) => s.code === entry.fk.code))
		}));
	});

	const dateFieldsStatic = logicScheme
		? Object.keys(logicScheme.fields).filter((name) =>
				['date', 'datetime'].includes((logicScheme.fields[name] as { type?: string })?.type ?? '')
			)
		: [];

	const reverseFksStatic = logicScheme ? logicScheme.parseReverseFks() : {};
	const reverseCollections = Object.keys(reverseFksStatic).filter((c) => machine.rights.checkAccess(c, 'L'));

	const schemeInfo = $derived(schemeStore.records[0]);
	const total = $derived(mainStore.records.length);

	const recentHistory = $derived(
		[...historyStore.records]
			.sort((a, b) => String(b.lastSeen ?? '').localeCompare(String(a.lastSeen ?? '')))
			.slice(0, 6)
	);

	const classificationPanels = $derived.by(() => {
		const records = mainStore.records as RecordRow[];
		return classifiedFks
			.filter((entry) => entry.kind !== null)
			.map(({ fkName, fk, fieldInfo, optionsStore, kind }) => {
			const options = optionsStore.records as OptionRow[];
			// Legacy rule kept: a closed status is excluded from the denominator, so
			// "n sur m" measures progress over still-open records. 'END' is the closed
			// marker in IdaeCapabilities.workflowOrder().
			const endOption = kind === 'status' ? options.find((o) => o.code === 'END') : undefined;
			const endCount = endOption
				? records.filter((r) => matchesOption(resolveFkKey(r, fkName, fieldInfo), endOption)).length
				: 0;
			const denom = total - endCount;
			return {
				fkName,
				targetCollection: fk.code,
				options: options
					.filter((o) => !endOption || o.code !== endOption.code)
					.map((o) => {
						const count = records.filter((r) => matchesOption(resolveFkKey(r, fkName, fieldInfo), o)).length;
						return {
							code: String(o.code ?? ''),
							name: String(o.name ?? o.code ?? ''),
							count,
							denom,
							progress: denom > 0 ? count / denom : 0
						};
					})
					.filter((o) => o.count > 0)
			};
		});
	});

	const forwardFkPanels = $derived.by(() => {
		const records = mainStore.records as RecordRow[];
		const appschemes = appschemeAllStore.records as AppschemeRow[];
		return classifiedFks
			.filter((entry) => entry.kind === null)
			.map(({ fkName, fk, fieldInfo }) => {
			const keys = records.map((r) => resolveFkKey(r, fkName, fieldInfo)).filter((k) => k != null);
			const distinct = new Set(keys).size;
			const orphans = records.length - keys.length;
			const meta = appschemes.find((s) => s.code === fk.code);
			return { fkName, targetCollection: fk.code, distinct, orphans, meta };
		});
	});

	const seeAlsoGroups = $derived.by(() => {
		const appschemes = appschemeAllStore.records as AppschemeRow[];
		const types = appschemeTypeStore.records as AppschemeTypeRow[];
		const groups = new Map<string, { key: string; label: string; items: Array<{ collection: string; name: string; icon?: string }> }>();
		for (const col of reverseCollections) {
			const meta = appschemes.find((s) => s.code === col);
			const typeCode = meta?.fks?.appscheme_type?.code ?? 'ungrouped';
			const typeMeta = types.find((t) => t.code === typeCode);
			const label = typeMeta?.name ?? (typeCode === 'ungrouped' ? 'Autres' : typeCode);
			if (!groups.has(typeCode)) groups.set(typeCode, { key: typeCode, label, items: [] });
			groups.get(typeCode)!.items.push({ collection: col, name: meta?.name ?? col, icon: meta?.icon });
		}
		return Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label));
	});

	let periodField = $state<string | undefined>(
		dateFieldsStatic.includes('dateDebut') ? 'dateDebut' : dateFieldsStatic[0]
	);

	function isoDate(d: Date): string {
		return d.toISOString().slice(0, 10);
	}
	function startOfWeek(d: Date): Date {
		const x = new Date(d);
		x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
		x.setHours(0, 0, 0, 0);
		return x;
	}
	function startOfMonth(d: Date): Date {
		return new Date(d.getFullYear(), d.getMonth(), 1);
	}

	const periodCounts = $derived.by(() => {
		if (!periodField) return [];
		const field = periodField;
		const now = new Date();
		const thisWeekStart = startOfWeek(now);
		const lastWeekStart = new Date(thisWeekStart);
		lastWeekStart.setDate(lastWeekStart.getDate() - 7);
		const nextWeekStart = new Date(thisWeekStart);
		nextWeekStart.setDate(nextWeekStart.getDate() + 7);
		const thisMonthStart = startOfMonth(now);
		const lastMonthStart = new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth() - 1, 1);
		const nextMonthStart = new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth() + 1, 1);

		const windows = [
			{ label: 'Mois dernier', start: isoDate(lastMonthStart), end: isoDate(thisMonthStart) },
			{ label: 'Ce mois-ci', start: isoDate(thisMonthStart), end: isoDate(nextMonthStart) },
			{ label: 'Semaine dernière', start: isoDate(lastWeekStart), end: isoDate(thisWeekStart) },
			{ label: 'Cette semaine', start: isoDate(thisWeekStart), end: isoDate(nextWeekStart) }
		];

		const records = mainStore.records as RecordRow[];
		return windows.map((w) => ({
			...w,
			count: records.filter((r) => {
				const v = String(r[field] ?? '');
				return v !== '' && v >= w.start && v < w.end;
			}).length
		}));
	});

	let letterWhere = $state<Where | undefined>(undefined);
	let fkWheres = $state<Record<string, Where | undefined>>({});

	const listWhere = $derived.by(() => {
		const merged: Record<string, unknown> = {};
		if (letterWhere) Object.assign(merged, letterWhere);
		for (const w of Object.values(fkWheres)) if (w) Object.assign(merged, w);
		return Object.keys(merged).length ? (merged as Where) : undefined;
	});

	function resetFilters(): void {
		letterWhere = undefined;
		fkWheres = {};
	}

	function openCreate(): void {
		machine.menu.verbs.create?.(collection);
	}

	function openRecord(id: unknown): void {
		if (id == null) return;
		machine.menu.verbs.fiche?.(collection, id as string | number);
	}

	function openSpace(targetCollection: string): void {
		machine.menu.verbs.space?.(targetCollection);
	}
</script>

<space-component>
	<space-main>
		<space-header>
			{#if schemeInfo?.icon}<Icon icon={schemeInfo.icon} class="space-header-icon" />{/if}
			<h2 style={schemeInfo?.color ? `color: ${schemeInfo.color};` : undefined}>
				{schemeInfo?.name ?? collection}
			</h2>
			{#if collectionId != null}<span class="space-record">{collectionId}</span>{/if}
			{#if canCreate}
				<button type="button" class="btn-primary" onclick={openCreate}>
					Créer {schemeInfo?.name ?? collection}
				</button>
			{/if}
			<DataCount {collection} label="Total" />
		</space-header>

		{#if recentHistory.length}
			<space-header-recent>
				{#each recentHistory as entry (entry.id)}
					<button type="button" class="space-recent-item" onclick={() => openRecord(entry.collection_value)}>
						{entry.label ?? entry.collection_value}
					</button>
				{/each}
			</space-header-recent>
		{/if}

		{#if classificationPanels.some((p) => p.options.length)}
			<space-classifications>
				{#each classificationPanels as panel (panel.fkName)}
					{#if panel.options.length}
						<Tile title={panel.fkName}>
							{#each panel.options as option (option.code)}
								<InfoLine
									label={option.name}
									value={option.count}
									hint={`${option.count} sur ${option.denom}`}
									progress={option.progress}
								/>
							{/each}
						</Tile>
					{/if}
				{/each}
			</space-classifications>
		{/if}

		{#if forwardFkPanels.length}
			<space-repartitions>
				{#each forwardFkPanels as panel (panel.fkName)}
					<Tile
						title={panel.meta?.name ?? panel.targetCollection}
						icon={panel.meta?.icon}
						accentColor={panel.meta?.color}
						onclick={() => openSpace(panel.targetCollection)}
					>
						<span class="space-fk-count">{panel.distinct} élément(s)</span>
						{#if panel.orphans > 0}
							<span class="space-fk-orphans">
								<Icon icon="ph:link-break" /> {panel.orphans} sans {panel.fkName}
							</span>
						{/if}
					</Tile>
				{/each}
			</space-repartitions>
		{/if}

		{#if seeAlsoGroups.length}
			<space-see-also>
				<Tile title="Voir aussi">
					{#each seeAlsoGroups as group (group.key)}
						<space-see-also-group>
							<h4>{group.label}</h4>
							{#each group.items as item (item.collection)}
								<button type="button" class="space-see-also-item" onclick={() => openSpace(item.collection)}>
									{#if item.icon}<Icon icon={item.icon} />{/if}
									{item.name}
									<DataCount collection={item.collection} />
								</button>
							{/each}
						</space-see-also-group>
					{/each}
				</Tile>
			</space-see-also>
		{/if}

		{#if dateFieldsStatic.length}
			<space-periods>
				<Tile title="Périodes">
					{#snippet header()}
						<select class="form-select" bind:value={periodField}>
							{#each dateFieldsStatic as field (field)}
								<option value={field}>{field}</option>
							{/each}
						</select>
					{/snippet}
					{#each periodCounts as period (period.label)}
						<InfoLine label={period.label} value={period.count} />
					{/each}
				</Tile>
			</space-periods>
		{/if}

		<space-list>
			<DataList
				{collection}
				where={listWhere}
				{prefsScope}
				sortBy={logicScheme?.defaultSort}
				link="loadInDialog:fiche"
				pageSize={30}
			/>
		</space-list>
	</space-main>

	<space-search>
		<Find {collection} {prefsScope} />
		<AlphabetFilter {collection} bind:where={letterWhere} />
		{#if fksEntries.length}
			<space-search-fk-filters>
				{#each fksEntries as [fkName] (fkName)}
					<FkFilter {collection} {fkName} bind:where={fkWheres[fkName]} />
				{/each}
			</space-search-fk-filters>
		{/if}
		<button type="button" class="btn-ghost" onclick={resetFilters}>Réinitialiser</button>
	</space-search>
</space-component>

<style>
	@layer components {
		space-component {
			display: grid;
			grid-template-columns: 1fr minmax(calc(var(--gutter-3xl) * 4), calc(var(--gutter-3xl) * 5.5));
			gap: var(--gutter-sm);
			padding: var(--pad-sm);
			overflow-y: auto;
			align-items: start;
		}
		space-main {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm);
			min-width: 0;
		}
		space-header {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			flex-wrap: wrap;
		}
		space-header h2 {
			margin: 0;
			text-transform: capitalize;
		}
		.space-record {
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
		space-header-recent {
			display: flex;
			gap: var(--gutter-xs);
			flex-wrap: wrap;
		}
		.space-recent-item {
			all: unset;
			cursor: pointer;
			padding: var(--pad-xs) var(--pad-sm);
			border-radius: var(--radius-full);
			background: var(--color-surface-alt);
			font-size: var(--text-xs);
			color: var(--color-text-muted);
		}
		.space-recent-item:hover {
			background: var(--color-surface-hover);
			color: var(--color-text);
		}
		space-classifications,
		space-repartitions {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(calc(var(--gutter-3xl) * 4), 1fr));
			gap: var(--gutter-sm);
		}
		.space-fk-count {
			font-weight: var(--font-semibold);
		}
		.space-fk-orphans {
			display: inline-flex;
			align-items: center;
			gap: var(--gutter-xs);
			color: var(--color-critical);
			font-size: var(--text-sm);
		}
		space-see-also {
			display: block;
		}
		space-see-also-group {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
		}
		space-see-also-group h4 {
			margin: 0;
			font-size: var(--text-xs);
			text-transform: uppercase;
			color: var(--color-text-muted);
		}
		.space-see-also-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-xs);
			cursor: pointer;
			padding: var(--pad-xs) var(--pad-sm);
			border-radius: var(--radius-xs);
		}
		.space-see-also-item:hover {
			background: var(--color-surface-hover);
		}
		space-periods {
			display: block;
		}
		space-list {
			display: block;
			min-block-size: 0;
		}
		space-search {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm);
			position: sticky;
			top: 0;
			padding: var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-xs);
			background: var(--color-surface-alt);
		}
		space-search-fk-filters {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm);
		}
	}
</style>
