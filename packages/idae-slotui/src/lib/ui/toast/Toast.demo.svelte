<script lang="ts">
	import Toast from './Toast.svelte';

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoerCode from '$lib/base/demoer/DemoerCode.svelte';
	import Demoer from '$lib/base/demoer/DemoerContent.svelte';
	import DemoPage from '$lib/base/demoer/Demoer.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import Toaster from './Toaster.svelte';
	/* demo */

	let codeSlot = ` `;
</script>

<Toast autoClose={true}>toast</Toast>
<Toast>toast</Toast>
