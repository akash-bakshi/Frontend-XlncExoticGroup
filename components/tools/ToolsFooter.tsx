"use client";

import { useEffect, useRef } from "react";
import { EMAIL, LOCATION, ROUTES } from "@/lib/site";

// The footer is fixed, so body reserves its measured height through --foot-h.
export function ToolsFooter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const foot = ref.current;
    if (!foot) return;

    let applied = -1;
    const sync = () => {
      const h = Math.ceil(foot.getBoundingClientRect().height);
      if (!h || h === applied) return;
      applied = h;
      document.documentElement.style.setProperty("--foot-h", `${h}px`);
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(foot);
    window.addEventListener("orientationchange", sync);
    document.fonts?.ready.then(sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return (
    <footer className="tools-foot" ref={ref}>
      <div className="container tools-foot-in">
        <span>{LOCATION}</span>
        <a className="tools-foot-reset" href={ROUTES.resetPassword}>
          Reset admin password
        </a>
        <span className="tools-foot-mail">
          Email &ndash; <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </span>
      </div>
    </footer>
  );
}
