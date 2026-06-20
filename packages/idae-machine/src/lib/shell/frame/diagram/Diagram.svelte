<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { buildGraph } from '$lib/data-ui/utils/diagramUtils.js';
	import type { DiagramEdge, DiagramGraph, DiagramNode } from '$lib/types/index.js';

	let {
		collection,
		collectionId,
		depth = 1,
		direction = 'both',
	}: {
		collection:   string;
		collectionId: string | number;
		depth?:       number;
		direction?:   'forward' | 'reverse' | 'both';
	} = $props();

	let graph:    DiagramGraph | null = $state(null);
	let status:   'loading' | 'ready' | 'error' = $state('loading');
	let errorMsg: string = $state('');

	$effect(() => {
		status   = 'loading';
		graph    = null;
		errorMsg = '';
		
		// Check if collection exists before trying to build graph
		try {
			const collectionExists = machine.logic.collection(collection);
			if (!collectionExists) {
				throw new Error(`Collection "${collection}" not found in the data model.`);
			}
			
			buildGraph(collection, collectionId, { depth, direction })
				.then(g  => { graph = g; status = 'ready'; })
				.catch(e => {
					console.error('[Diagram] Error building graph:', e);
					errorMsg = String(e);
					status = 'error';
				});
		} catch (e) {
			console.error('[Diagram] Error initializing:', e);
			errorMsg = String(e);
			status = 'error';
		}
	});

	// ── SVG layout ────────────────────────────────────────────────────────────
	const CX = 300, CY = 300, ORBIT = 200, R_ROOT = 28, R_NODE = 20;

	interface PositionedNode extends DiagramNode {
		x:      number;
		y:      number;
		isRoot: boolean;
	}

	const positionedNodes = $derived.by((): PositionedNode[] => {
		const g = graph;
		if (!g) return [];
		const root = g.nodes.find(n => n.id === g.root);
		if (!root) return [];
		const neighbors = g.nodes.filter(n => n.id !== g.root);
		const N = neighbors.length;
		const result: PositionedNode[] = [{ ...root, x: CX, y: CY, isRoot: true }];
		neighbors.forEach((n, i) => {
			const angle = N === 1
				? 0
				: (i / N) * 2 * Math.PI - Math.PI / 2;
			result.push({
				...n,
				x:      CX + ORBIT * Math.cos(angle),
				y:      CY + ORBIT * Math.sin(angle),
				isRoot: false,
			});
		});
		return result;
	});

	const dedupedEdges = $derived.by((): DiagramEdge[] => {
		const g = graph;
		if (!g) return [];
		const seen = new Set<string>();
		return g.edges.filter(e => {
			const key = `${e.from}→${e.to}:${e.relationKey}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	});

	function nodePos(id: string): PositionedNode | undefined {
		return positionedNodes.find(n => n.id === id);
	}

	function openRecord(node: PositionedNode) {
		if (node.isRoot) return;
		void machine.framer.loadInDialog('fiche', node.collection, node.record['id'] as string | number | undefined);
	}
</script>

<diagram-component>
	{#if status === 'loading'}
		<p class="diagram-status">Loading…</p>
	{:else if status === 'error'}
		<p class="diagram-status diagram-status--error">
			{errorMsg}
			{#if errorMsg.includes('not found')}
				<br><br>
				<small>Tip: Check that you're viewing a valid record and that the collection exists in your data model.</small>
			{/if}
		</p>
	{:else if graph}
		<diagram-canvas>
			<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Relation diagram for {collection}">
				<defs>
					<marker id="arrow-fwd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
						<path d="M0,0 L0,6 L8,3 z" fill="var(--color-primary)" />
					</marker>
					<marker id="arrow-rev" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
						<path d="M0,0 L0,6 L8,3 z" fill="var(--color-secondary)" />
					</marker>
				</defs>

				<!-- Edges -->
				{#each dedupedEdges as edge (edge.from + edge.to + edge.relationKey)}
					{@const from = nodePos(edge.from)}
					{@const to   = nodePos(edge.to)}
					{#if from && to}
						{@const mx = (from.x + to.x) / 2}
						{@const my = (from.y + to.y) / 2}
						<line
							x1={from.x} y1={from.y}
							x2={to.x}   y2={to.y}
							stroke={edge.direction === 'forward' ? 'var(--color-primary)' : 'var(--color-secondary)'}
							stroke-width="1.5"
							stroke-dasharray={edge.direction === 'reverse' ? '5 3' : undefined}
							marker-end="url(#{edge.direction === 'forward' ? 'arrow-fwd' : 'arrow-rev'})"
						/>
						<text x={mx} y={my - 5} class="edge-label">{edge.relationKey}</text>
					{/if}
				{/each}

				<!-- Nodes -->
				{#each positionedNodes as node (node.id)}
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -- g acts as a button only for non-root nodes (role/tabindex set conditionally) -->
					<g
						class="diagram-node"
						class:diagram-node--root={node.isRoot}
						class:diagram-node--neighbor={!node.isRoot}
						role={node.isRoot ? undefined : 'button'}
						tabindex={node.isRoot ? undefined : 0}
						aria-label={node.isRoot ? undefined : `Open ${node.collection} ${node.label}`}
						onclick={() => openRecord(node)}
						onkeydown={e => (e.key === 'Enter' || e.key === ' ') && openRecord(node)}
					>
						<circle
							cx={node.x} cy={node.y}
							r={node.isRoot ? R_ROOT : R_NODE}
							fill={node.isRoot ? 'var(--color-primary)' : 'var(--color-surface)'}
							stroke={node.isRoot ? 'var(--color-primary-hover)' : 'var(--color-border)'}
							stroke-width="2"
						/>
						<text x={node.x} y={node.y + (node.isRoot ? R_ROOT : R_NODE) + 14} class="node-label">
							{node.label}
						</text>
						<text x={node.x} y={node.y + (node.isRoot ? R_ROOT : R_NODE) + 26} class="node-collection">
							{node.collection}
						</text>
					</g>
				{/each}
			</svg>
		</diagram-canvas>
	{/if}
</diagram-component>

<style>
	@layer components {
		:global(diagram-component) {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			overflow: auto;
		}

		:global(diagram-canvas) {
			display: block;
			flex: 1;
			min-height: 0;
		}
	}

	svg {
		width: 100%;
		height: 100%;
		min-height: 400px;
	}

	.diagram-status {
		padding: var(--pad-md);
		color: var(--color-text-muted);
	}

	.diagram-status--error {
		color: var(--color-critical);
	}

	.node-label {
		font-size: 11px;
		text-anchor: middle;
		fill: var(--color-text);
		pointer-events: none;
		user-select: none;
	}

	.node-collection {
		font-size: 9px;
		text-anchor: middle;
		fill: var(--color-text-muted);
		pointer-events: none;
		user-select: none;
	}

	.edge-label {
		font-size: 9px;
		text-anchor: middle;
		fill: var(--color-text-muted);
		pointer-events: none;
		user-select: none;
	}

	.diagram-node--neighbor {
		cursor: pointer;
	}

	/* --color-primary-light/--color-primary-dark requested but not in css-base
	   tokens — substituted with the closest seeded variants: -muted (lighter
	   tint) and -hover (darker shade). */
	.diagram-node--neighbor:hover circle,
	.diagram-node--neighbor:focus circle {
		fill: var(--color-primary-muted);
		stroke: var(--color-primary);
	}
</style>
