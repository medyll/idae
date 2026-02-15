import { OpCssParser } from "../../../src/lib/csss/parser";

export async function handleCsssParse(params: any) {
  const { source } = params || {};
  if (typeof source !== "string") {
    throw new Error("csss.parse requires a `source` string parameter");
  }

  const diagnostics: Array<{
    level: "error" | "warning";
    message: string;
    line?: number;
    column?: number;
  }> = [];

  // Basic static checks for common syntax problems (braces and quotes)
  let depth = 0;
  let line = 1;
  let column = 0;
  let inQuote: false | '"' | "'" = false as any;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    column++;
    if (ch === "\n") {
      line++;
      column = 0;
      continue;
    }

    if (!inQuote && (ch === '"' || ch === "'")) {
      inQuote = ch as any;
      continue;
    }
    if (inQuote && ch === inQuote) {
      inQuote = false as any;
      continue;
    }

    if (!inQuote) {
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth < 0) {
          diagnostics.push({
            level: "error",
            message: "Unmatched closing brace",
            line,
            column,
          });
          depth = 0;
        }
      }
    }
  }

  if (inQuote) {
    diagnostics.push({
      level: "error",
      message: "Unclosed quote in input",
      line,
      column,
    });
  }
  if (depth > 0) {
    diagnostics.push({
      level: "error",
      message: "Unclosed opening brace",
      line: Math.max(1, line - 1),
      column: 0,
    });
  }

  // Try quick JSON parse if the input looks like JSON to provide clearer parse errors
  const trimmed = source.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      JSON.parse(trimmed);
    } catch (err: any) {
      diagnostics.push({
        level: "warning",
        message: `JSON parse failed: ${err?.message || String(err)}`,
      });
    }
  }

  const parser = new OpCssParser();
  try {
    const css = parser.parseCsss(source);

    let bySelector: Record<string, string> | null = null;
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const obj = JSON.parse(trimmed);
        if (obj && typeof obj === "object") {
          bySelector = {};
          for (const [sel, style] of Object.entries(obj)) {
            try {
              bySelector[sel] = parser.parse(style as any, sel) || "";
            } catch (e: any) {
              diagnostics.push({
                level: "warning",
                message: `Failed to parse selector ${sel}: ${e?.message || String(e)}`,
              });
              bySelector[sel] = "";
            }
          }
        }
      } catch (e: any) {
        diagnostics.push({
          level: "warning",
          message: `Could not build bySelector map: ${e?.message || String(e)}`,
        });
      }
    } else {
      diagnostics.push({
        level: "warning",
        message:
          "bySelector mapping only supported for JSON-object inputs; input was not JSON.",
      });
    }

    return {
      ok: true,
      inputLength: source.length,
      diagnostics,
      css,
      bySelector,
    };
  } catch (err: any) {
    diagnostics.push({
      level: "error",
      message: `Parser error: ${err?.message || String(err)}`,
    });
    return {
      ok: false,
      inputLength: source.length,
      diagnostics,
      css: null,
      bySelector: null,
    };
  }
}
