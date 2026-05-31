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
		const crumbs: { label: string; href?: string }[] = [{ label: 'Home', href: '/' }];

		if (parts.length === 0) return crumbs;

		// First part is usually table name
		const table = parts[0];
		const tableScheme = schemes.find((s: AppScheme) => s.code === table);
		const tableName = tableScheme?.name || table;

		if (parts.length === 1) {
			// List view
			crumbs.push({ label: tableName, href: `/${table}` });
		} else if (parts[1] === 'new') {
			// Create view
			crumbs.push({ label: tableName, href: `/${table}` });
			crumbs.push({ label: 'New', href: undefined });
		} else if (parts[1]) {
			// Detail or edit view
			crumbs.push({ label: tableName, href: `/${table}` });
			
			if (currentRecord?.name) {
				crumbs.push({ label: currentRecord.name, href: `/${table}/${parts[1]}` });
			} else {
				crumbs.push({ label: `#${parts[1]}`, href: `/${table}/${parts[1]}` });
			}

			if (parts[2] === 'edit') {
				crumbs.push({ label: 'Edit', href: undefined });
			}
		}

		return crumbs;
	}
</script>

<nav class="breadcrumb toolbar" aria-label="Breadcrumb">
	{#each items as item, i}
		{#if i > 0}
			<span class="separator" aria-hidden="true">/</span>
		{/if}

		{#if item.href}
			<a href={item.href} class="crumb">{item.label}</a>
		{:else}
			<span class="crumb is-active" aria-current="page">{item.label}</span>
		{/if}
	{/each}
</nav>
