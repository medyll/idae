<script lang="ts">
	import { readable } from "svelte/store";

    const data_object = {
        travel: {
            id: 6,
            code: "red",
            fks: {
                destination_1: {/* id:1,...fields */},
                destination_2: {/* id:2,...fields */},
            }
        }
    }


</script>