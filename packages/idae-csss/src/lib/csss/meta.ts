import type { OpCssF } from "./types";

/**
 * Metadata about the style model for documentation and generation
 */
export const StyleModelMeta: Record<keyof OpCssF, any> = {
  layout: {
    label: "Layout & Flow",
    description:
      "Controls how the element is placed in the document and how its children are arranged.",
    properties: {
      display: { css: "display" },
      flow: { css: "position" },
      order: { css: "order" },
      z: { css: "z-index" },
    },
  },
  content: {
    label: "Content Alignment",
    description:
      "Handles alignment and distribution of children (Flexbox/Grid).",
    properties: {
      align: { css: "align-items" },
      justify: { css: "justify-content" },
      wrap: { css: "flex-wrap" },
    },
  },
  overflow: {
    label: "Content Overflow",
    description:
      "Handles how content behaves when it exceeds the element's bounds.",
    properties: {
      over: { css: "overflow" },
      x: { css: "overflow-x" },
      y: { css: "overflow-y" },
      scroll: { css: "scroll-behavior" },
    },
  },
  snap: {
    label: "Relationship & Positioning (Snap)",
    description: "Anchor positioning and precise coordinate placement.",
    properties: {
      name: {
        css: "anchor-name",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name",
      },
      to: {
        css: "position-anchor",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/position-anchor",
      },
      top: { css: "top" },
      bottom: { css: "bottom" },
      left: { css: "left" },
      right: { css: "right" },
      inset: { css: "inset" },
    },
  },
  shape: {
    label: "Dimensions & Spacing",
    description:
      "Defines the physical footprint and internal/external spacing.",
    properties: {
      width: {
        css: "width",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/width",
      },
      height: {
        css: "height",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/height",
      },
      ratio: {
        css: "aspect-ratio",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
      },
    },
  },
  boundaries: {
    label: "Dimension Constraints",
    description: "Defines minimum and maximum size constraints.",
    properties: {
      minW: {
        css: "min-width",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-width",
      },
      minH: {
        css: "min-height",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-height",
      },
      maxW: {
        css: "max-width",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-width",
      },
      maxH: {
        css: "max-height",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height",
      },
    },
  },
  gutter: {
    label: "Spacing & Gutter",
    description:
      "Handles internal and external spacing and gaps between elements.",
    properties: {
      margin: {
        css: "margin",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin",
      },
      padding: {
        css: "padding",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding",
      },
      gap: {
        css: "gap",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/gap",
      },
    },
  },
  colors: {
    label: "Colors & Branding",
    description: "Handles background and text colors.",
    properties: {
      bg: {
        css: "background",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/background",
      },
      text: {
        css: "color",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/color",
      },
    },
  },
  contour: {
    label: "Contour & Borders",
    description: "Handles borders, outlines, and corner rounding.",
    properties: {
      radius: {
        css: "border-radius",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius",
      },
      border: {
        css: "border",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/border",
      },
      outline: {
        css: "outline",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline",
      },
      offset: {
        css: "outline-offset",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset",
      },
    },
  },
  visual: {
    label: "Visual Style",
    description: "Handles overall visual appearance properties.",
    properties: {
      shadow: {
        css: "box-shadow",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow",
      },
      opacity: {
        css: "opacity",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/opacity",
      },
      cursor: {
        css: "cursor",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/cursor",
      },
      clip: { css: "clip-path" },
      filter: { css: "filter" },
    },
  },
  effect: {
    label: "Visual Effects",
    description: "Post-processing and blending effects.",
    properties: {
      blend: { css: "mix-blend-mode" },
      backdrop: { css: "backdrop-filter" },
      isolate: { css: "isolation" },
    },
  },
  mask: {
    label: "Masking & Gradients",
    description: "Image masking and complex clipping/gradient logic.",
    properties: {
      image: { css: "mask-image" },
      size: { css: "mask-size" },
      position: { css: "mask-position" },
      repeat: { css: "mask-repeat" },
      clip: { css: "mask-clip" },
    },
  },
  scroll: {
    label: "Scroll & Snap",
    description: "Scroll behavior and precision snapping controls.",
    properties: {
      snap: { css: "scroll-snap-type" },
      align: { css: "scroll-snap-align" },
      stop: { css: "scroll-snap-stop" },
    },
  },
  typo: {
    label: "Typography",
    description: "Text-specific styling and font management.",
    properties: {
      face: { css: "font-family" },
      size: { css: "font-size" },
      weight: { css: "font-weight" },
      align: { css: "text-align" },
      lineHeight: { css: "line-height" },
      spacing: { css: "letter-spacing" },
      transform: { css: "text-transform" },
      decoration: { css: "text-decoration" },
      wrap: {
        css: "text-wrap",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap",
      },
      variation: {
        css: "font-variation-settings",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings",
      },
      indent: { css: "text-indent" },
      rendering: { css: "text-rendering" },
    },
  },
  ui: {
    label: "User Interface",
    description: "Interactivity, selection, and native element behavior.",
    properties: {
      accent: { css: "accent-color" },
      caret: { css: "caret-color" },
      pointer: { css: "pointer-events" },
      select: { css: "user-select" },
      appearance: { css: "appearance" },
      touch: { css: "touch-action" },
    },
  },
  perf: {
    label: "Performance",
    description: "Rendering hints and browser optimization.",
    properties: {
      visibility: {
        css: "content-visibility",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility",
      },
      intrinsic: { css: "contain-intrinsic-size" },
      willChange: { css: "will-change" },
      contain: { css: "contain" },
    },
  },
  vars: {
    label: "CSS Variables",
    description: "Custom CSS properties (variables).",
    properties: {},
  },
  motion: {
    label: "Motion & Transform",
    description: "Animations, transitions, and 2D/3D transformations.",
    properties: {
      transition: { css: "transition" },
      animate: { css: "animation" },
      duration: { css: "transition-duration" },
      easing: { css: "transition-timing-function" },
      delay: { css: "transition-delay" },
      transform: { css: "transform" },
      viewTransition: { css: "view-transition-name" },
    },
  },
  state: {
    label: "States & Context",
    description: "Conditional styling for interactivity and states.",
    properties: {
      active: { description: "Style when element is active" },
      hover: { description: "Style on mouse hover" },
      focus: { description: "Style on keyboard focus" },
      disabled: { description: "Style when element is disabled" },
    },
  },
  scale: {
    label: "Responsive & Scale",
    description: "Responsive adjustments via Media and Container queries.",
    properties: {
      container: { description: "Container queries based on parent size" },
      media: { description: "Standard screen-size media queries" },
    },
  },
};

