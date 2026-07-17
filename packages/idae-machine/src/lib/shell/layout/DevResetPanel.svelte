<!--
DevResetPanel.svelte
Dev-only panel to reset server data and/or client IDB.
@role dev-tool
@prop {string} [serverUrl] - Base server URL (default: API_URL from $lib/config)
@prop {string} [org] - Org name for server reset (default: 'demo')
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { API_URL } from '$lib/config.js';

	let {
		serverUrl = API_URL,
		org = 'demo'
	}: {
		serverUrl?: string;
		org?: string;
	} = $props();

	type StepKey = 'clear' | 'deploy' | 'seed' | 'idb';
	type StepState = 'idle' | 'running' | 'ok' | 'error';

	let steps = $state<Record<StepKey, StepState>>({
		clear:  'idle',
		deploy: 'idle',
		seed:   'idle',
		idb:    'idle',
	});
	let errorMsg = $state<string | null>(null);

	function icon(s: StepState) {
		return s === 'running' ? '⏳' : s === 'ok' ? '✅' : s === 'error' ? '❌' : '○';
	}

	async function serverReset(selectedSteps: StepKey[]): Promise<boolean> {
		errorMsg = null;
		for (const s of selectedSteps) steps[s] = 'running';

		try {
			const res = await fetch(`${serverUrl}/api/admin/reset`, {
				method:  'POST',
				headers: { 'Content-Type': 'application/json' },
				body:    JSON.stringify({ org, steps: selectedSteps.filter(s => s !== 'idb') }),
			});
			const json = await res.json();

			if (!res.ok || !json.ok) {
				for (const s of selectedSteps) steps[s] = 'error';
				errorMsg = json.error ?? `HTTP ${res.status}`;
				return false;
			}

			for (const [s, result] of Object.entries(json.results ?? {})) {
				steps[s as StepKey] = result === 'ok' ? 'ok' : 'idle';
			}
			return true;
		} catch (err) {
			for (const s of selectedSteps) steps[s] = 'error';
			errorMsg = String(err);
			return false;
		}
	}

	async function clearIdb() {
		steps.idb = 'running';
		errorMsg = null;
		try {
			await machine.resetClientData(); // reloads page
		} catch (err) {
			steps.idb = 'error';
			errorMsg = String(err);
		}
	}

	async function doClear()  { await serverReset(['clear']); }
	async function doDeploy() { await serverReset(['deploy']); }
	async function doSeed()   { await serverReset(['seed']); }
	async function doFullReset() {
		const ok = await serverReset(['clear', 'deploy', 'seed']);
		if (ok) await clearIdb();
	}
</script>

<div class="dev-reset-panel">
	<header class="dev-reset-header">
		<span class="dev-badge">DEV</span>
		<strong>Reset</strong>
	</header>

	<div class="dev-reset-steps">
		<div class="step">
			<span class="step-icon">{icon(steps.clear)}</span>
			<span class="step-label">Clear MongoDB</span>
			<button class="btn-dev" onclick={doClear} disabled={steps.clear === 'running'}>
				Clear
			</button>
		</div>
		<div class="step">
			<span class="step-icon">{icon(steps.deploy)}</span>
			<span class="step-label">Deploy schema</span>
			<button class="btn-dev" onclick={doDeploy} disabled={steps.deploy === 'running'}>
				Deploy
			</button>
		</div>
		<div class="step">
			<span class="step-icon">{icon(steps.seed)}</span>
			<span class="step-label">Seed data</span>
			<button class="btn-dev" onclick={doSeed} disabled={steps.seed === 'running'}>
				Seed
			</button>
		</div>
		<div class="step">
			<span class="step-icon">{icon(steps.idb)}</span>
			<span class="step-label">Clear IDB (reload)</span>
			<button class="btn-dev btn-danger" onclick={clearIdb} disabled={steps.idb === 'running'}>
				Clear IDB
			</button>
		</div>
	</div>

	<div class="dev-reset-actions">
		<button
			class="btn-dev btn-danger btn-full"
			onclick={doFullReset}
			disabled={Object.values(steps).some(s => s === 'running')}
		>
			⚠ Full reset (clear + deploy + seed + IDB)
		</button>
	</div>

	{#if errorMsg}
		<div class="dev-reset-error">{errorMsg}</div>
	{/if}
</div>

<style>
	@layer components {
	.dev-reset-panel {
		border: var(--focus-ring-width) solid var(--color-warning);
		border-radius: var(--radius-xs);
		background: color-mix(in oklch, var(--color-warning) 12%, var(--color-surface-raised));
		padding: var(--pad-sm);
		font-size: var(--text-xs);
	}
	.dev-reset-header {
		display: flex;
		align-items: center;
		gap: var(--gutter-sm);
		margin-bottom: var(--marg-sm);
	}
	.dev-badge {
		background: var(--color-warning);
		color: var(--default-color-surface-light);
		font-size: var(--text-xs);
		font-weight: var(--font-bold);
		padding: 0 var(--pad-xs);
		border-radius: var(--radius-xs);
		letter-spacing: var(--tracking-wider);
	}
	.dev-reset-steps {
		display: flex;
		flex-direction: column;
		gap: var(--gutter-xs);
		margin-bottom: var(--marg-sm);
	}
	.step {
		display: flex;
		align-items: center;
		gap: var(--gutter-sm);
	}
	.step-icon { width: 1.2em; text-align: center; }
	.step-label { flex: 1; }
	.dev-reset-actions { margin-top: var(--marg-sm); }
	.btn-dev {
		padding: var(--pad-xs) var(--pad-sm);
		font-size: var(--text-xs);
		border: var(--border-width) solid var(--color-warning);
		background: var(--color-surface-raised);
		border-radius: var(--radius-xs);
		cursor: pointer;
	}
	.btn-dev:hover:not(:disabled) { background: color-mix(in oklch, var(--color-warning) 16%, var(--color-surface-raised)); }
	.btn-dev:disabled { opacity: 0.5; cursor: not-allowed; }
	.btn-danger { border-color: var(--color-critical); color: var(--color-critical); }
	.btn-danger:hover:not(:disabled) { background: color-mix(in oklch, var(--color-critical) 12%, var(--color-surface-raised)); }
	.btn-full { width: 100%; padding: var(--pad-xs) var(--pad-sm); }
	.dev-reset-error {
		margin-top: var(--marg-xs);
		color: var(--color-critical);
		font-size: var(--text-xs);
		word-break: break-all;
	}
	}
</style>
