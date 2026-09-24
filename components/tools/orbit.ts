interface OrbitGeometry {
  left: number;
  top: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  r: number;
  cosTilt: number;
  sinTilt: number;
  persp: number;
  coin: number;
  hubR: number;
}

interface CoinPosition {
  x: number;
  y: number;
  w: number;
}

interface Orbit {
  measure(): boolean;
  at(i: number): CoinPosition | null;
  get(): OrbitGeometry | null;
  sync(): void;
}

// Coin positions are derived from the orbit animation clock, never measured per frame.
export function createOrbit(stage: HTMLElement, hub: HTMLElement, slots: HTMLElement[]): Orbit {
  const ring = stage.querySelector<HTMLElement>(".orbit-ring");
  const animCache: (CSSAnimation | null)[] = [];
  let geo: OrbitGeometry | null = null;

  function measure(): boolean {
    const box = stage.getBoundingClientRect();
    if (!box.width) return false;
    const cs = getComputedStyle(stage);
    const tilt = ((parseFloat(cs.getPropertyValue("--tilt")) || 70) * Math.PI) / 180;
    geo = {
      left: box.left,
      top: box.top,
      w: box.width,
      h: box.height,
      cx: box.width / 2,
      cy: box.height / 2,
      r: ring ? ring.offsetWidth / 2 : box.width * 0.43,
      cosTilt: Math.cos(tilt),
      sinTilt: Math.sin(tilt),
      persp: parseFloat(cs.perspective) || 3000,
      coin: slots[0].offsetWidth || 72,
      hubR: hub.offsetWidth / 2 + 7,
    };
    return true;
  }

  function coinAnim(i: number): CSSAnimation | null {
    const cached = animCache[i];
    if (cached && cached.playState !== "idle") return cached;
    if (!slots[i].getAnimations) return null;
    const found = slots[i]
      .getAnimations()
      .find((a): a is CSSAnimation => (a as CSSAnimation).animationName === "orbit-ccw");
    animCache[i] = found ?? null;
    return animCache[i];
  }

  function at(i: number): CoinPosition | null {
    const anim = coinAnim(i);
    if (!anim || !geo) return null;
    const prog = anim.effect?.getComputedTiming().progress;
    if (prog === null || prog === undefined) return null;
    const th = 2 * Math.PI * prog;
    const x = geo.r * Math.sin(th);
    const yp = -geo.r * Math.cos(th);
    const sc = geo.persp / (geo.persp - yp * geo.sinTilt);
    return { x: geo.cx + x * sc, y: geo.cy + yp * geo.cosTilt * sc, w: geo.coin * sc };
  }

  function sync() {
    if (!geo) return;
    const b = stage.getBoundingClientRect();
    geo.left = b.left;
    geo.top = b.top;
  }

  return { measure, at, get: () => geo, sync };
}

