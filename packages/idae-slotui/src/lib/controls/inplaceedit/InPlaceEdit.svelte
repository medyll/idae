<style global lang="scss">
	@use './inplaceedit.scss';
</style>
<script lang="ts">
	import Icon from '$lib/base/icon/Icon.svelte';
	import TextField from '../textfield/TextField.svelte';
	import { be } from '@medyll/idae-be';

	type InPlaceEditProps = {
		value: string;
		spanElement: HTMLElement;
		inputElement: HTMLInputElement;
		inputValue?: any;
		editing?: boolean;
		onSave?: (newValue: string) => void;
	};

	let initialId: string = 'myText';
	let popperId: string = 'myPopover';

	let {
		value = '',
		inputElement,
		inputValue,
		editing = $bindable(),
		onSave = (newValue) => {}
	}: InPlaceEditProps = $props();

	function saveChanges() {
		editing = false;
		onSave(inputValue);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveChanges();
		} else if (event.key === 'Escape') {
			editing = false;
			inputValue = value;
		}
	}

	function handleBlur() {
		editing = false;
		saveChanges();
	}

	inputValue = !editing ? value : inputValue;

	$effect(() => {
		if (editing && inputElement) {
			inputElement.focus();
		}
		popper.addEventListener('toggle', (event) => {
			if (event.newState === 'open') {
				console.log('Le popover est ouvert');
				editing = true;
			} else {
				console.log('Le popover est fermé');
				editing = false;
			}
		});

		console.log(be(`#${initialId}`));
	});

	$effect(() => {
		editing;
		be(popper).clonePosition(`#${initialId}`, { useTransform: false });
		if (!editing) {
			if (popper.matches(':popover-open')) {
				popper.hidePopover();
			}
		}
	});

	let popper;
</script>

<form />

<div class="border pos-rel">
	<dialog id={popperId} open={editing} popover="auto" class="popper" bind:this={popper}>
		<div class="flex gap-4 pad-1" style="gap:4px">
			<TextField
				bind:element={inputElement}
				bind:value={inputValue}
				style="field-sizing: content;min-width: 350px;"
				onblur={handleBlur}
				onkeydown={handleKeyDown}
				>{#snippet inputLast()}
					<button variant="contained square" class="button">
						<Icon style="display:block;width:100%;" icon="fluent-mdl2:accept-medium" />
					</button>
				{/snippet}
			</TextField>
			<button
				variant="flat naked square"
				width="tiny"
				class="button"
				style="align-items:center;align-content:center;text-align:center;display:block;"
				popovertarget={popperId}
				popovertargetaction="hide"
			>
				<Icon icon="icons8:cancel" style="display:block;width:100%;" />
			</button>
		</div>
	</dialog>
</div>
<button role="button" id={initialId} popovertarget={popperId} popovertargetaction="toggle">
	Afficher le popover
</button>
