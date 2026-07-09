<!--
RbacMatrix.svelte
Frame: grant editor — collections × CRUDLX × group.
Composes existing store API + FieldBoolean. No custom field logic.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import FieldBoolean from '$lib/data-ui/field/snippets/FieldBoolean.svelte';

	let {
		groupId: initialGroupId,
		typeId: initialTypeId,
	}: {
		groupId?: string;
		typeId?:  string;
	} = $props();

	const OPS = ['c', 'r', 'u', 'd', 'l', 'x'] as const;
	type Op = (typeof OPS)[number];

	let selectedGroupId = $state('');
	$effect(() => { if (initialGroupId && !selectedGroupId) selectedGroupId = initialGroupId; });

	const collections = $derived.by(() => {
		const all = machine.logic?.collections?.() ?? [];
		return all.map(c => c.name as string);
	});

	const groupStore = machine.store('appuser_group');
	const groups = $derived(groupStore.records as Array<Record<string, unknown>>);

	const grants = $derived.by(() => {
		if (!selectedGroupId) return [] as Array<Record<string, unknown>>;
		const grantStore = machine.store('appuser_grant');
		return grantStore.records.filter(g => {
			const fks = g.fks as Record<string, { id?: string }> | undefined;
			return fks?.appuser_group?.id === selectedGroupId;
		}) as Array<Record<string, unknown>>;
	});

	const grantByCollection = $derived.by(() => {
		const m = new Map<string, Record<string, unknown>>();
		for (const g of grants) {
			const fks = g.fks as Record<string, { code?: string }> | undefined;
			const code = fks?.appscheme?.code;
			if (code) m.set(code, g);
		}
		return m;
	});

	function getOp(collectionCode: string, op: Op): boolean {
		const g = grantByCollection.get(collectionCode);
		return !!(g && g[op]);
	}

	async function toggleCell(collectionCode: string, op: Op): Promise<void> {
		if (!selectedGroupId) return;

		const existing = grantByCollection.get(collectionCode);
		const newValue = !getOp(collectionCode, op);

		if (existing) {
			await machine.action('appuser_grant', { [op]: newValue }, { upsertOn: ['id'] });
		} else {
			const group = groups.find(gr => gr.id === selectedGroupId);
			await machine.action('appuser_grant', {
				code:      `${collectionCode}_${selectedGroupId}`,
				grantType: 'group',
				c: false, r: false, u: false, d: false, l: false, x: false,
				[op]: newValue,
				grantedBy: 'system',
				grantedAt: new Date().toISOString(),
				fks: {
					appscheme:     { code: collectionCode },
					appuser_group: { id: selectedGroupId, code: group?.code, name: group?.name },
				},
			}, { upsertOn: ['appscheme', 'appuser_group'] });
		}
	}

	async function toggleColumn(op: Op): Promise<void> {
		if (!selectedGroupId) return;
		const allOn = collections.every(c => getOp(c, op));
		for (const c of collections) {
			if (getOp(c, op) === allOn) {
				await toggleCell(c, op);
			}
		}
	}
</script>

<div class="rbac-matrix">
	<header class="rbac-toolbar">
		<label for="rbac-group">Group:</label>
		<select id="rbac-group" bind:value={selectedGroupId}>
			<option value="">— pick group —</option>
			{#each groups as g (g.id)}
				<option value={g.id}>{g.name ?? g.code}</option>
			{/each}
		</select>
		{#if initialTypeId}
			<span class="note">type filter: {initialTypeId} (not yet wired)</span>
		{/if}
	</header>

	{#if !selectedGroupId}
		<p class="empty">Select a group to edit permissions.</p>
	{:else}
		<table class="matrix">
			<thead>
				<tr>
					<th class="row-head">Collection</th>
					{#each OPS as op}
						<th>
							<button type="button" class="op-head" onclick={() => toggleColumn(op)}>
								{op.toUpperCase()}
							</button>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each collections as code (code)}
					<tr>
						<th class="row-head">{code}</th>
						{#each OPS as op}
							<td>
								<FieldBoolean
									mode="update"
									value={getOp(code, op)}
									onchange={() => { void toggleCell(code, op); }}
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	.rbac-matrix {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
	}
	.rbac-toolbar {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.note {
		font-size: 0.85em;
		color: var(--color-muted, #888);
	}
	.empty {
		padding: 24px;
		text-align: center;
		color: var(--color-muted, #888);
	}
	.matrix {
		border-collapse: collapse;
		min-width: 480px;
	}
	.matrix th,
	.matrix td {
		border: 1px solid var(--color-border, #e5e7eb);
		padding: 4px 8px;
		text-align: center;
	}
	.matrix thead th {
		position: sticky;
		top: 0;
		background: var(--color-surface, #fafafa);
		z-index: 1;
	}
	.row-head {
		position: sticky;
		left: 0;
		background: var(--color-surface, #fafafa);
		text-align: left;
		font-weight: var(--font-medium, 500);
	}
	.op-head {
		all: unset;
		cursor: pointer;
		font-weight: var(--font-semibold, 600);
		padding: 4px 8px;
	}
	.op-head:hover {
		background: var(--color-hover, #f3f4f6);
	}
</style>
