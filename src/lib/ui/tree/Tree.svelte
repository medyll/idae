<svelte:options />

<script lang="ts" generics="T = Data">
	import type { Snippet } from 'svelte';

	import { trans2Tree } from './tree.utils.js';
	import type { Data, TreeItemType } from './types.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';
	import type { CommonProps } from '$lib/types/index.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

	type TreeProps = CommonProps & {
		/** data to be displayed in the tree */
		data?: T[];

		/** paths to be displayed in the tree */
		paths: Record<string, any>[];

		/** field to be used for paths */
		pathField?: string;

		/** private use */
		pathes?: TreeItemType[];

		/** private use */
		level?: number;

		/** private use */
		selectedDataKeys?: string[];

		/** exported data */
		selectedData?: T[];

		/** exported selected paths */
		selectedPathes?: string[];

		/** the split we use to build hierarchy */
		splitter?: string;

		/** show checkbox to select */
		showCheckBox?: boolean;

		/** selected category */
		selectedCategory?: string;

		element?: HTMLElement;
		children?: Snippet<[{ item: TreeItemType; idx: number }]>;
	};

	let {
		class: className = '',
		pathField = 'path',
		level = 0,
		splitter = '/',
		element = $bindable(),
		data = $bindable([]),
		paths = $bindable([]),
		showCheckBox = $bindable(false),
		selectedCategory = $bindable(''),
		selectedDataKeys = $bindable([]),
		selectedData = $bindable([]),
		selectedPathes = $bindable([]),
		pathes = trans2Tree(paths, pathField),
		children
	}: TreeProps = $props();

	let visibleChildChild: Record<string, boolean> = $state({});
	let finalPaths: TreeItemType[] = $state([]);

	$effect(() => {
		finalPaths = trans2Tree(paths, pathField);
		selectedData = selectedDataKeys.map((dataKey) => {
			return dataOp.filterListFirst(paths, dataKey, pathField);
		});
		selectedPathes = selectedDataKeys;
	});

	function handleCheck(dataObj: TreeItemType, act: boolean) {
		if (act) {
			selectedDataKeys = [...selectedDataKeys, dataObj.path].filter((x) => x);
		} else {
			delete selectedDataKeys[selectedDataKeys?.indexOf(dataObj.path)];
			selectedDataKeys = [...selectedDataKeys].filter((x) => x);
		}
		// select all children down
		setChildrenState(dataObj.children, act);
		setParentState(dataObj, act);
	}

	function setParentState(dataObj: TreeItemType, act: boolean) {
		const arrP = dataObj.path.split(splitter);

		arrP.forEach((path, index) => {
			let checkPath = arrP.slice(0, index).join(splitter);

			if (act) {
				selectedDataKeys = [...selectedDataKeys, checkPath].filter((x) => x);
			} else {
				delete selectedDataKeys[selectedDataKeys?.indexOf(checkPath)];
				selectedDataKeys = [...selectedDataKeys].filter((x) => x);
			}
		});
	}

	function setChildrenState(dataObj: TreeItemType[], act: boolean) {
		if (dataObj.length) {
			dataObj.forEach((treeItem) => {
				if (act) {
					selectedDataKeys = [...selectedDataKeys, treeItem.path].filter((x) => x);
				} else {
					delete selectedDataKeys[selectedDataKeys?.indexOf(treeItem.path)];
					selectedDataKeys = [...selectedDataKeys].filter((x) => x);
				}
				setChildrenState(treeItem.children, act);
			});
		}
	}

	function toggle(path: string, visibility?: boolean) {
		visibleChildChild[path] = visibility ?? !visibleChildChild[path];
	}
</script>

<div bind:this={element} class="tree {className}">
	{#each pathes as pat, k}
		<div data-category={pat.path}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				data-category-title={pat.path}
				data-selected={selectedCategory === pat.path}
				onclick={(event) => {
					selectedCategory = pat.path;
					toggle(pat.path);
				}}
				title={pat.path}
				style="--tree-level:{level * 1.5}rem"
				class="tree-cell"
			>
				<div class="tree-cell-arrow">
					{#if pat?.children?.length}
						<Icon icon="chevron-{visibleChildChild[pat.path] ? 'down' : 'right'}" />
					{/if}
				</div>
				<div class="tree-cell-title-gutter">
					{#if showCheckBox}
						<input
							onclick={(event) => {
								event.stopPropagation();
								handleCheck(pat, event?.currentTarget?.checked);
							}}
							type="checkbox"
							style="display:block;border:1px solid red;"
							checked={Boolean(selectedDataKeys.includes(pat.path))}
						/>
					{/if}
					<Slotted child={children} slotArgs={{ item: pat, idx: k }}>
						<div>{pat.name}</div>
					</Slotted>
				</div>
			</div>
			<div
				data-category-children={pat.path}
				style="display:{visibleChildChild[pat.path] ? '' : 'none'};"
			>
				{#if pat?.children?.length}
					<svelte:self
						level={level + 1}
						bind:selectedDataKeys
						bind:data
						bind:selectedCategory
						bind:showCheckBox
						pathes={pat.children}
					/>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	@import './tree.scss';
</style>
