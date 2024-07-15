<script lang="ts">
    import { type StyleSheet,type BreakPoints} from './types.js'; 
 import {configCssVars,toContainerQuery} from "./utils.js"
    let {
        breakpoints,showSelectors
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
  {#if showSelectors}
    <pre>
        {JSON.stringify(configCssVars, undefined,' ' ) }
    </pre>
    <pre>
        {JSON.stringify(toContainerQuery('hideMaxWidth','115px'), undefined,' ' ) }
    </pre>
{/if}
   
<style lang="scss">
    @import './stylesheet.scss';
</style>