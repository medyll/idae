import type {
  HtmlUAdapterType,
  VariationsType,
} from "$lib/htmlu/htmlu-utility-first.js";

const cssFabricAdapter: HtmlUAdapterType = {} as HtmlUAdapterType;

const xx: VariationsType = {
  from: 0,
  to: 96,
  steps: {
    trigger: 16,
    steps: 8,
  },
};

cssFabricAdapter.fragments = {
  display: {
    block: "dsp-block",
    contents: "dsp-contents",
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
    absolute: "pos-abs",
    fixed: "pos-fix",
    relative: "pos-rel",
    static: "pos-static",
    sticky: "pos-sticky",
  },
  spacing: {
    gap: "gap",
    padding: "pad",
    margin: "marg",
  },
  dimensions: {
    height: "h",
    width: "w",
  },
  placement: {
    top: "top",
    right: "right",
    bottom: "bottom",
    left: "left",
  },
};

cssFabricAdapter.progressionRules = {
  position: xx,
  spacing: xx,
  dimensions: xx,
  placement: xx,
};

cssFabricAdapter.variations = {
  display: {
    flex: [1, "auto", "initial", "none"],
    grid: [1, "auto", "initial", "none"],
  },
  spacing: {
    gap: ["tiny", "small", "medium", "large", "huge"],
    padding: ["tiny", "small", "medium", "large", "huge"],
    margin: ["tiny", "small", "medium", "large", "huge"],
  },
  dimensions: {
    height: ["tiny", "small", "medium", "large", "huge"],
    width: ["tiny", "small", "medium", "large", "huge"],
  },
  placement: {
    top: ["tiny", "small", "medium", "large", "huge"],
    right: ["tiny", "small", "medium", "large", "huge"],
    bottom: ["tiny", "small", "medium", "large", "huge"],
    left: ["tiny", "small", "medium", "large", "huge"],
  },
};
