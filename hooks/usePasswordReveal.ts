"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

// Show/hide state for a password input that keeps the caret where it was.
export function usePasswordReveal(inputRef: RefObject<HTMLInputElement | null>) {
  const caret = useRef<number | null | undefined>(undefined);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const at = caret.current;
    if (!input || at === undefined) return;
    caret.current = undefined;
    input.focus();
    try {
      input.setSelectionRange(at, at);
    } catch {
      // Some browsers refuse a selection range on this input type.
    }
  }, [visible, inputRef]);

  const toggle = () => {
    caret.current = inputRef.current?.selectionStart ?? null;
    setVisible((v) => !v);
  };

  return { visible, setVisible, toggle, type: visible ? "text" : "password" };
}
