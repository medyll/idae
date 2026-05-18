<!--
CardPicker.svelte
Button that opens a CardForm dialog for a collection.
@role card-action
@prop {string} collection - Collection name
@prop {object} [withData] - Data to prefill
@slot button - Custom button content
-->

<script lang="ts" generics="COL">
	import { Icon } from '@iconify/svelte';
	import CardForm from '$lib/main-ui/card/CardForm.svelte';
	import { type CreateUpdateProps } from './types.js';

	let { collection = 'book', withData, ...rest } = $props<{
		collection?: string;
		withData?: Record<string, any>;
	} & CreateUpdateProps>();

	let dialog = $state<HTMLDialogElement | null>(null);
</script>

<button
	class="card-picker-btn"
	aria-label={`${rest.mode ?? 'create'} ${collection}`}
	onclick={() => dialog?.showModal()}
>
	<Icon icon="ph:plus-duotone" width="18" />
	<slot>{collection}</slot>
</button>

<dialog bind:this={dialog} class="card-picker-dialog">
	<button class="card-picker-close" aria-label="Fermer" onclick={() => dialog?.close()}>
		<Icon icon="ph:x-duotone" width="16" />
	</button>
	<CardForm {collection} {withData} mode={rest.mode ?? 'create'} />
</dialog>

<style>
	.card-picker-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
	}
	.card-picker-dialog {
		border: none;
		border-radius: 0.5rem;
		padding: 1.5rem;
		min-width: 400px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.18);
	}
	.card-picker-dialog::backdrop {
		background: rgba(0,0,0,0.4);
	}
	.card-picker-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		opacity: 0.6;
	}
	.card-picker-close:hover { opacity: 1; }
</style>
