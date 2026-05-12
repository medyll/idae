<script lang="ts">
    import type { LayoutProps } from './$types.js';
    import "../app.css";
  import AppShell from '$lib/main-ui/layout/AppShell.svelte';

    let { data, children }: LayoutProps = $props();
</script>
<AppShell>
    </AppShell>

{@render children()}