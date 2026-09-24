"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  className: string;
  stagger?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}

export function Reveal({ className, stagger = false, style, children }: RevealProps) {
  const [ref, shown] = useReveal<HTMLDivElement>(stagger);
  return (
    <div ref={ref} className={shown ? `${className} in` : className} style={style}>
      {children}
    </div>
  );
}
