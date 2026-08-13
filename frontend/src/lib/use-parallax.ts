"use client";

import { useEffect, useState } from "react";

export type ParallaxOffset = {
  scrollY: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  isReducedMotion: boolean;
};

export function useParallax(active = true): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({
    scrollY: 0,
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
    isReducedMotion: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReduced = motionQuery.matches;

    if (isReduced || !active) {
      return;
    }

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let ticking = false;
    let currentScrollY = window.scrollY;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const updatePosition = () => {
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      const progress = docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;

      setOffset({
        scrollY: currentScrollY,
        scrollProgress: progress,
        mouseX: currentMouseX,
        mouseY: currentMouseY,
        isReducedMotion: false,
      });

      if (
        Math.abs(targetMouseX - currentMouseX) > 0.001 ||
        Math.abs(targetMouseY - currentMouseY) > 0.001
      ) {
        requestAnimationFrame(updatePosition);
      } else {
        ticking = false;
      }
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updatePosition);
      }
    };

    const handleScroll = () => {
      currentScrollY = window.scrollY;
      requestUpdate();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isTouchDevice) {
        return;
      }
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      requestUpdate();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (!isTouchDevice) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [active]);

  return offset;
}

