export type unit = string | number;
export type all = unit;
export type top = unit;
export type bottom = unit;
export type left = unit;
export type right = unit;
export type width = unit;
export type height = unit;
export type radius = unit;
export type spacing = unit;
export type color = string;
export type duration = unit;
export type opacity = number;
export type zIndex = number;
export type ratio = unit;
export type cursor = string;
export type clip = string;
export type filter = string | string[];
export type blendMode = "normal" | "multiply" | "screen" | "overlay" | string;
export type fontFace = string;
export type decoration = string | [string, string?, string?];
export type appearance = "none" | "auto" | string;
export type transform = string;
export type animation = string;
export type easing = string;
export type variation = string;
export type willChange = string;
export type contain = string;
export type intrinsic = string;
export type anchorName = string;
export type viewTransition = string;
export type maskImage = string;
export type maskSize = string;
export type maskPosition = string;
export type maskRepeat = string;

export type backgroundImage = string;
export type backgroundSize = string;
export type backgroundPosition = string;
export type backgroundRepeat = string;
export type backgroundClip = string;
export type backgroundOrigin = string;
export type backgroundAttachment = string;

/**
 * Fundamental CSS Unit types
 */
export type CssValue = unit;
export type MultiValue =
  | unit
  | [unit]
  | [unit, unit]
  | [unit, unit, unit, unit];

export type BorderValue = string | [unit, string?, color?];
export type OutlineValue = string | [unit, string?, color?];
export type ShadowValue = string | string[];
export type TransitionValue = string | string[];
export type GapValue = unit | [unit, unit];

/**
 * OpCssF - The core model for style re-categorization
 */
export interface OpCssF extends OpCssShortcutProps {
  /** Layout and positioning logic */
  layout?: OpLayoutProps | string;

  /** Content alignment and distribution */
  content?: OpContentProps | string;

  /** Overflow behavior */
  overflow?: OpOverflowProps | string;

  /** Anchor Positioning and coordinate-based placement */
  snap?: OpSnapProps | string;

  /** Physical dimensions and spacing */
  shape?: OpShapeProps | [unit, unit?] | unit;

  /** Dimensions constraints */
  boundaries?: OpBoundariesProps | MultiValue;

  /** Spacing and gaps */
  gutter?: OpGutterProps | MultiValue;

  /** Background and fill styling */
  fill?: OpFillProps | color;

  /** Colors and branding */
  colors?: OpColorsProps | color | [color, color];

  /** Border and outlines */
  contour?: OpContourProps | MultiValue;

  /** Visual appearance */
  visual?: OpVisualProps | ShadowValue;

  /** Post-processing and blending effects */
  effect?: OpEffectProps | filter;

  /** Image masking and gradients */
  mask?: OpMaskProps | maskImage;

  /** Scroll behavior and snapping */
  scroll?: OpScrollProps | string;

  /** Typography and text rendering */
  typo?: OpTypoProps | string | unit;

  /** Interactivity and UI behavior */
  ui?: OpUiProps | color;

  /** Performance and Browser hints */
  perf?: OpPerfProps | string;

  /** CSS Variables / Custom Properties */
  vars?: Record<string, CssValue>;

  /** Animation and transitions */
  motion?: OpMotionProps | duration | [duration, duration];

  /** Advanced interactivity and states */
  state?: OpStateProps;

  /** Responsive scaling and queries */
  scale?: OpScaleProps;
}

export interface OpLayoutProps {
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
}

export interface OpContentProps {
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: "wrap" | "nowrap" | "reverse";
}

export interface OpOverflowProps {
  over?: "auto" | "scroll" | "hidden" | "visible";
  x?: "auto" | "scroll" | "hidden" | "visible";
  y?: "auto" | "scroll" | "hidden" | "visible";
  scroll?: "smooth" | "auto";
}

export interface OpSnapProps {
  /** Defines an anchor name (anchor-name) */
  name?: anchorName;
  /** Points to an anchor (position-anchor) */
  to?: anchorName;
  /** Positioning coordinates */
  top?: top;
  bottom?: bottom;
  left?: left;
  right?: right;
  inset?: MultiValue;
}

export interface OpShapeProps {
  width?: width | [width, width] | [width, width, width]; // [val, min, max]
  height?: height | [height, height] | [height, height, height];
  ratio?: ratio;
}

export interface OpBoundariesProps {
  minWidth?: width;
  minHeight?: height;
  maxWidth?: width;
  maxHeight?: height;
}

export interface OpGutterProps {
  margin?: MultiValue;
  padding?: MultiValue;
  gap?: GapValue;
}

