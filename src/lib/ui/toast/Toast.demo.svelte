<script lang="ts">
	import Toast from './Toast.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentExample from '$components/Example.svelte';
	import DemoerCode from '$lib/base/demoer/DemoerCode.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import Toaster from './Toaster.svelte';
	/* demo */

	let codeSlot = ` `;
</script>

<Toast autoClose={true}>toast</Toast>
<Toast>toast</Toast>
