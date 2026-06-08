<script lang="ts">
	import { readable } from "svelte/store";

    const data_object = {
        travel: {
            id: 6,
            code: "red",
            fks: {
                destination_1: {
                    ...fields from models.fk,
                    data: {/* id:1,...fields */} linked_data
                },
                destination_2: {
                    ...fields from models.fk, 
                    data: /* id:2,...fields */},
            }
        }
    }

    "fks": {
    "destination_1": {
        "order":   1,
        "default": true,
        "destination":    { "id": 1, "name": "Paris", "code": "1" }
    },
    "destination_2": {
        "order":   2,
        "destination":    { "id": 2, "name": "Rome",  "code": "2" }
    }
}


    const tests = { 
        fks : {
            uuid : {
                collection: 'destination',
                id: 1, 
            }
        }
    }

</script>