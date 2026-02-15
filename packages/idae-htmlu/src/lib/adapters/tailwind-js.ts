import type { HtmlUAdapterFragmentType } from "$lib/htmlu/htmlu-utility-first.js";

const tailwindAdapter: HtmlUAdapterFragmentType = {
  display: {
    block: "block",
    contents: "contents",
    flex: "flex",
    grid: "grid",
    inline: "inline",
    "inline-block": "inline-block",
    "inline-flex": "inline-flex",
    "inline-grid": "inline-grid",
    "inline-table": "inline-table",
    "list-item": "list-item",
    "run-in": "run-in",
  },
  position: {
    absolute: "absolute",
    fixed: "fixed",
    relative: "relative",
    static: "static",
    sticky: "sticky",
  },
  spacing: {
    gap: "gap",
    padding: "p",
    margin: "m",
  },
  dimensions: {
    height: "h",
    width: "w",
  },
} as HtmlUAdapterFragmentType;
