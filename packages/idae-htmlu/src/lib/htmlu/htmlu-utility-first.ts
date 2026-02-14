export const CSSDisplay = [
  "block",
  "contents",
  "flex",
  "grid",
  "inline",
  "inline-block",
  "inline-flex",
  "inline-grid",
  "inline-table",
  "list-item",
  "run-in",
] as const;

export const CSSPosition = [
  "absolute",
  "fixed",
  "relative",
  "static",
  "sticky",
] as const;

export const CSSBoxGutter = ["gap", "padding", "margin"] as const;
export const CSSBoxSize = ["height", "width"] as const;
export const CSSPlacement = ["top", "right", "bottom", "left"] as const;

export const CSSCustomRules = [
  "flex-1",
  "flex-col",
  "flex-auto",
  "flex-initial",
  "grid-cols",
] as const;

export const AllowedProperties = [...CSSPosition, ...CSSDisplay] as const;

export const fragments = [
  "position",
  "spacing",
  "dimensions",
  "placement",
] as const;

type Recorder<T extends string | number | symbol = string, K = string> = Record<
  T,
  K
>;

export type VariationsType = {
  from: string | number;
  to: string | number;
  steps: {
    trigger: number;
    steps: number;
  };
};

export interface HtmlUAdapterFragmentType
  extends Record<(typeof fragments)[number], any> {
  position: Recorder<(typeof CSSPosition)[number]>;
  spacing: Recorder<(typeof CSSBoxGutter)[number]>;
  dimensions: Recorder<(typeof CSSBoxSize)[number]>;
  placement: Recorder<(typeof CSSPlacement)[number]>;
  display: Recorder<(typeof CSSDisplay)[number]>;
}

export interface HtmlUAdapterType {
  fragments: HtmlUAdapterFragmentType;
  progressionRules: ProgressionRangeType;
  variations: any;
}

export type ProgressionRangeType = Record<
  (typeof fragments)[number],
  VariationsType
>;

// to create custom tag, as a best practice and to keep readability, order is mandatory :
// <CSSDisplay:CSSPosition ... attributes order: CSSBoxSize,CSSBoxGutter, CSSCustomRules /> or
// <CSSCustomRules:CSSPosition ... attributes order: CSSBoxSize,CSSBoxGutter /> or
// <CSSPosition:CSSBoxSize  ... attributes order: CSSBoxGutter /> or
// <CSSCustomRules:CSSBoxGutter ... /> or
// <CSSPosition ... /> or
// <CSSBoxSize ... /> or
// <CSSCustomRules ... />
