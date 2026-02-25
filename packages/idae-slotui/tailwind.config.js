/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        paper: 'var(--color-paper)',
      },
      boxShadow: {
        'slotui-elev-1': 'var(--shadow-elevation1)',
        'slotui-elev-2': 'var(--shadow-elevation2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('./tailwind-slotui-presets'),
    require('./tailwind-slotui-mixins'),
  ],
};
