<script lang="ts">
	import Login from './Login.svelte';
	// import Input from "../input/Input.svelte";

	/* demo */
	import { defaultsArgs, defaultsArgsFromProps } from '$lib/base/demoer/demoer.utils.js';
	import ComponentDemo from '$lib/base/demoer/DemoerComponent.svelte';
	import DemoerCode from '$lib/base/demoer/DemoerCode.svelte';
	import Demoer from '$lib/base/demoer/Demoer.svelte';
	import DemoPage from '$lib/base/demoer/DemoPage.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { uiPresets } from '$lib/utils/engine/presets.js';
	import Button from '../../controls/button/Button.svelte';
	import DemoerComponent from '$lib/base/demoer/DemoerComponent.svelte';

	import { parameters, componentArgs } from './types.js';

	let submitting: boolean = false;
	let showLogin: boolean = true;

	function validate() {
		submitting = true;
		setTimeout(() => {
			submitting = false;
			showLogin = false;
		}, 2000);
	}

	let codeSlot = ``;
</script>

<ComponentDemo component="Login">
	<DemoPage component="Chipper" code={codeSlot}>
		<Demoer {parameters} {componentArgs}>
			{#snippet children({ activeParams })}
				<Login {showLogin} {submitting}>
					{#snippet loginAvatar()}
						<Icon icon="mdi:user" />
					{/snippet}
					{#snippet loginForm()}
						<form
							class="h-full w-full flex-v flex-align-middle-center"
							method="post"
							on:submit|preventDefault={validate}
						>
							<div class="pad-2">
								<input name="email" type="text" value="..." />
							</div>
							<div class="pad-2">
								<input name="password" type="password" />
							</div>
							<Button type="submit" width="medium" value="login" loading={false}>Login</Button>
						</form>
					{/snippet}
				</Login>
			{/snippet}
		</Demoer>
	</DemoPage>
	<div class="flex-v gap-large">
		<DemoerCode title="myContext" code={codeSlot}></DemoerCode>
	</div>
</ComponentDemo>
