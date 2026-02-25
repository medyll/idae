<script module lang="ts">
import type { Snippet } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';
/**
 * Props for the Login component.
 * Represents a login form with customizable fields, loading, and slot support.
 */
export type LoginProps = {
	/** Whether to show the login form or not */
	showLogin: boolean;
	/** Transition configuration for the login form */
	transition: TransitionConfig;
	/** Fields for the login form */
	fields: { email: string; password: string };
	/** Whether the form is loading or not */
	loading: boolean;
	/** Whether the form is submitting or not */
	submitting: boolean;
	/** Function to call when the form is submitted */
	onSubmit: (args: any) => Promise<any>;
	/** Children snippet for the default content */
	children?: Snippet;
	/** Slot for the login avatar root */
	loginAvatarRoot?: Snippet;
	/** Slot for the login avatar */
	loginAvatar?: Snippet;
	/** Slot for the login form */
	loginForm?: Snippet;
	/** Slot for retrieve password */
	slotRetrievePassword?: Snippet;
};
</script>

<script lang="ts">
import { fade, type TransitionConfig } from 'svelte/transition';
import Backdrop from '$lib/base/backdrop/Backdrop.svelte';
import Button from '$lib/controls/button/Button.svelte';
import Icon from '$lib/base/icon/Icon.svelte';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import type { LoginProps } from './Login.svelte';

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
	slotRetrievePassword,
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
						<div class="avatarHolder m-b-2">
							<div class="avatar flex-h flex-align-middle-center">
								{#if submitting}
									<Icon rotate iconSize="large" icon="loading" />
								{:else}
									<Slotted child={loginAvatar} />
								{/if}
							</div>
						</div>
					</Slotted>
					<Slotted child={loginForm}>
						<div class="p-2">
							<input class="input" name="email" type="text" />
						</div>
						<div class="p-2">
							<input name="password" type="password" />
						</div>
						<Button type="submit" value="login" loading={submitting}>
							{#if submitting}<i class="fa fa-spinner fa-spin theme-text-primary-complement"
								></i>{/if}
							Login
						</Button>
						{#if grantedError}
							<div class="p-1 color-scheme-error">Please verify your input</div>
						{/if}
					</Slotted>
					{#if slotRetrievePassword}
						<div class="retrieve">
							<Slotted child={slotRetrievePassword} />
						</div>
					{/if}
				</div>
			</div>
		</form>
	</Backdrop>
{:else}
	{@render children?.()}
{/if}

<style global lang="css">
  @import './login.css';
</style>
