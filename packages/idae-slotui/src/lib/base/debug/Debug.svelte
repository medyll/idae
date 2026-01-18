/**
 * Debug.svelte
 * Zone d'affichage pour le débogage, affiche les props reçues et un exemple de Cartouche.
 *
 * Utilisé pour le développement et la visualisation des données de props.
 */
<script lang="ts">
  import Cartouche from "$lib/base/cartouche/Cartouche.svelte";
  import type TabsItemsProps from "$lib/navigation/tabs/Tabs.svelte";

  const items: TabsItemsProps = [
    { label: "theTitle", code: "theTitle1" },
    { label: "theTitle bis", code: "theTitle2" },
    {
      label: "theTitle ter",
      code: "theTitle3",
      component: Cartouche,
      componentProps: { label: "dynamic" },
    },
  ];
</script>

<div class="p-2">
  <Cartouche isOpen={true} primary="debug zone here">
    <pre>{JSON.stringify($$props, null, " ")}</pre>
  </Cartouche>
</div>