/**
 * Documentor class to explore and document the OpCssF model
 */
export class StyleDocumentor {
  /**
   * Returns a JSON representation of the model with descriptions
   */
  getSchema() {
    return StyleModelMeta;
  }

  /**
   * Generates a markdown guide for the style model
   */
  generateMarkdown() {
    let md = "# OpCssF Style Model Specification\n\n";

    md +=
      "> This specification defines the semantic style model used in the Idae ecosystem.\n\n";

    const renderProps = (props: any, prefix = "") => {
      let rows = "";
      for (const [prop, data] of Object.entries(props)) {
        if (data.css) {
          rows += `| \`${prefix}${prop}\` | \`${data.css}\` | ${data.description ?? "-"} |\n`;
        } else if (typeof data === "object" && !data.description) {
          rows += renderProps(data, `${prefix}${prop}.`);
        }
      }
      return rows;
    };

    for (const [key, meta] of Object.entries(StyleModelMeta)) {
      md += `## ${meta.label} (\`${key}\`)\n`;
      md += `${meta.description}\n\n`;

      if (meta.properties && Object.keys(meta.properties).length > 0) {
        md += "| Property | CSS Mapping | Description |\n";
        md += "|----------|-------------|-------------|\n";
        md += renderProps(meta.properties);
        md += "\n";
      }
    }

    return md;
  }

  /**
   * Generates a data structure for interactive documentation (UI-ready)
   */
  getInteractiveManifest() {
    return Object.entries(StyleModelMeta).map(([id, meta]) => ({
      id,
      ...meta,
    }));
  }
}
