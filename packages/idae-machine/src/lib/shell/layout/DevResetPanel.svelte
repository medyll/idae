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
	.dev-reset-panel {
		border: 2px solid #f59e0b;
		border-radius: 6px;
		background: #fffbeb;
		padding: 0.75rem;
		font-size: 0.8rem;
	}
	.dev-reset-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.dev-badge {
		background: #f59e0b;
		color: white;
		font-size: 0.65rem;
		font-weight: 700;
		padding: 1px 5px;
		border-radius: 3px;
		letter-spacing: 0.05em;
	}
	.dev-reset-steps {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		margin-bottom: 0.5rem;
	}
	.step {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.step-icon { width: 1.2em; text-align: center; }
	.step-label { flex: 1; }
	.dev-reset-actions { margin-top: 0.5rem; }
	.btn-dev {
		padding: 2px 8px;
		font-size: 0.75rem;
		border: 1px solid #d97706;
		background: white;
		border-radius: 3px;
		cursor: pointer;
	}
	.btn-dev:hover:not(:disabled) { background: #fef3c7; }
	.btn-dev:disabled { opacity: 0.5; cursor: not-allowed; }
	.btn-danger { border-color: #dc2626; color: #dc2626; }
	.btn-danger:hover:not(:disabled) { background: #fef2f2; }
	.btn-full { width: 100%; padding: 4px 8px; }
	.dev-reset-error {
		margin-top: 0.4rem;
		color: #dc2626;
		font-size: 0.75rem;
		word-break: break-all;
	}
</style>
