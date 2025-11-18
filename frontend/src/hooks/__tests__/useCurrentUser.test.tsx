import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import API from "../../api.ts";
import { useCurrentUser } from "../useCurrentUser.ts";
import type { User } from "../../types/index.ts";
import { renderHookWithProviders } from "../../test-utils/renderWithProviders.tsx";

describe("useCurrentUser", () => {
  it("calls API.get with token and returns data", async () => {
    const fixture: User = {
      display_name: "Test User",
      external_urls: { spotify: "" },
      followers: { total: 0 },
      href: "",
      id: "user_123",
      images: [],
      type: "user",
      uri: "",
    };

    const spy = vi.spyOn(API, "get").mockResolvedValue({ data: fixture });

    const { result } = renderHookWithProviders(() =>
      useCurrentUser({ token: "token_123" }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(spy).toHaveBeenCalledWith("/me", {
      params: { token: "token_123" },
    });
    expect(result.current.data).toEqual(fixture);

    spy.mockRestore();
  });

  it("does not call API.get when token is null", () => {
    const spy = vi.spyOn(API, "get").mockResolvedValue({ data: {} });

    renderHookWithProviders(() => useCurrentUser({ token: null }));

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
