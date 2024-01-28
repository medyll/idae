import { dotPath } from "./pathResolver.js";
import { describe, it, expect } from "vitest";

describe("resolveDotPath", () => {
  const object = {
    foo: {
      bar: {
        baz: "value",
      },
    },
  };

  it("returns the value at the specified path", () => {
    const result = dotPath(object, "foo.bar.baz");
    expect(result).toEqual("value");
  });

  it("returns the default value if the path does not exist", () => {
    const defaultValue = "default";
    const result = dotPath(object, "foo.bar.qux", defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it("returns undefined if the path does not exist and no default value is provided", () => {
    const result = dotPath(object, "foo.bar.qux");
    expect(result).toBeUndefined();
  });
});
