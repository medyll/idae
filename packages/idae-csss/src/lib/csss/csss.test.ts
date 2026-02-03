/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  StyleDocumentor,
  StyleModelMeta,
  OpCssParser,
  CsssNode,
  type OpCssF,
} from "./csss";

describe("OpCssF Style Model", () => {
  it("should have all required categories in metadata", () => {
    const categories = Object.keys(StyleModelMeta);
    expect(categories).toContain("layout");
    expect(categories).toContain("content");
    expect(categories).toContain("shape");
    expect(categories).toContain("gutter");
    expect(categories).toContain("colors");
    expect(categories).toContain("contour");
    expect(categories).toContain("visual");
    expect(categories).toContain("snap");
    expect(categories).toContain("scroll");
    expect(categories).toContain("typo");
    expect(categories).toContain("motion");
    expect(categories).toContain("state");
    expect(categories).toContain("scale");
    expect(categories).toContain("perf");
    expect(categories).toContain("ui");
  });

  it("should generate markdown documentation", () => {
    const doc = new StyleDocumentor();
    const md = doc.generateMarkdown();
    expect(md).toContain("# OpCssF Style Model Specification");
    expect(md).toContain("Layout & Flow");
    expect(md).toContain("Dimensions & Spacing");
    expect(md).toContain("Performance");
  });

  describe("OpCssParser", () => {
    const parser = new OpCssParser();

    it("should parse simple layout properties", () => {
      const style: Partial<OpCssF> = {
        layout: { display: "flex", flow: "relative" },
      };
      const css = parser.parse(style);
      expect(css).toContain("display: flex");
      expect(css).toContain("position: relative");
    });

    it("should handle numeric values with default units", () => {
      const style: Partial<OpCssF> = {
        gutter: { margin: 10, padding: [5, 15] },
        contour: { offset: 2 },
      };
      const css = parser.parse(style);
      expect(css).toContain("margin: 10px");
      expect(css).toContain("padding: 5px 15px");
      expect(css).toContain("outline-offset: 2px");
    });

    it("should respect unitless properties", () => {
      const style: Partial<OpCssF> = {
        layout: { z: 10 },
        visual: { opacity: 0.5 },
      };
      const css = parser.parse(style);
      expect(css).toContain("z-index: 10");
      expect(css).toContain("opacity: 0.5");
    });

    it("should handle boundaries properties (min/max)", () => {
      const style: Partial<OpCssF> = {
        boundaries: { minW: 100, minH: 200 },
      };
      const css = parser.parse(style);
      expect(css).toContain("min-width: 100px");
      expect(css).toContain("min-height: 200px");
    });

    it("should handle CSS variables", () => {
      const style: Partial<OpCssF> = {
        vars: {
          primary: "red",
          "--secondary": "blue",
        },
      };
      const css = parser.parse(style);
      expect(css).toContain("--primary: red");
      expect(css).toContain("--secondary: blue");
    });

    it("should handle colors category", () => {
      const style: Partial<OpCssF> = {
        colors: { bg: "white", text: "black" },
      };
      const css = parser.parse(style);
      expect(css).toContain("background: white");
      expect(css).toContain("color: black");
    });

    it("should handle states with selectors", () => {
      const style: Partial<OpCssF> = {
        layout: { display: "block" },
        state: {
          hover: { colors: { bg: "red" } },
        },
      };
      const css = parser.parse(style, ".btn");
      expect(css).toContain(".btn { display: block }");
      expect(css).toContain(".btn:hover { background: red }");
    });

    it("should handle media and container queries", () => {
      const style: Partial<OpCssF> = {
        scale: {
          media: {
            "(min-width: 600px)": { typo: { size: 20 } },
          },
        },
      };
      const css = parser.parse(style, ".text");
      expect(css).toContain("@media (min-width: 600px)");
      expect(css).toContain(".text { font-size: 20px }");
    });

    it("should parse .csss string syntax", () => {
      const content = `
        body {
          layout {
            display: "flex",
            flow: "relative"
          },
          typo {
            size: 16
          }
        }
      `;
      const css = parser.parseCsss(content);
      expect(css).toContain(
        "body { display: flex; position: relative; font-size: 16px }",
      );
    });

    it("should handle composite border values as tuples", () => {
      const style: Partial<OpCssF> = {
        contour: {
          border: [1, "solid", "red"],
          outline: ["2px", "dashed", "blue"],
        },
      };
      const css = parser.parse(style);
      expect(css).toContain("border: 1px solid red");
      expect(css).toContain("outline: 2px dashed blue");
    });

    it("should handle animation/transition durations in ms", () => {
      const style: Partial<OpCssF> = {
        motion: {
          duration: 300,
          delay: 100,
        },
      };
      const css = parser.parse(style);
      expect(css).toContain("transition-duration: 300ms");
      expect(css).toContain("transition-delay: 100ms");
    });

    it("should handle root-level shortcuts (Short Declaration)", () => {
      const style: OpCssF = {
        width: 100,
        bg: "red",
        display: "flex",
        justify: "center",
        gap: 20,
        z: 50,
      };
      const css = parser.parse(style);
      expect(css).toContain("width: 100px");
      expect(css).toContain("background: red");
      expect(css).toContain("display: flex");
      expect(css).toContain("justify-content: center");
      expect(css).toContain("gap: 20px");
      expect(css).toContain("z-index: 50");
    });

    it("should handle category shorthands", () => {
      const style: OpCssF = {
        layout: "flex absolute",
        shape: [100, 200],
        colors: ["white", "black"],
        typo: 16,
      };
      const css = parser.parse(style);
      expect(css).toContain("display: flex");
      expect(css).toContain("position: absolute");
      expect(css).toContain("width: 100px");
      expect(css).toContain("height: 200px");
      expect(css).toContain("background: white");
      expect(css).toContain("color: black");
      expect(css).toContain("font-size: 16px");
    });

    it("should merge root shortcuts and category object", () => {
      const style: OpCssF = {
        width: 100,
        shape: { height: 200 },
      };
      const css = parser.parse(style);
      expect(css).toContain("width: 100px");
      expect(css).toContain("height: 200px");
    });

    it("should parse mixed .csss syntax with shortcuts and blocks", () => {
      const content = `
        .target {
          width: 100,
          shape { height: 200 },
          colors: "red"
        }
      `;
      const css = parser.parseCsss(content);
      expect(css).toContain("width: 100px");
      expect(css).toContain("height: 200px");
      expect(css).toContain("background: red");
    });

    it("should handle boundary shorthand array", () => {
      const style: OpCssF = {
        boundaries: [100, 200, 500, 600],
      };
      const css = parser.parse(style);
      expect(css).toContain("min-width: 100px");
      expect(css).toContain("min-height: 200px");
      expect(css).toContain("max-width: 500px");
      expect(css).toContain("max-height: 600px");
    });

    it("should handle boundary root shortcuts", () => {
      const style: OpCssF = {
        minW: 100,
        maxH: "50vh",
      };
      const css = parser.parse(style);
      expect(css).toContain("min-width: 100px");
      expect(css).toContain("max-height: 50vh");
    });
  });
});

describe("CsssNode", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = '<div id="test-el"></div>';
  });

  it("should apply styles to an element", () => {
    const el = document.getElementById("test-el")!;
    const node = new CsssNode(el);
    node.apply({ layout: { display: "flex" } });

    const styleTag = document.getElementById("idae-csss-runtime");
    expect(styleTag).toBeDefined();
    expect(styleTag?.textContent).toContain("display: flex");
    expect(el.className).toMatch(/csss-/);
  });

  it("should cleanup on destroy", () => {
    const el = document.getElementById("test-el")!;
    const node = new CsssNode(el);
    node.apply({ layout: { display: "block" } });
    const className = Array.from(el.classList).find((c) =>
      c.startsWith("csss-"),
    )!;

    node.destroy();
    expect(el.classList.contains(className)).toBe(false);
    const content =
      document.getElementById("idae-csss-runtime")?.textContent || "";
    expect(content).not.toContain(className);
  });
});
