import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getStoredAuth, removeStoredAuth, type AuthStorage } from "../auth.ts";

function setLocationSearch(search: string) {
  const url = new URL(window.location.href);
  url.search = search;
  window.history.replaceState({}, "", url.toString());
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
    setLocationSearch("");
  });

  afterEach(() => {
    localStorage.clear();
    setLocationSearch("");
  });

  it("stores token from URL and returns auth object", () => {
    setLocationSearch("?access_token=abc123");
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