// Canvas spokes from the hub to every orbiting coin, each with a travelling pulse.
export function startNetwork(canvas: HTMLCanvasElement, stage: HTMLElement, orbit: Orbit, slotCount: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr = 1;
  let sprite: HTMLCanvasElement | null = null;
  let spriteDpr = 0;
  let drawable = true;
  let spinning = false;
  let frameId = 0;

  function size(): boolean {
    if (!orbit.measure()) return false;
    const geo = orbit.get()!;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(geo.w * dpr);
    canvas.height = Math.round(geo.h * dpr);
    return true;
  }

  function pulseSprite(): HTMLCanvasElement {
    if (sprite && spriteDpr === dpr) return sprite;
    const R = 2.2 * dpr * 3.2;
    const c = document.createElement("canvas");
    c.width = c.height = Math.ceil(R * 2);
    const g2 = c.getContext("2d")!;
    const mid = c.width / 2;
    const pg = g2.createRadialGradient(mid, mid, 0, mid, mid, R);
    pg.addColorStop(0, "rgba(255, 248, 232, 0.9)");
    pg.addColorStop(0.35, "rgba(228, 194, 122, 0.45)");
    pg.addColorStop(1, "rgba(228, 194, 122, 0)");
    g2.fillStyle = pg;
    g2.beginPath();
    g2.arc(mid, mid, R, 0, 6.2832);
    g2.fill();
    sprite = c;
    spriteDpr = dpr;
    return c;
  }

  // Asked only when layout can change, never per frame.
  function refreshDrawable() {
    drawable = !(!canvas.offsetParent && getComputedStyle(canvas).display === "none");
  }

  function frame(t: number) {
    const geo = orbit.get();
    if (!drawable || !geo || !ctx) return;

    const cx = geo.cx * dpr;
    const cy = geo.cy * dpr;
    const hubR = geo.hubR * dpr;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < slotCount; i++) {
      const c = orbit.at(i);
      if (!c) continue;

      const x = c.x * dpr;
      const y = c.y * dpr;
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const coinR = (c.w / 2 + 3) * dpr;
      if (d <= hubR + coinR) continue;

      const ux = dx / d;
      const uy = dy / d;
      const x0 = cx + ux * hubR;
      const y0 = cy + uy * hubR;
      const x1 = cx + ux * (d - coinR);
      const y1 = cy + uy * (d - coinR);

      const near = Math.max(0, Math.min(1, (c.w - 58) / 26));
      const a = 0.16 + 0.2 * near;

      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(228, 194, 122, ${(a * 0.55).toFixed(3)})`);
      g.addColorStop(0.55, `rgba(228, 194, 122, ${a.toFixed(3)})`);
      g.addColorStop(1, `rgba(255, 244, 222, ${(a * 1.5).toFixed(3)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = (0.8 + 0.4 * near) * dpr;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      const p = (t / 2600 + i / slotCount) % 1;
      const sp = pulseSprite();
      ctx.globalAlpha = Math.sin(p * Math.PI);
      ctx.drawImage(sp, x0 + (x1 - x0) * p - sp.width / 2, y0 + (y1 - y0) * p - sp.height / 2);
      ctx.globalAlpha = 1;
    }
  }

  function loop(now: number) {
    if (!spinning) return;
    frame(now);
    frameId = requestAnimationFrame(loop);
  }

  function startLoop() {
    if (spinning || still) return;
    spinning = true;
    frameId = requestAnimationFrame(loop);
  }

  const resync = () => {
    refreshDrawable();
    size();
  };

  const onVisibility = () => {
    if (document.hidden) {
      spinning = false;
    } else {
      refreshDrawable();
      if (size()) startLoop();
    }
  };

  let resizeTimer: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshDrawable();
      if (size() && still) frame(0);
    }, 150);
  };

  let orientationTimer: ReturnType<typeof setTimeout>;
  const onOrientation = () => {
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(resync, 200);
  };

  refreshDrawable();
  if (size()) {
    if (still) frame(0);
    else startLoop();
  }

  window.addEventListener("scroll", orbit.sync, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onOrientation);
  const observer = new ResizeObserver(resync);
  observer.observe(stage);
  document.fonts?.ready.then(resync);

  return () => {
    spinning = false;
    cancelAnimationFrame(frameId);
    clearTimeout(resizeTimer);
    clearTimeout(orientationTimer);
    window.removeEventListener("scroll", orbit.sync);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onOrientation);
    observer.disconnect();
  };
}

// Pauses the orbit only while the pointer is actually on a coin (a radius test, not a box).
export function startHold(stage: HTMLElement, slots: HTMLElement[], orbit: Orbit) {
  const PAD = 6;
  let held = false;
  let running = false;
  let px = -1;
  let py = -1;

  function onCoin(): boolean {
    if (px < 0) return false;

    const g = orbit.get();
    if (g) {
      let resolved = 0;
      for (let i = 0; i < slots.length; i++) {
        const c = orbit.at(i);
        if (!c) continue;
        resolved++;
        const ddx = px - (g.left + c.x);
        const ddy = py - (g.top + c.y);
        const rr = c.w / 2 + PAD;
        if (ddx * ddx + ddy * ddy <= rr * rr) return true;
      }
      if (resolved) return false;
    }

    // Static grid layout: no orbit animation resolves, so fall back to measured ellipses.
    return slots.some((slot) => {
      const b = slot.getBoundingClientRect();
      if (!b.width) return false;
      const rx = b.width / 2 + PAD;
      const ry = b.height / 2 + PAD;
      const dx = px - (b.left + b.width / 2);
      const dy = py - (b.top + b.height / 2);
      return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
    });
  }

  function set(next: boolean) {
    if (next === held) return;
    held = next;
    stage.classList.toggle("is-held", held);
  }

  function loop() {
    if (!running) return;
    set(onCoin());
    if (held) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  const onMove = (event: PointerEvent) => {
    px = event.clientX;
    py = event.clientY;
    set(onCoin());
    if (!held) start();
  };

  const onLeave = () => {
    px = py = -1;
    running = false;
    set(false);
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  return () => {
    running = false;
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
  };
}
