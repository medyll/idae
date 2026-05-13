<script lang="ts">
	import { page } from '$app/state';
	import type { AppScheme } from '$lib/main/api/types.js';

	let {
		schemes = [] as AppScheme[],
		currentTable = '',
		currentRecord = null as { id: string; name?: string } | null
	} = $props<{
		schemes?:       AppScheme[];
		currentTable?:  string;
		currentRecord?: { id: string; name?: string } | null;
	}>();

	const items = $derived(buildBreadcrumbs());

	function buildBreadcrumbs() {
		const path = page.url.pathname;
		const parts = path.split('/').filter(Boolean);
		const crumbs = [{ label: 'Home', href: '/' }];

		if (parts.length === 0) return crumbs;

		// First part is usually table name
		const table = parts[0];
		const tableScheme = schemes.find((s) => s.code === table);
		const tableName = tableScheme?.name || table;

		if (parts.length === 1) {
			// List view
			crumbs.push({ label: tableName, href: `/${table}` });
		} else if (parts[1] === 'new') {
			// Create view
			crumbs.push({ label: tableName, href: `/${table}` });
			crumbs.push({ label: 'New', href: null });
		} else if (parts[1]) {
			// Detail or edit view
			crumbs.push({ label: tableName, href: `/${table}` });
			
			if (currentRecord?.name) {
				crumbs.push({ label: currentRecord.name, href: `/${table}/${parts[1]}` });
			} else {
				crumbs.push({ label: `#${parts[1]}`, href: `/${table}/${parts[1]}` });
			}

			if (parts[2] === 'edit') {
				crumbs.push({ label: 'Edit', href: null });
			}
		}

		return crumbs;
	}
</script>

<nav class="breadcrumb">
	{#each items as item, i}
		{#if i > 0}
			<span class="separator">/</span>
		{/if}

		{#if item.href}
			<a href={item.href} class="crumb">{item.label}</a>
		{:else}
			<span class="crumb active">{item.label}</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
		font-size: 0.875rem;
	}

	.separator {
		color: #6c757d;
	}

	.crumb {
		color: #007bff;
		text-decoration: none;
	}

	.crumb:hover {
		text-decoration: underline;
	}

	.crumb.active {
		color: #6c757d;
		cursor: default;
	}

	.crumb.active:hover {
		text-decoration: none;
	}
</style>
