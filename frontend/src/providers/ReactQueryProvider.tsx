"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

/*
 * Performance-tuned QueryClient.
 *
 * The original config had no staleTime — every component mount triggered a
 * background refetch even if data was 1 second old. This caused the "slow"
 * feeling: navigating between pages re-fetched everything.
 *
 * Rules used here:
 *   staleTime  — how long data is considered fresh (no background refetch)
 *   gcTime     — how long inactive cache entries are kept in memory
 *   retry      — only retry network errors, not 4xx responses
 *   refetchOnWindowFocus — off by default; most content doesn't need it
 *   refetchOnReconnect   — on, so data refreshes when network comes back
 */
export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error: any) => {
              const status = error?.response?.status;
              if (status && status < 500) return false;
              return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only ship in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
