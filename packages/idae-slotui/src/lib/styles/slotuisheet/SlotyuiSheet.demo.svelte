<script lang="ts">
	import {be} from "@medyll/idae-be"
	import {cssDom} from "@medyll/dom-events"
    import StyleSheet from './SlotuiSheet.svelte';
    import {configCssVars,toContainerQuery} from "./utils.js";


const tag = "hideMaxWidth"
    cssDom('[hideMaxWidth]').each((element,changes) => {
        console.log ( be(element as HTMLElement).attr.get(tag) );
        let tagValue = be(element as HTMLElement).attr.get(tag);

        if (tag && tagValue) {
            let objTag =   toContainerQuery(tag,tagValue);
            console.log(objTag)
            be(element).classAdd(objTag.class) 
            .setStyle(objTag.style)
		    console.log(element,changes);

            be(element).up('[container]').setStyle(objTag.style)
            console.log(be(element).up('[container]').node)
        }
	})
</script>

<StyleSheet  showSelectors={true} />


<div container="size" class="container-size" style="container:size;width:135px;relative">
    <div hideMaxWidth="115px"  >hideMaxWidth</div>
</div>