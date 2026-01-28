
<!--
Confirm.svelte
Svelte 5 confirm/cancel fragment
@role fragment
@prop {Function} validate - Validation callback
@prop {string} [message] - Confirm message
@slot initial - Initial content
@slot children - Button content
@slot confirm - Confirm button content (optional)
@slot cancel - Cancel button content (optional)
@event confirm - Emitted on confirm
@event cancel - Emitted on cancel
-->

<script lang="ts">
	import { Icon } from '@medyll/idae-slotui-svelte';
	let { validate, message = undefined } = $props<{ validate: Function; message?: string }>();
	let status = $state('default');
</script>

{#snippet initial()}
	<!-- Default initial content: empty -->
{/snippet}

{#snippet children()}
	<Icon icon="mdi:pencil" class="md" />
{/snippet}

{#snippet confirm(message)}
	{message ?? ''}
	<Icon class="color-success md text-green-800" icon="mdi:done" />
{/snippet}

{#snippet cancel()}
	<Icon icon="typcn:cancel" style="color: red" class="md fill-red-800" />
{/snippet}

<div class="line-gap-2 w-full">
	{@render initial()}
	{#if status === 'default'}
		<button
			class="line-gap-2"
			aria-label="Editer"
			onclick={() => { status = 'show_confirm'; }}
		>
			{@render children()}
		</button>
	{/if}
	{#if status === 'show_confirm'}
		<button
			aria-label="Confirmer"
			onclick={() => { validate?.(); status = 'default'; }}
		>
			{@render confirm(message)}
		</button>
		<button
			aria-label="Annuler"
			onclick={() => { status = 'default'; }}
		>
			{@render cancel()}
		</button>
	{/if}
</div>

<style lang="postcss">
	@reference "../../styles/references.css";
	svg {
		> path {
			color: red !important;
		}
	}
</style>
