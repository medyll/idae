<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div data-auto-track="true">
	<div>
		<div></div>
	</div>
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
</div>
