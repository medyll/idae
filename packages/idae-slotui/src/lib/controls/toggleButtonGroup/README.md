# ToggleButtonGroup

Groupe de boutons à sélection unique ou multiple, équivalent Material-UI.

## Props
- value: any (valeur sélectionnée)
- exclusive: boolean (sélection unique si true)
- orientation: 'horizontal' | 'vertical' (défaut: 'horizontal')
- class, style

## Utilisation
```svelte
<ToggleButtonGroup exclusive>
  <Button on:click={() => handleToggle('A')}>A</Button>
  <Button on:click={() => handleToggle('B')}>B</Button>
</ToggleButtonGroup>
```
