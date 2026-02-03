export type all = string | number;
export type top = string | number;
export type bottom = string | number;
export type left = string | number;
export type right = string | number;
export type width = string | number;
export type height = string | number;
export type radius = string | number;
export type spacing = string | number;
export type color = string;
export type duration = string | number;
export type opacity = number;
export type zIndex = number;
export type ratio = string | number;

/**
 * Fundamental CSS Unit types
 */
export type CssValue = string | number;
export type MultiValue =
  | CssValue
  | [CssValue]
  | [CssValue, CssValue]
  | [CssValue, CssValue, CssValue, CssValue];

export type BorderValue = string | [CssValue, string?, string?];
export type OutlineValue = string | [CssValue, string?, string?];
export type ShadowValue = string | string[];
export type TransitionValue = string | string[];
export type GapValue = CssValue | [CssValue, CssValue];

/**
 * OpCssF - The core model for style re-categorization
 */
export interface OpCssF {
  /** Layout and positioning logic */
  layout: {
    display?:
      | "flex"
      | "grid"
      | "block"
      | "inline"
      | "none"
      | "inline-flex"
      | "inline-grid";
    flow?: "absolute" | "fixed" | "static" | "relative" | "sticky";
    order?: number;
    z?: zIndex;
    layer?: "top" | "middle" | "bottom" | number;
  };

  /** Content alignment and distribution */
  content: {
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: "wrap" | "nowrap" | "reverse";
  };

  /**     overflow behavior */
  overflow: {
    over?: "auto" | "scroll" | "hidden" | "visible";
    x?: "auto" | "scroll" | "hidden" | "visible";
    y?: "auto" | "scroll" | "hidden" | "visible";
    scroll?: "smooth" | "auto";
  };

  /** Anchor Positioning and coordinate-based placement */
  snap: {
    /** Defines an anchor name (anchor-name) */
    name?: string;
    /** Points to an anchor (position-anchor) */
    to?: string;
    /** Positioning coordinates */
    top?: top;
    bottom?: bottom;
    left?: left;
    right?: right;
    inset?: MultiValue;
  };

  /** Physical dimensions and spacing */
  shape: {
    w?: width | [width, width] | [width, width, width]; // [val, min, max]
    h?: height | [height, height] | [height, height, height];
    min?: { width?: width; height?: height };
    max?: { width?: width; height?: height };
    ratio?: ratio;
  };

  /** Spacing and gaps */
  gutter: {
    margin?: MultiValue;
    padding?: MultiValue;
    gap?: GapValue;
  };

  /** Colors and branding */
  colors: {
    bg?: color;
    text?: color;
  };

  /** Border and outlines */
  contour: {
    radius?: MultiValue;
    border?: BorderValue;
    outline?: OutlineValue;
    offset?: spacing;
  };

  /** Visual appearance */
  look: {
    shadow?: ShadowValue;
    opacity?: opacity;
    cursor?: string;
    clip?: string;
    filter?: string;
  };

  /** Post-processing and blending effects */
  effect: {
    blend?: "normal" | "multiply" | "screen" | "overlay" | string;
    backdrop?: string;
    isolate?: "auto" | "isolate";
    mix?: string;
  };

  /** Image masking and gradients */
  mask: {
    image?: string;
    size?: string;
    position?: string;
    repeat?: string;
    clip?: string;
  };

  /** Scroll behavior and snapping */
  scroll: {
    snap?: "none" | "x" | "y" | "both" | "mandatory" | "proximity";
    align?: "start" | "center" | "end" | "none";
    stop?: "normal" | "always";
    margin?: MultiValue;
    padding?: MultiValue;
  };

  /** Typography and text rendering */
  typo: {
    face?: string;
    size?: spacing;
    weight?: "normal" | "bold" | "light" | number;
    align?: "left" | "center" | "right" | "justify";
    lineHeight?: spacing;
    spacing?: spacing;
    transform?: "uppercase" | "lowercase" | "capitalize" | "none";
    decoration?: string | [string, string?, string?];
    /** Modern text-wrap (balance, pretty) */
    wrap?: "pretty" | "balance" | "nowrap" | "wrap";
    /** Variable fonts support */
    variation?: string;
    indent?: spacing;
    rendering?: "optimizeSpeed" | "optimizeLegibility" | "geometricPrecision";
  };

