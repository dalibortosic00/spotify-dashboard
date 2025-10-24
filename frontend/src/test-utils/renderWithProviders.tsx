import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import type { FC, ReactElement, ReactNode } from "react";

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
}

function createWrapper(client: QueryClient): FC<{ children?: ReactNode }> {
  return ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderOptions & { queryClient?: QueryClient } = {},
): RenderResult & { queryClient: QueryClient } {
  const { queryClient: providedClient, ...renderOptions } = options;
  const queryClient = providedClient ?? createQueryClient();
  const wrapper = createWrapper(queryClient);

  return {
    ...render(ui, { wrapper, ...renderOptions }),
    queryClient,
  } as RenderResult & { queryClient: QueryClient };
}

export function renderHookWithProviders<TResult, TProps = unknown>(
  callback: (props?: TProps) => TResult,
  options?: { queryClient?: QueryClient; initialProps?: TProps },
): RenderHookResult<TResult, TProps> {
  const queryClient = options?.queryClient ?? createQueryClient();
  const wrapper = createWrapper(queryClient);

  return renderHook<TResult, TProps>(callback, {
    wrapper,
    initialProps: options?.initialProps,
  });
}
