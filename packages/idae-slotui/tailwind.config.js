/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./src/lib/**/*.{html,js,svelte,ts}",
    "./src/routes/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00b5e2",
        secondary: "#330c2f",
        tertiary: "#cacaaa",
        foreground: {
          light: "#282230",
          dark: "#f1f1f1",
        },
        background: {
          light: "#f1f1f1",
          dark: "#27323a",
        },
        paper: {
          light: "#ededed",
          dark: "#3a3b3b",
        },
        border: "var(--sld-color-border)",
        success: "#075c07",
        info: "#ffd324",
        warning: "#b49104",
        alert: "#cc5c00",
        error: "#cc0000",
        disabled: "#ccc",
        discrete: "#ccc",
      },
      borderRadius: {
        tiny: "2px",
        sm: "4px",
        med: "8px",
        large: "16px",
        DEFAULT: "var(--sld-radius)",
      },
      gap: {
        tiny: "0.25rem",
        mini: "0.4rem",
        small: "0.5rem",
        med: "1rem",
        large: "1.5rem",
        default: "0.5rem",
      },
      padding: {
        tiny: "0.25rem",
        small: "0.5rem",
        med: "1rem",
        large: "1.5rem",
      },
      width: {
        tiny: "2rem",
        mini: "3rem",
        small: "10rem",
        med: "14rem",
        kind: "20rem",
        full: "100%",
        auto: "auto",
        default: "10rem",
      },
      height: {
        tiny: "1rem",
        mini: "1.5rem",
        small: "2.5rem",
        med: "3.5rem",
        kind: "4rem",
        auto: "auto",
        default: "2.5rem",
      },
      margin: {
        gutterTiny: "0.25rem",
        gutterMini: "0.5rem",
        gutterSmall: "1rem",
        gutterMed: "2rem",
        gutterKind: "3rem",
        gutterDefault: "1rem",
      },
      boxShadow: {
        elevation1:
          "0 0 1.75px 0 rgba(0,0,0,0.15), 0 0.15px 0.46px 0 rgba(0,0,0,0.1)",
        elevation2:
          "0 0 3.44px 0 rgba(0,0,0,0.15), 0 0.3px 0.93px 0 rgba(0,0,0,0.1)",
        elevation3:
          "0 0 5.17px 0 rgba(0,0,0,0.15), 0 0 1.39px 0 rgba(0,0,0,0.1)",
        elevation4:
          "0 0 6.89px 0 rgba(0,0,0,0.15), 0 0.61px 1.86px 0 rgba(0,0,0,0.1)",
        elevation5:
          "0 0 8.62px 0 rgba(0,0,0,0.15), 0 0.76px 2.32px 0 rgba(0,0,0,0.1)",
      },
      screens: {
        xs: "320px",
        sm: "480px",
        md: "640px",
        lg: "960px",
        xl: "1280px",
        xxl: "1920px",
        xxxl: "1440px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