  /** Interactivity and UI behavior */
  ui: {
    accent?: color;
    caret?: color;
    pointer?: "auto" | "none" | "all";
    select?: "none" | "text" | "all" | "auto";
    appearance?: "none" | "auto" | string;
    touch?: "auto" | "none" | "manipulation" | "pan-x" | "pan-y";
  };

  /** Performance and Browser hints */
  perf: {
    /** content-visibility */
    visibility?: "visible" | "hidden" | "auto";
    /** contain-intrinsic-size */
    intrinsic?: string;
    willChange?: string;
    contain?: string;
  };

  /** CSS Variables / Custom Properties */
  vars?: Record<string, CssValue>;

  /** Animation and transitions */
  motion: {
    transition?: TransitionValue;
    animate?: string;
    duration?: duration;
    easing?: string;
    delay?: duration;
    transform?: string;
    /** View Transitions API support */
    viewTransition?: string;
  };

  /** Advanced interactivity and states */
  state: {
    active?: OpCssF;
    hover?: OpCssF;
    focus?: OpCssF;
    disabled?: OpCssF;
  };

  /** Responsive scaling and queries */
  scale: {
    /** Container Queries (Modern CSS) */
    container?: Record<string, OpCssF>;
    /** Media Queries (Traditional) */
    media?: Record<string, OpCssF>;
  };
}

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
      w: {
        css: "width",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/width",
      },
      h: {
        css: "height",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/height",
      },
      min: {
        width: {
          css: "min-width",
          spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-width",
        },
        height: {
          css: "min-height",
          spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-height",
        },
      },
      max: {
        width: {
          css: "max-width",
          spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-width",
        },
        height: {
          css: "max-height",
          spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height",
        },
      },
      ratio: {
        css: "aspect-ratio",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
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
  look: {
    label: "Visual Style",
    description: "Handles the aesthetic properties like colors and shadows.",
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
      repeat: { css: "mask-repeat" },
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
      wrap: {
        css: "text-wrap",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap",
      },
      variation: {
        css: "font-variation-settings",
        spec: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings",
      },
    },
  },
  ui: {
    label: "User Interface",
    description: "Interactivity, selection, and native element behavior.",
    properties: {
      accent: { css: "accent-color" },
      pointer: { css: "pointer-events" },
      select: { css: "user-select" },
      appearance: { css: "appearance" },
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
      willChange: { css: "will-change" },
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

/**
 * Core Parser to convert OpCssF to standard CSS
 */
export class OpCssParser {
  /**
   * Parses an OpCssF object into a CSS string
   * @param style The OpCssF style object
   * @param selector Optional selector to wrap the style (e.g. ".my-class")
   */
  parse(style: Partial<OpCssF>, selector?: string): string {
    const rules: string[] = [];

    // Main properties
    const mainRules = this.parseObject(style);
    if (mainRules.length > 0) {
      rules.push(
        selector
          ? `${selector} { ${mainRules.join("; ")} }`
          : mainRules.join("; "),
      );
    }

    // States (hover, focus, etc.)
    if (style.state) {
      for (const [state, stateStyle] of Object.entries(style.state)) {
        const stateRules = this.parseObject(stateStyle as OpCssF);
        if (stateRules.length > 0 && selector) {
          rules.push(`${selector}:${state} { ${stateRules.join("; ")} }`);
        }
      }
    }

    // Scale (media queries, container queries)
    if (style.scale) {
      if (style.scale.media) {
        for (const [query, queryStyle] of Object.entries(style.scale.media)) {
          const queryRules = this.parse(queryStyle as OpCssF, selector);
          if (queryRules) {
            rules.push(`@media ${query} { ${queryRules} }`);
          }
        }
      }
      if (style.scale.container) {
        for (const [query, queryStyle] of Object.entries(
          style.scale.container,
        ) || []) {
          const queryRules = this.parse(queryStyle as OpCssF, selector);
          if (queryRules) {
            rules.push(`@container ${query} { ${queryRules} }`);
          }
        }
      }
    }

    return rules.join("\n");
  }

  /**
   * Parses a .csss string content (Hybrid CSS/JS syntax)
   * Example: body { layout { display: "flex" } }
   */
  parseCsss(content: string): string {
    let clean = content.trim();

    // Check if it's strictly JSON
    if (clean.startsWith("{") && clean.endsWith("}")) {
      try {
        const obj = JSON.parse(clean);
        // If it's a JSON object where keys are selectors
        return Object.entries(obj)
          .map(([sel, style]) => this.parse(style as any, sel))
          .join("\n");
      } catch {
        // Not simple JSON, try parsing as blocks
        // Remove outermost braces if they wrap the entire file
        if (clean.startsWith("{") && clean.endsWith("}")) {
          // But only if they balanced
          let depth = 0;
          let balanced = true;
          for (let i = 0; i < clean.length - 1; i++) {
            if (clean[i] === "{") depth++;
            if (clean[i] === "}") depth--;
            if (depth === 0 && i > 0) {
              balanced = false;
              break;
            }
          }
          if (balanced) clean = clean.substring(1, clean.length - 1).trim();
        }
      }
    }

    const blocks = this.getBlocks(clean);
    return blocks
      .map((block) => {
        const styleObj = this.parseBlockToModel(block.body);
        return this.parse(styleObj, block.selector);
      })
      .join("\n");
  }

  private getBlocks(content: string) {
    const blocks: { selector: string; body: string }[] = [];
    let depth = 0;
    let currentSelector = "";
    let currentBody = "";
    let inSelector = true;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === "{") {
        if (depth === 0) inSelector = false;
        else currentBody += char;
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0) {
          blocks.push({
            selector: currentSelector.trim().replace(/^['"]|['"]$/g, ""),
            body: currentBody.trim(),
          });
          currentSelector = "";
          currentBody = "";
          inSelector = true;
        } else {
          currentBody += char;
        }
      } else {
        if (inSelector) currentSelector += char;
        else currentBody += char;
      }
    }
    return blocks;
  }

  private parseBlockToModel(body: string): Partial<OpCssF> {
    const model: any = {};
    const categories = this.getBlocks(body);

    for (const cat of categories) {
      const name = cat.selector.replace(/[:,"']/g, "").trim();
      try {
        const propsStr = cat.body
          .split(/[,;\n]/)
          .map((line) => {
            const parts = line.split(":");
            if (parts.length < 2) return "";
            const key = parts[0].trim().replace(/^['"]|['"]$/g, "");
            const val = parts.slice(1).join(":").trim().replace(/,$/, "");
            if (!val) return "";
            return `"${key}": ${this.isQuoted(val) ? val : JSON.stringify(val)}`;
          })
          .filter(Boolean)
          .join(",");

        model[name] = JSON.parse(`{${propsStr}}`);
      } catch (e) {
        console.warn(`Failed to parse category ${name} in block:`, e);
      }
    }
    return model;
  }

  private isQuoted(str: string): boolean {
    return (
      (str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'")) ||
      !isNaN(Number(str)) ||
      str.startsWith("[") ||
      str.startsWith("{")
    );
  }

  private parseObject(obj: any): string[] {
    const cssRules: string[] = [];

    for (const [category, values] of Object.entries(obj)) {
      if (category === "state" || category === "scale") continue;

      // Special handling for CSS variables
      if (category === "vars" && values) {
        for (const [vName, vValue] of Object.entries(values as object)) {
          const name = vName.startsWith("--") ? vName : `--${vName}`;
          cssRules.push(`${name}: ${vValue}`);
        }
        continue;
      }

      const meta = StyleModelMeta[category as keyof OpCssF];
      if (!meta || !values) continue;

      for (const [prop, value] of Object.entries(values as object)) {
        const propMeta = meta.properties[prop];
        if (!propMeta) continue;

        if (propMeta.css) {
          cssRules.push(
            `${propMeta.css}: ${this.formatValue(propMeta.css, value)}`,
          );
        } else if (typeof propMeta === "object" && typeof value === "object") {
          // Handle nested properties like shape.min.width
          for (const [subProp, subValue] of Object.entries(value as object)) {
            if (propMeta[subProp]?.css) {
              cssRules.push(
                `${propMeta[subProp].css}: ${this.formatValue(propMeta[subProp].css, subValue)}`,
              );
            }
          }
        }
      }
    }

    return cssRules;
  }

  private formatValue(cssProp: string, value: any): string {
    if (Array.isArray(value)) {
      return value.map((v) => this.normalizeUnit(cssProp, v)).join(" ");
    }
    return this.normalizeUnit(cssProp, value);
  }

  private normalizeUnit(cssProp: string, value: any): string {
    if (typeof value === "number") {
      const noUnitProps = [
        "opacity",
        "z-index",
        "order",
        "flex-grow",
        "flex-shrink",
        "line-height",
      ];
      if (noUnitProps.includes(cssProp)) return String(value);
      return `${value}px`;
    }
    return String(value);
  }
}

/**
 * CsssNode - Manages style application on DOM elements
 */
export class CsssNode {
  private targets: HTMLElement[] = [];
  private parser = new OpCssParser();
  private className: string | null = null;
  private currentCss: string = "";

  private static styleTag: HTMLStyleElement | null = null;
  private static rulesMap: Map<string, string> = new Map();

  constructor(target: string | HTMLElement | HTMLElement[] | NodeList) {
    if (typeof window === "undefined") return;

    if (typeof target === "string") {
      this.targets = Array.from(document.querySelectorAll(target));
    } else if (target instanceof HTMLElement) {
      this.targets = [target];
    } else if (target instanceof NodeList) {
      this.targets = Array.from(target) as HTMLElement[];
    } else if (Array.isArray(target)) {
      this.targets = target;
    }

    this.className = `csss-${Math.random().toString(36).slice(2, 9)}`;
  }

  /**
   * Applies an OpCssF style model to the target elements
   */
  apply(style: Partial<OpCssF>) {
    if (!this.className || this.targets.length === 0) return;

    // 1. Generate CSS with the unique class selector
    const css = this.parser.parse(style, `.${this.className}`);

    // 2. Update the targets with the class
    this.targets.forEach((el) => {
      if (!el.classList.contains(this.className!)) {
        el.classList.add(this.className!);
      }
    });

    // 3. Update global styles
    this.updateGlobalStyles(css);
  }

  /**
   * Updates only specific parts of the style
   */
  update(style: Partial<OpCssF>) {
    this.apply(style); // For now, re-applying the whole object is safer
  }

  /**
   * Cleans up styles and removes classes
   */
  destroy() {
    if (this.className) {
      this.targets.forEach((el) => el.classList.remove(this.className!));
      CsssNode.rulesMap.delete(this.className);
      this.refreshStyleTag();
    }
  }

  private updateGlobalStyles(css: string) {
    if (!this.className) return;
    CsssNode.rulesMap.set(this.className, css);
    this.refreshStyleTag();
  }

  private refreshStyleTag() {
    if (typeof document === "undefined") return;

    if (!CsssNode.styleTag) {
      CsssNode.styleTag = document.createElement("style");
      CsssNode.styleTag.id = "idae-csss-runtime";
      document.head.appendChild(CsssNode.styleTag);
    }

    const allCss = Array.from(CsssNode.rulesMap.values()).join("\n");
    CsssNode.styleTag.textContent = allCss;
  }
}

/**
 * Svelte 5 Action for idae-csss
 * Usage: <div use:csss={{ layout: { display: 'flex' } }}></div>
 */
export function csss(node: HTMLElement, style: Partial<OpCssF>) {
  const cssNode = new CsssNode(node);

  if (style) {
    cssNode.apply(style);
  }

  return {
    update(newStyle: Partial<OpCssF>) {
      cssNode.apply(newStyle);
    },
    destroy() {
      cssNode.destroy();
    },
  };
}

/**
 * Zero-Runtime Vite Plugin
 * Handles .csss files and transforms them into standard CSS
 */
export const idaeCssVitePlugin = () => {
  const parser = new OpCssParser();

  return {
    name: "vite-plugin-idae-csss",

    /**
     * Handle .csss extension
     */
    async transform(code: string, id: string) {
      if (!id.endsWith(".csss")) return null;

      try {
        // Simple evaluation for now, in a real scenario we'd use a safer parser or JSON
        // If the file is valid JSON, parse it, otherwise try to evaluate it as a JS object
        let styleObj;
        try {
          styleObj = JSON.parse(code);
        } catch {
          // If not JSON, it might be an exported object or raw object literal
          // This is a very basic implementation
          const cleanCode = code
            .replace(/export\s+default\s+/, "")
            .replace(/;$/, "");
          styleObj = new Function(`return ${cleanCode}`)();
        }

        const css = parser.parseCsss(code);

        // Return as a JS module that exports the CSS string
        return {
          code: `export default ${JSON.stringify(css)};`,
          map: null,
        };
      } catch (e: any) {
        this.error(`Failed to parse .csss file ${id}: ${e.message}`);
        return null;
      }
    },
  };
};
