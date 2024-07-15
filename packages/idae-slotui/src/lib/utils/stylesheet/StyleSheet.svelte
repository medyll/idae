<script lang="ts">
    import type {StyleSheet,BreakPoints} from './types.js';

    let {
        breakpoints,
    }:StyleSheet = $props();

    function castToCssProps(breakpoints: BreakPoints | undefined) {
        if (!breakpoints) return '';
        let cssProps = '';
        for (let key in breakpoints) {
            cssProps += `--${key}: ${breakpoints[key]};`;
        }
        return cssProps;        
    } 
</script>
<svelte:head>
    {castToCssProps(breakpoints)}
</svelte:head>

<style lang="scss">
    @import './stylesheet.scss';
</style>