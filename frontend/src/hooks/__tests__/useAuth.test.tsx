import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, it, expect, vi, afterAll } from "vitest";
import { useAuth } from "../useAuth.ts";
import * as auth from "../../utils/auth.ts";

vi.mock("../../utils/auth.ts", () => ({
  getStoredAuth: vi.fn(() => ({
    token: "token_123",
    loginTime: Date.now(),
  })),
  removeStoredAuth: vi.fn(),
}));

const removeStoredAuthMock = vi.mocked(auth.removeStoredAuth);

describe("useAuth", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("initializes with stored token", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.token).toBe("token_123");
  });

  it("removes token on logOut", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logOut();
    });

    expect(removeStoredAuthMock).toHaveBeenCalledOnce();
    expect(result.current.token).toBeNull();
  });
});
