<script lang="ts">
    import type { PageProps } from './$types.js';
    import CardForm from '$lib/main-ui/card/CardForm.svelte';

    let { params }: PageProps = $props();
    let collection = $derived(params.collection);
    let id = $derived(params.id);
</script>

<CardForm {collection} dataId={id} mode="show" />
