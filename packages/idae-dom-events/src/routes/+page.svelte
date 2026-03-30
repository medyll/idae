<script lang="ts">
	import '$lib/htmluModules.js';
	import { cssDom, htmlDom } from '$lib/index.js';
	
	cssDom('[data-cssDom]', {}).each((element, changes) => {
		console.log(element, changes);
	});

	let timer: ReturnType<typeof setTimeout>;
	let timerData = 0;
	let timerDelay = 5000;

	let showWidget = $state(false);

	function playIt(delay: number) {
		timer = setTimeout(() => {
			timerData = Math.random(0, 200);
			if (typeof document !== 'undefined')
				document?.querySelector('[data-widget]')?.setAttribute('lang', timerData);
			playIt(delay);
		}, delay);
	}

	$effect(() => {
		playIt(timerDelay);
		return () => {
			clearTimeout(timer);
		};
	});
</script>

<div id="widget" lang="frede" data-widget>
	<button
		onclick={() => {
			showWidget = !showWidget;
		}}>showWidget</button
	>
	<button
		onclick={() => {
			timerDelay += 1000;
		}}>- 1000</button
	>
	{timerDelay}
	<button
		onclick={() => {
			timerDelay -= 1000;
		}}>+ 1000</button
	>
	<p>Page content</p>
	<p>Page content</p>
	{timerData}
</div>
<div data-cssDom="true">data-cssDom !!</div>
<div data-htmlu-path="" data-htmlu-module-id="myModuleAuusi">
	<div data-htmlu-click=""></div>
</div>
{#if showWidget}
	<div data-htmlu-module-id="myModule">module !!</div>
	<div data-auto-track="true">module !!</div>
	<div data-auto-track="true">module !!</div>
	<div data-auto-track="true" data-htmlu-module>module !!</div>
	<!-- <div data-auto-track="true">
		<script data-attr="htmludom" lang="ts">
			//console.log(this);
			window.der = function () {
				// Amazing stuff!
				console.log('der', this);
			};

			var fr = function () {
				console.log('fr', this);
			};

			function getRequest() {
				console.log('getRequest', this);
			}

			window.der.bind(this)();
			fr.bind(this)();
			getRequest.bind(this)();
		</script>
		auto-track
	</div> -->
{/if}
