import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getStoredAuth, removeStoredAuth, type AuthStorage } from "../auth.ts";

// Provide a minimal localStorage polyfill when running in a Node environment
if (typeof globalThis.localStorage === "undefined") {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      // avoid `delete` to satisfy static analyzers: create a new object without the key
      store = Object.fromEntries(
        Object.entries(store).filter(([k]) => k !== key),
      );
    },
    clear() {
      store = {};
    },
  } as Storage;
}

function setGlobalLocationSearch(search: string) {
  // Provide a minimal `window` + `history` for the utils which read `window.location.search`
  const fakeWindow = {
    location: { search },
    history: {
      replaceState: (...args: unknown[]) => {
        void JSON.stringify(args);
      },
    },
  };
  (globalThis as unknown as Record<string, unknown>).window = fakeWindow;
}

describe("auth utils", () => {
  function assertAuth(a: AuthStorage | null): asserts a is AuthStorage {
    if (a === null) throw new Error("auth should be defined");
  }

  function assertHasToken(obj: unknown): asserts obj is { token: string } {
    if (
      typeof obj !== "object" ||
      obj === null ||
      !("token" in (obj as Record<string, unknown>))
    ) {
      throw new Error("parsed value missing token");
    }
  }

  beforeEach(() => {
    localStorage.clear();
    // reset URL
    setGlobalLocationSearch("");
  });

  afterEach(() => {
    localStorage.clear();
    setGlobalLocationSearch("");
  });

  it("stores token from URL and returns auth object", () => {
    setGlobalLocationSearch("?access_token=abc123");
    const auth = getStoredAuth();
    assertAuth(auth);
    expect(auth.token).toBe("abc123");

    // ensure localStorage was set
    const raw = localStorage.getItem("spotify_auth");
    expect(raw).toBeTruthy();
    if (raw === null) throw new Error("expected spotify_auth in localStorage");
    const parsedUnknown: unknown = JSON.parse(raw);
    assertHasToken(parsedUnknown);
    expect(parsedUnknown.token).toBe("abc123");
  });

  it("returns stored auth when not expired", () => {
    const stored: AuthStorage = {
      token: "stored-token",
      loginTime: Date.now(),
    };
    localStorage.setItem("spotify_auth", JSON.stringify(stored));
    const auth = getStoredAuth();
    expect(auth).not.toBeNull();
    if (!auth) throw new Error("auth should be defined");
    expect(auth.token).toBe("stored-token");
  });

  it("removes expired token and returns null", () => {
    const expired: AuthStorage = {
      token: "old",
      loginTime: Date.now() - 2 * 3600 * 1000,
    };
    localStorage.setItem("spotify_auth", JSON.stringify(expired));
    const auth = getStoredAuth();
    expect(auth).toBeNull();
    expect(localStorage.getItem("spotify_auth")).toBeNull();
  });

  it("removeStoredAuth clears localStorage", () => {
    const stored: AuthStorage = {
      token: "stored-token",
      loginTime: Date.now(),
    };
    localStorage.setItem("spotify_auth", JSON.stringify(stored));
    removeStoredAuth();
    expect(localStorage.getItem("spotify_auth")).toBeNull();
  });
});
