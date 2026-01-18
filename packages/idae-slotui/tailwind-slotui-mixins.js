// tailwind-slotui-mixins.js
// Plugin Tailwind pour générer toutes les utilitaires slotui-* issues des mixins

const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
  const newUtilities = {
    // Variants
    '.slotui-variant-square': { aspectRatio: '1 / 1', height: 'auto' },
    '.slotui-variant-rounded': { borderRadius: '50%' },
    // Ellipsis
    '.slotui-ui-ellipsis': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    '.slotui-ui-ellipsis-line-1': { display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' },
    '.slotui-ui-ellipsis-line-2': { display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' },
    '.slotui-ui-ellipsis-line-3': { display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' },
    '.slotui-ui-ellipsis-line-4': { display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' },
    '.slotui-ui-ellipsis-line-5': { display: '-webkit-box', WebkitLineClamp: '5', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' },
    // Data states
    '.slotui-data-hover:hover': { borderColor: 'var(--sld-hover-border-color)', backgroundColor: 'var(--sld-background-disabled)' },
    '.slotui-data-selected.selected': { backgroundColor: 'var(--sld-selected-background-color, var(--sld-color-background-darken-mid))', boxShadow: 'var(--sld-selected-shadow)' },
    '.slotui-data-selected[aria-selected="true"]': { backgroundColor: 'var(--sld-selected-background-color, var(--sld-color-background-darken-mid))', boxShadow: 'var(--sld-selected-shadow)' },
    // Flex utilities
    '.slotui-flex-row': { display: 'flex', flexDirection: 'row', alignItems: 'flex-start' },
    '.slotui-flex-col': { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
    '.slotui-flex-main': { flex: '1 1 0' },
    // Transition
    '.slotui-ui-transition': { transition: 'all 0.25s ease' },
  };
  addUtilities(newUtilities, ['responsive']);
});
