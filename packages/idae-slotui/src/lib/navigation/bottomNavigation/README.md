# BottomNavigation

Barre de navigation inférieure, équivalent Material-UI.

## Props
- value: any (valeur sélectionnée)
- class, style

## Utilisation
```svelte
<BottomNavigation>
  <Button on:click={() => handleChange('home')}>Home</Button>
  <Button on:click={() => handleChange('search')}>Search</Button>
</BottomNavigation>
```
