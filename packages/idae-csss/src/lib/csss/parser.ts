import type { OpCssF } from "./types";
import { StyleModelMeta } from "./meta";

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

    const entries = this.getEntries(clean);
    return entries
      .map((entry) => {
        if (entry.type === "block") {
          const styleObj = this.parseBlockToModel(entry.body);
          return this.parse(styleObj, entry.selector);
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  private getEntries(content: string) {
    const entries: (
      | { type: "block"; selector: string; body: string }
      | { type: "property"; text: string }
    )[] = [];
    let depth = 0;
    let currentSelector = "";
    let currentBody = "";
    let inSelector = true;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === "{") {
        if (depth === 0) {
          const parts = currentSelector.split(/[,;\n]/);
          const selector = parts.pop()?.trim() || "";
          const propertiesBefore = parts.join(";").trim();

          if (propertiesBefore) {
            entries.push({ type: "property", text: propertiesBefore });
          }

          currentSelector = selector;
          inSelector = false;
        } else {
          currentBody += char;
        }
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0) {
          entries.push({
            type: "block",
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

    if (currentSelector.trim()) {
      entries.push({ type: "property", text: currentSelector.trim() });
    }

    return entries;
  }

  private getBlocks(content: string) {
    return this.getEntries(content).filter(
      (e) => e.type === "block",
    ) as unknown as { selector: string; body: string }[];
  }

  private parseBlockToModel(body: string): Partial<OpCssF> {
    const model: any = {};
    const entries = this.getEntries(body);

    for (const entry of entries) {
      if (entry.type === "block") {
        const name = entry.selector.replace(/[:,"']/g, "").trim();
        model[name] = this.parseBlockToModel(entry.body);
      } else {
        const props = this.parseProperties(entry.text);
        Object.assign(model, props);
      }
    }
    return model;
  }

  private parseProperties(text: string): Record<string, any> {
    const props: Record<string, any> = {};
    const lines = text.split(/[,;\n]/);

    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length < 2) continue;

      const key = parts[0].trim().replace(/^['"]|['"]$/g, "");
      let val = parts.slice(1).join(":").trim().replace(/,$/, "");
      if (!val) continue;

      try {
        if (
          (val.startsWith("{") && val.endsWith("}")) ||
          (val.startsWith("[") && val.endsWith("]")) ||
          !isNaN(Number(val)) ||
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          // Attempt to parse as JSON or number
          // Replace single quotes with double quotes for JSON.parse if it looks like an object/array
          const jsonVal =
            (val.startsWith("{") || val.startsWith("[")) && val.includes("'")
              ? val.replace(/'/g, '"')
              : val;
          props[key] = JSON.parse(jsonVal);
        } else {
          props[key] = val.replace(/^['"]|['"]$/g, "");
        }
      } catch (e) {
        // Fallback to raw string minus quotes
        props[key] = val.replace(/^['"]|['"]$/g, "");
      }
    }
    return props;
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
    const normalized = this.normalizeShorthands(obj);

    for (const [category, values] of Object.entries(normalized)) {
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

  /**
   * Normalizes short declarations and root-level shortcuts into a full OpCssF structure
   */
  private normalizeShorthands(obj: any): Partial<OpCssF> {
    const result: any = { ...obj };

    // 1. Resolve root-level shortcuts (width, bg, display, etc.)
    const shortcuts: Record<string, keyof OpCssF> = {
      width: "shape",
      height: "shape",
      bg: "colors",
      text: "colors",
      z: "layout",
      display: "layout",
      shadow: "visual",
      radius: "contour",
      border: "contour",
      margin: "gutter",
      padding: "gutter",
      gap: "gutter",
      justify: "content",
      size: "typo",
      weight: "typo",
      minW: "boundaries",
      minH: "boundaries",
      maxW: "boundaries",
      maxH: "boundaries",
    };

    for (const [key, val] of Object.entries(obj)) {
      if (shortcuts[key]) {
        const cat = shortcuts[key];
        result[cat] = { ...((result[cat] as object) || {}), [key]: val };
        delete result[key];
      }
    }

    // 2. Resolve category-level shorthands (layout: "flex", shape: 100)
    for (const [cat, val] of Object.entries(result)) {
      if (
        val === null ||
        val === undefined ||
        (typeof val === "object" && !Array.isArray(val))
      )
        continue;

      switch (cat) {
        case "layout":
          if (typeof val === "string") {
            const [display, flow] = val.split(" ");
            result.layout = { display, flow } as any;
          }
          break;
        case "shape":
          if (Array.isArray(val))
            result.shape = { width: val[0], height: val[1] };
          else result.shape = { width: val };
          break;
        case "colors":
          if (Array.isArray(val)) result.colors = { bg: val[0], text: val[1] };
          else result.colors = { bg: val };
          break;
        case "gutter":
          result.gutter = { margin: val };
          break;
        case "boundaries":
          if (Array.isArray(val)) {
            const [minW, minH, maxW, maxH] = val;
            result.boundaries = { minW, minH, maxW, maxH };
          }
          break;
        case "typo":
          if (
            typeof val === "number" ||
            (typeof val === "string" && !isNaN(Number(val)))
          ) {
            result.typo = { size: val };
          } else if (typeof val === "string") {
            result.typo = { face: val };
          }
          break;
        case "motion":
          if (Array.isArray(val))
            result.motion = { duration: val[0], delay: val[1] };
          else result.motion = { duration: val };
          break;
        case "visual":
          result.visual = { shadow: val };
          break;
        case "ui":
          result.ui = { accent: val };
          break;
      }
    }

    return result;
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

      const msProps = [
        "transition-duration",
        "transition-delay",
        "animation-duration",
        "animation-delay",
      ];
      if (msProps.includes(cssProp)) return `${value}ms`;

      return `${value}px`;
    }
    return String(value);
  }
}
