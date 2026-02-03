import type { OpCssF } from "./types";
import { OpCssParser } from "./parser";

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
