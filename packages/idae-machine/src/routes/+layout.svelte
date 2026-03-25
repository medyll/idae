<script lang="ts">
    import type { LayoutProps } from './$types.js';
    import "../app.css";

    let { data, children }: LayoutProps = $props();
</script>

{@render children()}