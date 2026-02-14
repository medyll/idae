import { describe, it, expect } from "vitest";
import {htmluSveltePreprocess} from "../lib/htmlu/preprocess";

const preprocess  = htmluSveltePreprocess();

describe("htmluPreprocessor", () => {
  it("should transform tag to class attributes>", () => {
    const result = preprocess.markup({
      content: "<absolute > content </absolute>",
    });
    expect(result.code).toBe('<div class="absolute"> content </div>');
  });

  it("should transform attributes to classes>", () => {
    const result = preprocess.markup({
      content: "<absolute theme-bg > content </absolute>",
    });
    expect(result.code).toBe('<div class="absolute theme-bg"> content </div>');
  });

  it("should not be processed", () => {
    const result = preprocess.markup({
      content: "<span theme-bg > content </span>",
    });
    expect(result.code).toBe('<span theme-bg > content </span>');
  });

  it('should transform <flex-col:relative gap-2 pad-2> to <div class="flex-col relative gap-2 pad-2">', () => {
    const result = preprocess.markup({
      content: "<flex-col:relative gap-2 pad-2>content</flex-col:relative>",
    });
    expect(result.code).toBe(
      '<div class="flex-col relative gap-2 pad-2">content</div>'
    );
  });

  it('should transform <grid gap-2 pad-2> to <div class="grid gap-2 pad-2">', () => {
    const result = preprocess.markup({
      content: "<grid gap-2 pad-2>content</grid>",
    });
    expect(result.code).toBe('<div class="grid gap-2 pad-2">content</div>');
  });
});
