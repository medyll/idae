# Tooltip

Infobulle, équivalent Material-UI.

## Props
- text: string (texte à afficher)
- position: 'top' | 'bottom' | 'left' | 'right' (défaut: 'top')
- openDelay: number (défaut: 200ms)
- closeDelay: number (défaut: 100ms)
- class, style

## Utilisation
```svelte
<Tooltip text="Aide rapide" position="right">
  <Button>?</Button>
</Tooltip>
```
