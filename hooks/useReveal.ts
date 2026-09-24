"use client";

import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION, useMediaQuery } from "./useMediaQuery";

type Callback = () => void;

const callbacks = new Map<Element, Callback>();
let observer: IntersectionObserver | null = null;

function observeOnce(el: Element, onEnter: Callback): () => void {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  callbacks.set(el, onEnter);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

// Adds the `in` state once the element scrolls into view; staggered children cascade.
export function useReveal<T extends HTMLElement>(stagger = false) {
  const ref = useRef<T>(null);
  const reduced = useMediaQuery(REDUCED_MOTION);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    return observeOnce(el, () => {
      if (stagger) {
        Array.from(el.children).forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
        });
      }
      setEntered(true);
    });
  }, [reduced, stagger]);

  return [ref, entered || reduced] as const;
}
