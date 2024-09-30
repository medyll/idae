import type { DemoerStoryProps } from "./types.js";
export type { DemoerStoryProps };
export function demoerArgs<T = Record<string, any>>(
  parametersProps: DemoerStoryProps<T>,
): {
  parameters: DemoerStoryProps<T>;
  componentArgs: T;
} {
  return {
    parameters: parametersProps,
    componentArgs: defaultsArgs<T>({ ...parametersProps }),
  };
}

export function defaultsArgs<T = Record<string, any>>(
  parametersProps: DemoerStoryProps<T>,
): T {
  const out: T = {} as T;
  for (const prop of Object.keys(parametersProps)) {
    out[prop as keyof T] =
      parametersProps[prop as keyof T]?.default ??
      { ...parametersProps }[prop as keyof T]?.values?.[0];
  }

  return out;
}
export function defaultsArgsFromProps(
  prop: string,
  parametersProps: Record<string, any>,
): any {
  return parametersProps[prop]?.values?.[0];
}
