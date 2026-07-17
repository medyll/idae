<!--
RecordTimeline.svelte — record-level activity assembled from the existing
appuser_audit and appuser_activity collections. Read-only and reactive.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';

	interface AuditRecord extends Record<string, unknown> {
		id?: string | number;
		action?: string;
		login?: string;
		resourceType?: string;
		resourceId?: string | number;
		status?: string;
		details?: Record<string, unknown>;
		performedAt?: string;
	}

	interface ActivityRecord extends Record<string, unknown> {
		id?: string | number;
		code?: string;
		collection?: string;
		collection_value?: string | number;
		timestamp?: string;
	}

	interface TimelineEntry {
		id: string;
		at: string;
		kind: 'audit' | 'activity';
		action: string;
		actor?: string;
		status?: string;
		detail?: string;
	}

	let {
		collection,
		collectionId,
		limit = 30
	}: {
		collection: string;
		collectionId: string | number;
		limit?: number;
	} = $props();

	const hasAudit = machine.logic.collection('appuser_audit') !== null;
	const hasActivity = machine.logic.collection('appuser_activity') !== null;
	const auditStore = $derived.by(() =>
		hasAudit
			? machine.store<AuditRecord>('appuser_audit', { resourceType: { $eq: collection } })
			: null
	);
	const activityStore = $derived.by(() =>
		hasActivity
			? machine.store<ActivityRecord>('appuser_activity', { collection: { $eq: collection } })
			: null
	);

	function detailLabel(details?: Record<string, unknown>): string | undefined {
		const fields = Array.isArray(details?.fields) ? details.fields.map(String) : [];
		if (fields.length) return fields.join(', ');
		if (details?.tool) return `Outil : ${String(details.tool)}`;
		return undefined;
	}

	const entries = $derived.by((): TimelineEntry[] => {
		const targetId = String(collectionId);
		const auditEntries = (auditStore?.records ?? [])
			.filter((record) => String(record.resourceId ?? '') === targetId)
			.map((record, index) => ({
				id: `audit:${String(record.id ?? index)}`,
				at: record.performedAt ?? '',
				kind: 'audit' as const,
				action: record.action ?? 'action',
				actor: record.login,
				status: record.status,
				detail: detailLabel(record.details)
			}));
		const activityEntries = (activityStore?.records ?? [])
			.filter((record) => String(record.collection_value ?? '') === targetId)
			.map((record, index) => ({
				id: `activity:${String(record.id ?? index)}`,
				at: record.timestamp ?? '',
				kind: 'activity' as const,
				action: record.code === 'VIEW' ? 'consultation' : (record.code ?? 'activité')
			}));
		return [...auditEntries, ...activityEntries]
			.filter((entry) => !!entry.at)
			.sort((left, right) => Date.parse(right.at) - Date.parse(left.at))
			.slice(0, limit);
	});

	function formatDate(value: string): string {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleString('fr-FR', {
			dateStyle: 'medium',
			timeStyle: 'short'
		});
	}

	const iconFor = (entry: TimelineEntry): string => {
		if (entry.kind === 'activity') return 'ph:eye';
		if (entry.action === 'create') return 'ph:plus-circle';
		if (entry.action === 'update') return 'ph:pencil-simple';
		if (entry.action === 'delete') return 'ph:trash';
		return 'ph:clock-counter-clockwise';
	};
</script>

<record-timeline-component>
	<record-timeline-header>
		<h3>Activité</h3>
		<span class="badge">{entries.length}</span>
	</record-timeline-header>
	{#if entries.length}
		<ol class="timeline" aria-label="Historique de la fiche">
			{#each entries as entry (entry.id)}
				<li class="timeline-item">
					<span class="timeline-marker"><Icon icon={iconFor(entry)} /></span>
					<div class="timeline-content">
						<div class="timeline-title">
							<strong>{entry.action}</strong>
							{#if entry.status}<span class="badge">{entry.status}</span>{/if}
						</div>
						{#if entry.actor}<span class="timeline-meta">par {entry.actor}</span>{/if}
						{#if entry.detail}<span class="timeline-detail">{entry.detail}</span>{/if}
						<time datetime={entry.at}>{formatDate(entry.at)}</time>
					</div>
				</li>
			{/each}
		</ol>
	{:else}
		<div class="empty-state" data-pad="md">
			<Icon icon="ph:clock-counter-clockwise" class="empty-state-icon" />
			<p class="empty-state-title">Aucune activité enregistrée</p>
		</div>
	{/if}
</record-timeline-component>

<style>
	@layer components {
		record-timeline-component {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding-top: var(--pad-sm);
			border-top: var(--border-width) solid var(--color-border);
		}
		record-timeline-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		record-timeline-header h3 { margin: 0; }
		.timeline {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			margin: 0;
			padding: 0;
			list-style: none;
		}
		.timeline-item {
			display: grid;
			grid-template-columns: var(--icon-size-sm) minmax(0, 1fr);
			gap: var(--gutter-xs);
		}
		.timeline-marker {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			inline-size: var(--icon-size-sm);
			block-size: var(--icon-size-sm);
			border-radius: var(--radius-full);
			background: var(--color-surface-active);
			color: var(--color-primary);
		}
		.timeline-content {
			display: flex;
			flex-direction: column;
			min-width: 0;
			gap: var(--gutter-xs);
		}
		.timeline-title {
			display: flex;
			align-items: center;
			gap: var(--gutter-xs);
		}
		.timeline-meta,
		.timeline-detail,
		.timeline-content time {
			font-size: var(--text-xs);
			color: var(--color-text-muted);
		}
	}
</style>
