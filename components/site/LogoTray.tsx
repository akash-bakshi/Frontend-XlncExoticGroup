"use client";

import type { PointerEvent } from "react";
import { CoinMark, coinClassName } from "@/components/CoinMark";
import { MOTION_OK, useMediaQuery } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import { COMPANIES } from "@/lib/companies";

const TILT_MAX = 9;

function tilt(event: PointerEvent<HTMLAnchorElement>) {
  const cell = event.currentTarget;
  const r = cell.getBoundingClientRect();
  const px = (event.clientX - r.left) / r.width - 0.5;
  const py = (event.clientY - r.top) / r.height - 0.5;
  cell.style.setProperty("--ry", `${(px * TILT_MAX).toFixed(2)}deg`);
  cell.style.setProperty("--rx", `${(-py * TILT_MAX).toFixed(2)}deg`);
}

function settle(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.removeProperty("--rx");
  event.currentTarget.style.removeProperty("--ry");
}

export function LogoTray() {
  const [ref, shown] = useReveal<HTMLUListElement>(true);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const motionOk = useMediaQuery(MOTION_OK);
  const canTilt = canHover && motionOk;

  return (
    <div className="hero-showcase">
      <div className="logo-tray">
        <p className="tray-label">Our companies</p>
        <ul
          ref={ref}
          className={shown ? "tray-grid reveal-stagger in" : "tray-grid reveal-stagger"}
          aria-label="Portfolio companies"
        >
          {COMPANIES.map((company) => (
            <li key={company.slug}>
              <a
                className={coinClassName(company)}
                href={company.url ?? "#portfolio"}
                {...(company.url ? { target: "_blank", rel: "noopener" } : {})}
                data-name={company.name}
                aria-label={company.trayLabel}
                onPointerMove={canTilt ? tilt : undefined}
                onPointerLeave={canTilt ? settle : undefined}
              >
                <CoinMark company={company} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
