"use client";

import { useCallback, useSyncExternalStore } from "react";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Returns false during SSR and hydration, then the live match.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
