<script module lang="ts">
/**
 * Props for the InPlaceEdit component.
 * Allows inline editing of a value with save/cancel support.
 */
export type InPlaceEditProps = {
	/** Value to be edited */
	value: string;
	/** Reference to the span element */
	spanElement: HTMLElement;
	/** Reference to the input element */
	inputElement: HTMLInputElement;
	/** Current value in the input (optional) */
	inputValue?: any;
	/** Whether the component is in editing mode (optional) */
	editing?: boolean;
	/** Callback when the value is saved (optional) */
	onSave?: (newValue: string) => void;
};
</script>
<script lang="ts">

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

<style global lang="postcss">
	@reference "tailwindcss"
	@import './inplaceedit.css';
</style>

<div class="border pos-rel">
	<dialog id={popperId} open={editing} popover="auto" class="popper" bind:this={popper}>
		<div class="flex gap-4 p-1" style="gap:4px">
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
