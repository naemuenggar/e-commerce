import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// TypeScript strict configuration check (Task 18.3).
//
// Confirms that tsconfig.json enables strict mode and that there are no `.js`
// source files in the application source directories (all source is TypeScript,
// Requirement 16.2).
//
// _Requirements: 16.2_

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Parse a tsconfig that may contain `// line` or block comments. Comments are
 * stripped only when they fall outside of string literals so that path values
 * such as `"@/*"` and `"./*"` are preserved.
 */
function parseJsonc(raw: string): unknown {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    const next = raw[i + 1];

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === "/" && next === "/") {
      // Skip to end of line.
      while (i < raw.length && raw[i] !== "\n") i++;
      result += "\n";
      continue;
    }

    if (char === "/" && next === "*") {
      // Skip to end of block comment.
      i += 2;
      while (i < raw.length && !(raw[i] === "*" && raw[i + 1] === "/")) i++;
      i++; // consume the closing '/'
      continue;
    }

    result += char;
  }

  return JSON.parse(result);
}

/** Recursively collect every `.js` file under a directory (if it exists). */
function collectJsFiles(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return []; // Directory doesn't exist — nothing to scan.
  }

  const found: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...collectJsFiles(full));
    } else if (entry.endsWith(".js") || entry.endsWith(".jsx")) {
      found.push(full);
    }
  }
  return found;
}

describe("TypeScript strict configuration (Requirement 16.2)", () => {
  it("enables compilerOptions.strict in tsconfig.json", () => {
    const raw = readFileSync(join(projectRoot, "tsconfig.json"), "utf8");
    const config = parseJsonc(raw) as {
      compilerOptions?: { strict?: boolean; allowJs?: boolean };
    };

    expect(config.compilerOptions).toBeTruthy();
    expect(config.compilerOptions?.strict).toBe(true);
  });

  it("does not allow JavaScript sources (allowJs is false)", () => {
    const raw = readFileSync(join(projectRoot, "tsconfig.json"), "utf8");
    const config = parseJsonc(raw) as {
      compilerOptions?: { allowJs?: boolean };
    };

    expect(config.compilerOptions?.allowJs).toBe(false);
  });

  it("has no .js/.jsx source files in app/, components/, lib/, store/, types/", () => {
    const sourceDirs = ["app", "components", "lib", "store", "types"];
    const jsFiles = sourceDirs.flatMap((dir) =>
      collectJsFiles(join(projectRoot, dir)),
    );

    expect(jsFiles).toEqual([]);
  });
});
