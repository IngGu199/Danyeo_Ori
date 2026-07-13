"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function AboutHeroArt() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const frame = layer?.parentElement;
    if (!layer || !frame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const update = () => {
      animationFrame = 0;

      if (reducedMotion.matches) {
        layer.style.setProperty("--hero-parallax-y", "0px");
        layer.style.setProperty("--hero-parallax-scale", "1.06");
        return;
      }

      const rect = frame.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      const mobile = window.innerWidth <= 720;
      const travel = mobile ? 18 : 46;
      const translateY = (progress - 0.5) * travel;
      const scale = (mobile ? 1.075 : 1.11) - progress * (mobile ? 0.05 : 0.2);

      layer.style.setProperty("--hero-parallax-y", `${translateY.toFixed(2)}px`);
      layer.style.setProperty("--hero-parallax-scale", scale.toFixed(4));
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return <div ref={layerRef} className="about-hero-art" aria-hidden="true"><Image src="/images/about-pixel-hero.png" alt="" fill priority unoptimized sizes="100vw" /></div>;
}
