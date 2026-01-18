// tailwind-slotui-presets.js
// Plugin Tailwind pour générer toutes les utilitaires slotui-* à partir des presets

const plugin = require('tailwindcss/plugin');

const widthPresets = {
  tiny: '2rem',
  mini: '3rem',
  small: '10rem',
  med: '14rem',
  kind: '20rem',
  full: '100%',
  auto: 'auto',
  default: '10rem',
};
const tallPresets = {
  tiny: '1rem',
  mini: '1.5rem',
  small: '2.5rem',
  med: '3.5rem',
  kind: '4rem',
  auto: 'auto',
  default: '2.5rem',
};
const gutterPresets = {
  tiny: '0.25rem',
  mini: '0.5rem',
  small: '1rem',
  med: '2rem',
  kind: '3rem',
  default: '1rem',
};
const padPresets = {
  tiny: '0.25rem',
  small: '0.5rem',
  med: '1rem',
  large: '1.5rem',
};
const radiusPresets = {
  tiny: '2px',
  small: '4px',
  med: '8px',
  large: '16px',
};
const elevationPresets = {
  0: 'none',
  1: 'var(--shadow-elevation1)',
  2: 'var(--shadow-elevation2)',
  3: 'var(--shadow-elevation3)',
  4: 'var(--shadow-elevation4)',
  5: 'var(--shadow-elevation5)',
};

module.exports = plugin(function({ addUtilities }) {
  const newUtilities = {};
  // Width
  Object.entries(widthPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-ui-width-${key}`] = { width: value };
  });
  // Tall
  Object.entries(tallPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-ui-tall-${key}`] = { minHeight: value, height: value };
  });
  // Gutter
  Object.entries(gutterPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-ui-gutter-${key}`] = { padding: value, gap: value };
  });
  // Pad
  Object.entries(padPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-ui-pad-${key}`] = { padding: value };
  });
  // Radius
  Object.entries(radiusPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-ui-radius-${key}`] = { borderRadius: value };
  });
  // Elevation
  Object.entries(elevationPresets).forEach(([key, value]) => {
    newUtilities[`.slotui-elevation-${key}`] = { boxShadow: value };
  });
  // Ajoute d'autres utilitaires ici si besoin
  addUtilities(newUtilities, ['responsive']);
});
