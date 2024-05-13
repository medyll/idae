<script lang="ts">
	import { fade, type TransitionConfig } from 'svelte/transition';

	import Backdrop from '$lib/base/backdrop/Backdrop.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { LoginProps } from './types.js';

	let {
		class: className = '',
		element = $bindable(),
		style = '',
		showLogin = true,
		transition = { type: fade, args: {} },
		fields = { email: '', password: '' },
		loading = false,
		submitting = false,
		onSubmit = function (args) {
			return new Promise((resolve, reject) => {
				return setTimeout(() => {
					resolve(true);
				}, 2000);
			});
		},
		children,
		loginAvatarRoot,
		loginAvatar,
		loginForm,
		...rest
	}: LoginProps = $props();

	export const actions = {
		toggle: (lo?: boolean) => {
			showLogin = lo ?? !showLogin;
		},
		toggleLoading: (lo?: boolean) => {
			loading = lo ?? !loading;
		}
	};

	let grantedError = false;

	const validData: any = {};

	function validate() {
		return true;
	}
</script>

{#if showLogin}
	<Backdrop isOpen={showLogin} style="height:100%;" {loading}>
		<form
			bind:this={element}
			class="pos-abs top-0 h-full w-full {className}"
			method="post"
			on:submit|preventDefault={validate}
		>
			<div transition:fade|global class="pos-rel h-full w-full flex-h flex-align-middle-center">
				<div class="form flex-v flex-align-middle-center">
					<Slotted child={loginAvatarRoot}>
						<slot name="loginAvatarRoot">
							<div class="avatarHolder marg-b-2">
								<div class="avatar flex-h flex-align-middle-center">
									{#if submitting}
										<Icon rotate fontSize="large" icon="loading" />
									{:else}
										<slot name="loginAvatar" />
									{/if}
								</div>
							</div>
						</slot>
					</Slotted>
					<Slotted child={loginForm}>
						<slot name="loginForm">
							<div class="pad-2">
								<input class="input" name="email" type="text" />
							</div>
							<div class="pad-2">
								<input name="password" type="password" />
							</div>
							<Button type="submit" primary="login" loading={submitting}>
								{#if submitting}<i class="fa fa-spinner fa-spin theme-text-primary-complement"
									></i>{/if}
								Login
							</Button>
							{#if grantedError}
								<div class="pad-1 color-scheme-error">Please verify your input</div>
							{/if}
						</slot>
					</Slotted>
					{#if $$slots.slotRetrievePassword}
						<div class="retrieve">
							<slot name="slotRetrievePassword" />
						</div>
					{/if}
				</div>
			</div>
		</form>
	</Backdrop>
{:else}
	<slot />
{/if}

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	form {
		z-index: 1000;
	}
	.retrieve {
		padding: var(--sld-pad-med);
	}
	.form {
		height: 33% !important;
		width: 20%;

		.avatarHolder {
			width: 50%;
			padding-bottom: 50%;
			position: relative;

			.avatar {
				position: absolute;
				top: 0;
				bottom: 0;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 1px solid var(--sld-color-foreground-alpha-mid);
				box-shadow: 0 0 5px 1px rgba(32, 123, 21, 0.3);
				background-color: var(--sld-color-background-alpha-mid);
			}
		}

		.name {
			text-align: center;
			margin: 0.5rem;
		}

		.input {
		}
	}
</style>
