"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION, useMediaQuery } from "@/hooks/useMediaQuery";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const video = ref.current;
    if (!video || !reduced) return;
    video.pause();
    video.removeAttribute("autoplay");
  }, [reduced]);

  return (
    <video
      ref={ref}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/assets/video/sd-hero.jpg"
    >
      <source src="/assets/video/san-diego.mp4" type="video/mp4" />
    </video>
  );
}