export interface OpFillProps {
  color?: color;
  image?: backgroundImage;
  size?: backgroundSize;
  position?: backgroundPosition;
  repeat?: backgroundRepeat;
  clip?: backgroundClip;
  origin?: backgroundOrigin;
  attachment?: backgroundAttachment;
}

export interface OpColorsProps {
  text?: color;
}

export interface OpContourProps {
  radius?: MultiValue;
  border?: BorderValue;
  outline?: OutlineValue;
  offset?: spacing;
}

export interface OpVisualProps {
  shadow?: ShadowValue;
  opacity?: opacity;
  cursor?: cursor;
  clip?: clip;
  filter?: filter;
}

export interface OpEffectProps {
  blend?: blendMode;
  backdrop?: filter;
  isolate?: "auto" | "isolate";
  mix?: string;
}

export interface OpMaskProps {
  image?: maskImage;
  size?: maskSize;
  position?: maskPosition;
  repeat?: maskRepeat;
  clip?: clip;
}

export interface OpScrollProps {
  snap?: "none" | "x" | "y" | "both" | "mandatory" | "proximity";
  align?: "start" | "center" | "end" | "none";
  stop?: "normal" | "always";
  margin?: MultiValue;
  padding?: MultiValue;
}

export interface OpTypoProps {
  face?: fontFace;
  size?: spacing;
  weight?: "normal" | "bold" | "light" | number;
  align?: "left" | "center" | "right" | "justify";
  lineHeight?: spacing;
  spacing?: spacing;
  transform?: "uppercase" | "lowercase" | "capitalize" | "none";
  decoration?: decoration;
  /** Modern text-wrap (balance, pretty) */
  wrap?: "pretty" | "balance" | "nowrap" | "wrap";
  /** Variable fonts support */
  variation?: variation;
  indent?: spacing;
  rendering?: "optimizeSpeed" | "optimizeLegibility" | "geometricPrecision";
}

export interface OpUiProps {
  accent?: color;
  caret?: color;
  pointer?: "auto" | "none" | "all";
  select?: "none" | "text" | "all" | "auto";
  appearance?: appearance;
  touch?: "auto" | "none" | "manipulation" | "pan-x" | "pan-y";
}

export interface OpPerfProps {
  /** content-visibility */
  visibility?: "visible" | "hidden" | "auto";
  /** contain-intrinsic-size */
  intrinsic?: intrinsic;
  willChange?: willChange;
  contain?: contain;
}

export interface OpMotionProps {
  transition?: TransitionValue;
  animate?: animation;
  duration?: duration;
  easing?: easing;
  delay?: duration;
  transform?: transform;
  /** View Transitions API support */
  viewTransition?: viewTransition;
}

export interface OpStateProps {
  active?: OpCssF;
  hover?: OpCssF;
  focus?: OpCssF;
  disabled?: OpCssF;
}

export interface OpScaleProps {
  /** Container Queries (Modern CSS) */
  container?: Record<string, OpCssF>;
  /** Media Queries (Traditional) */
  media?: Record<string, OpCssF>;
}

/**
 * Shortcuts for common properties at the root level
 */
export interface OpCssShortcutProps {
  /** Shortcut for shape.width */
  width?: width;
  /** Shortcut for shape.height */
  height?: height;
  /** Shortcut for fill.color */
  bg?: color;
  /** Shortcut for colors.text */
  text?: color;
  /** Shortcut for fill.image */
  image?: backgroundImage;
  /** Shortcut for fill.position */
  position?: backgroundPosition;
  /** Shortcut for fill.repeat */
  repeat?: backgroundRepeat;
  /** Shortcut for layout.z */
  z?: zIndex;
  /** Shortcut for layout.display */
  display?: OpLayoutProps["display"];
  /** Shortcut for visual.shadow */
  shadow?: ShadowValue;
  /** Shortcut for contour.radius */
  radius?: MultiValue;
  /** Shortcut for contour.border */
  border?: BorderValue;
  /** Shortcut for gutter.margin */
  margin?: MultiValue;
  /** Shortcut for gutter.padding */
  padding?: MultiValue;
  /** Shortcut for gutter.gap */
  gap?: GapValue;
  /** Shortcut for content.justify */
  justify?: OpContentProps["justify"];
  /** Shortcut for typo.size */
  size?: spacing;
  /** Shortcut for typo.weight */
  weight?: OpTypoProps["weight"];
  /** Shortcut for boundaries.minWidth */
  minWidth?: width;
  /** Shortcut for boundaries.minHeight */
  minHeight?: height;
  /** Shortcut for boundaries.maxWidth */
  maxWidth?: width;
  /** Shortcut for boundaries.maxHeight */
  maxHeight?: height;
}
