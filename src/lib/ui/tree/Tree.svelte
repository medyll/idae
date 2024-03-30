<svelte:options accessors={true} />

<script lang="ts">
	import { trans2Tree } from './tree.utils.js';
	import type { Data, TreeItemType } from './types.js';
	import Icon from '$lib/base/icon/Icon.svelte';
	import { dataOp } from '$lib/utils/engine/utils.js';

	let className = '';
	export { className as class };
	export let element: HTMLDivElement | null = null;

	export let data: Data[] = [];
	export let paths: Record<string, any>[] = [];
	export let pathField: string = 'path';

	let finalPaths: TreeItemType[];

	// private use
	export let pathes: TreeItemType[] = trans2Tree(paths, pathField);
	// private use
	export let level: number = 0;
	// private use
	export let selectedDataKeys: string[] = [];
	/** exported data */
	export let selectedData: Data[] = [];
	/** exported selected paths */
	export let selectedPathes: string[] = [];
	/** the split we use to build hierarchy */
	export let splitter: string = '/';
	/** show checkbox to select */
	export let showCheckBox: boolean = false;

	let visibleChildChild: Record<string, boolean> = {};
	export let selectedCategory: string = '';

	$: finalPaths = trans2Tree(paths, pathField);

	$: selectedData = selectedDataKeys.map((dataKey) => {
		return dataOp.filterListFirst(paths, dataKey, pathField);
	});

	$: selectedPathes = selectedDataKeys;

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

<div bind:this={element} class="treeRoot {className}">
	{#each pathes as pat, k}
		<div data-category={pat.path} class=" ">
			<div
				data-category-title={pat.path}
				data-selected={selectedCategory === pat.path}
				on:click={(event) => {
					selectedCategory = pat.path;
					toggle(pat.path);
				}}
				title={pat.path}
				style="--tree-level:{level * 1.5}rem"
				class="gap-tiny tree-cell"
			>
				<div class="tree-cellArrow">
					{#if pat?.children?.length}
						<Icon icon="chevron-{visibleChildChild[pat.path] ? 'down' : 'right'}" />
					{/if}
				</div>
				<div class="tree-cellTitleGutter">
					{#if showCheckBox}
						<div>
							<input
								on:click={(event) => {
									event.stopPropagation();
									handleCheck(pat, event?.currentTarget?.checked);
								}}
								type="checkbox"
								style="display:block;border:1px solid red;"
								checked={Boolean(selectedDataKeys.includes(pat.path))}
							/>
						</div>
					{/if}
					<slot item={pat}><div>{pat.name}</div></slot>
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
