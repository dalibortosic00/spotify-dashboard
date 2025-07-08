import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 60 minutes
      gcTime: 1000 * 60 * 60, // 60 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Support for the TanStack Query Devtools Chrome extension
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
