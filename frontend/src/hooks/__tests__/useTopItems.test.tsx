import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import API from "../../api.ts";
import { useTopItems } from "../useTopItems.ts";
import { renderHookWithProviders } from "../../test-utils/renderWithProviders.tsx";
import type { TopItems } from "../../types/index.ts";

describe("useTopItems", () => {
  it("calls API.get with token and params and returns data", async () => {
    const fixture: TopItems = {
      top_artists: { href: "", limit: 2, offset: 0, total: 2, items: [] },
      top_tracks: { href: "", limit: 2, offset: 0, total: 2, items: [] },
    };

    const spy = vi.spyOn(API, "get").mockResolvedValue({ data: fixture });

    const { result } = renderHookWithProviders(() =>
      useTopItems({ token: "token_123", params: { limit: 2 }, enabled: true }),
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(spy).toHaveBeenCalledWith("/me/top", {
      params: { token: "token_123", limit: 2 },
    });
    expect(result.current.data).toEqual(fixture);

    spy.mockRestore();
  });

  it("does not call API.get when token is null", () => {
    const spy = vi.spyOn(API, "get").mockResolvedValue({ data: {} });

    renderHookWithProviders(() =>
      useTopItems({ token: null, params: { limit: 2 }, enabled: true }),
    );

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it("does not call API.get when enabled is false", () => {
    const spy = vi.spyOn(API, "get").mockResolvedValue({ data: {} });

    renderHookWithProviders(() =>
      useTopItems({
        token: "token_123",
        params: { limit: 2 },
        enabled: false,
      }),
    );

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
