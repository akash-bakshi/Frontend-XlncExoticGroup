"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent } from "react";
import { CoinMark, coinClassName } from "@/components/CoinMark";
import { COMPANIES, type Company } from "@/lib/companies";
import { LOGO_MARK } from "@/lib/site";
import { useLogin } from "./LoginContext";
import { createOrbit, startHold, startNetwork } from "./orbit";

// Nine coins on one tilted orbit around the XLNC hub; a coin opens the sign-in plate.
export function Galaxy() {
  const { open } = useLogin();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hubRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const hub = hubRef.current;
    if (!stage || !canvas || !hub) return;

    const slots = Array.from(stage.querySelectorAll<HTMLElement>(".orbit-slot"));
    if (!slots.length) return;

    const orbit = createOrbit(stage, hub, slots);
    const stopNetwork = startNetwork(canvas, stage, orbit, slots.length);
    const stopHold = startHold(stage, slots, orbit);
    return () => {
      stopNetwork();
      stopHold();
    };
  }, []);

  // A coin is a circle, so a corner click on its slot counts too.
  const onSlotClick = (company: Company) => (event: MouseEvent<HTMLSpanElement>) => {
    const coin = event.currentTarget.querySelector<HTMLButtonElement>(".tray-cell");
    if (coin) open(company, coin);
  };

  return (
    <div className="galaxy" id="galaxy" ref={stageRef}>
      <span className="orbit-ring ring-1" aria-hidden="true"></span>
      <canvas className="net-canvas" aria-hidden="true" ref={canvasRef}></canvas>
      <div className="galaxy-core" aria-hidden="true">
        <Image
          ref={hubRef}
          className="core-mark"
          src={LOGO_MARK.src}
          width={LOGO_MARK.width}
          height={LOGO_MARK.height}
          alt=""
          loading="eager"
        />
      </div>
      <ul className="orbit-list" aria-label="Portfolio companies">
        {COMPANIES.map((company, i) => (
          <li key={company.slug} className={`orbiter r1 p${i + 1}`}>
            <span className="orbit-slot" onClick={onSlotClick(company)}>
              <button type="button" className={coinClassName(company)} data-name={company.name} data-slug={company.slug}>
                <CoinMark company={company} />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
