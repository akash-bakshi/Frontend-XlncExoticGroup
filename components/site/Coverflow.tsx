"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon, ExternalIcon } from "@/components/icons";
import { MOTION_OK, useMediaQuery } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import type { Company } from "@/lib/companies";

const DRAG_SLOP = 10;
const pad = (n: number) => (n < 10 ? "0" : "") + n;

function PortfolioCard({ company }: { company: Company }) {
  const soon = !company.url;
  return (
    <li className={soon ? "pf-card pf-soon" : "pf-card"}>
      {soon && <span className="pf-badge-soon">Coming soon</span>}
      <div className="pf-logo">
        {company.logo ? (
          <Image
            src={company.logo.src}
            width={company.logo.width}
            height={company.logo.height}
            alt={company.logo.alt}
            loading="lazy"
          />
        ) : (
          company.wordmark
        )}
      </div>
      <div className="pf-body">
        <span className="pf-tag">{company.tag}</span>
        <h3 className="pf-name">{company.name}</h3>
        <p className="pf-desc">{company.description}</p>
        {soon ? (
          <span className="pf-visit">Coming soon</span>
        ) : (
          <a className="pf-visit" href={company.url} target="_blank" rel="noopener">
            {`Visit ${company.domain} `}
            <ExternalIcon />
          </a>
        )}
      </div>
    </li>
  );
}

