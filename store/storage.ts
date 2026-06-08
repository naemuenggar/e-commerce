// Storage helper for Zustand persist middleware.
//
// Returns localStorage when it is available and usable, otherwise falls back to
// an in-memory Storage implementation. This keeps the persisted stores working
// gracefully in environments where localStorage is unavailable or throws —
// e.g. server-side rendering, private browsing modes, or storage quota errors.

/**
 * Build an in-memory object that satisfies the Web Storage `Storage` interface.
 * Used as a fallback so persist middleware never crashes when localStorage is
 * inaccessible. State held here lives only for the lifetime of the page.
 */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => map.delete(key),
    setItem: (key: string, value: string) => {
      map.set(key, String(value));
    },
  };
}

let memoryFallback: Storage | null = null;

/**
 * Return a usable {@link Storage}: real `localStorage` when available, otherwise
 * a shared in-memory fallback. Availability is verified with a read/write probe
 * so storage that exists but throws (e.g. quota or privacy restrictions) is
 * also handled gracefully.
 */
export function createSafeStorage(): Storage {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = "__shopease_probe__";
      window.localStorage.setItem(probe, probe);
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    // Fall through to the in-memory fallback below.
  }

  if (!memoryFallback) {
    memoryFallback = createMemoryStorage();
  }
  return memoryFallback;
}