// Progressively enhances the portfolio grid into a looping 3D coverflow when motion is allowed.
export function Coverflow({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const flow = useMediaQuery(MOTION_OK) && n > 1;
  const [revealRef, shown] = useReveal<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(false);
  const [resizeTick, setResizeTick] = useState(0);
  const drag = useRef({ startX: 0, dragging: false, moved: 0, pid: -1, captured: false });
  const suppressClick = useRef(false);
  const downCard = useRef<Element | null>(null);

  const cards = useCallback(
    () => Array.from(trackRef.current?.querySelectorAll<HTMLLIElement>(".pf-card") ?? []),
    []
  );

  const goTo = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const go = useCallback((d: number) => setActive((a) => (((a + d) % n) + n) % n), [n]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const list = cards();
    if (!track || !list.length) return;

    if (!flow) {
      list.forEach((card) => {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.zIndex = "";
        card.style.pointerEvents = "";
        card.classList.remove("is-active");
        card.removeAttribute("aria-hidden");
        card.querySelector("a.pf-visit")?.removeAttribute("tabindex");
      });
      track.style.height = "";
      return;
    }

    const w = list[0].offsetWidth || 300;
    const half = Math.floor(n / 2);
    track.style.height = `${Math.max(...list.map((card) => card.offsetHeight))}px`;

    list.forEach((card, i) => {
      // Shortest circular distance from the active card, so the flow wraps seamlessly.
      const off = ((i - active + n + half) % n) - half;
      const abs = Math.abs(off);
      const sign = off < 0 ? -1 : 1;
      let tx = 0, ry = 0, sc = 1, tz = 0, op = 1, zi = 50;
      if (off !== 0) {
        tx = sign * (w * 0.6 + (abs - 1) * w * 0.42);
        ry = -sign * 38;
        sc = Math.max(0.6, 1 - abs * 0.17);
        tz = -150 - (abs - 1) * 120;
        op = abs === 1 ? 0.82 : abs === 2 ? 0.5 : 0;
        zi = 50 - abs;
      }
      card.style.transform =
        `translate(calc(-50% + ${tx.toFixed(1)}px), -50%) translateZ(${tz}px) ` +
        `rotateY(${ry}deg) scale(${sc.toFixed(3)})`;
      card.style.opacity = String(op);
      card.style.zIndex = String(zi);
      card.classList.toggle("is-active", off === 0);
      card.setAttribute("aria-hidden", off === 0 ? "false" : "true");
      card.style.pointerEvents = abs >= 3 ? "none" : "auto";
      card.querySelector("a.pf-visit")?.setAttribute("tabindex", off === 0 ? "0" : "-1");
    });
  }, [flow, active, n, cards, resizeTick]);

  // Transitions switch on only after the first coverflow layout has painted.
  useEffect(() => {
    if (!flow) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(frame);
      setSettled(false);
    };
  }, [flow]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setResizeTick((t) => t + 1), 120);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const endDrag = useCallback(
    (e?: { pointerId: number }) => {
      const d = drag.current;
      if (!d.dragging || (e && d.pid !== -1 && e.pointerId !== d.pid)) return;
      d.dragging = false;
      try {
        if (d.captured && d.pid !== -1) stageRef.current?.releasePointerCapture(d.pid);
      } catch {
        // Capture already released.
      }
      d.pid = -1;
      d.captured = false;
      if (Math.abs(d.moved) <= DRAG_SLOP) return;
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 400);
      const w = cards()[0]?.offsetWidth || 300;
      if (Math.abs(d.moved) > Math.max(30, w * 0.12)) {
        const steps = Math.max(1, Math.round(Math.abs(d.moved) / (w * 0.6)));
        go(d.moved < 0 ? steps : -steps);
      }
    },
    [cards, go]
  );

  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    return () => window.removeEventListener("pointerup", endDrag);
  }, [endDrag]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!flow || (e.button && e.button !== 0)) return;
    drag.current = { startX: e.clientX, dragging: true, moved: 0, pid: e.pointerId, captured: false };
    downCard.current = (e.target as Element).closest(".pf-card");
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!flow || !d.dragging || e.pointerId !== d.pid) return;
    d.moved = e.clientX - d.startX;
    // Capture only once the press is a genuine drag, so card links still receive clicks.
    if (!d.captured && Math.abs(d.moved) > DRAG_SLOP) {
      d.captured = true;
      try {
        e.currentTarget.setPointerCapture(d.pid);
      } catch {
        // Pointer already gone.
      }
    }
  };

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!flow) return;
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
      downCard.current = null;
      return;
    }
    const card = (e.target as Element).closest(".pf-card") ?? downCard.current;
    downCard.current = null;
    const idx = card ? cards().indexOf(card as HTMLLIElement) : -1;
    if (idx !== -1 && idx !== active) {
      e.preventDefault();
      goTo(idx);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!flow) return;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => go(-1),
      ArrowRight: () => go(1),
      Home: () => goTo(0),
      End: () => goTo(n - 1),
    };
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  const rootClass = [
    "coverflow reveal",
    shown && "in",
    flow && "is-coverflow",
    flow && !settled && "cf-init",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={revealRef}
      className={rootClass}
      id="coverflow"
      role="group"
      aria-label="Portfolio companies"
      aria-roledescription={flow ? "carousel" : undefined}
      onKeyDown={onKeyDown}
    >
      <div
        ref={stageRef}
        className="cf-stage"
        id="cfStage"
        {...(flow && {
          tabIndex: 0,
          role: "group",
          "aria-label":
            "Portfolio coverflow. Use the left and right arrow keys, or swipe, to browse companies.",
        })}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul ref={trackRef} className="cf-track" id="cfTrack" aria-label="Nine portfolio companies">
          {companies.map((company) => (
            <PortfolioCard key={company.slug} company={company} />
          ))}
        </ul>
      </div>

      {flow && (
        <>
          <button type="button" className="cf-arrow cf-prev" aria-label="Previous company" onClick={() => go(-1)}>
            <ChevronLeftIcon />
          </button>
          <button type="button" className="cf-arrow cf-next" aria-label="Next company" onClick={() => go(1)}>
            <ChevronRightIcon />
          </button>
          <div className="cf-nav">
            <div className="cf-dots" role="group" aria-label="Choose a company">
              {companies.map((company, i) => (
                <button
                  key={company.slug}
                  type="button"
                  className={i === active ? "cf-dot is-active" : "cf-dot"}
                  aria-label={`Show ${company.name}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <p className="cf-counter" aria-hidden="true">
              <b>{pad(active + 1)}</b> / {pad(n)}
            </p>
          </div>
          <p className="cf-live sr-only" aria-live="polite">
            {`${companies[active].name}, ${active + 1} of ${n}`}
          </p>
        </>
      )}
    </div>
  );
}
