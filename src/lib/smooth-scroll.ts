import Lenis from "lenis";
import { useSyncExternalStore } from "react";

let lenis: Lenis | null = null;
let introDone = false;
const introListeners = new Set<() => void>();

export function startSmoothScroll(): () => void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || lenis) {
    return () => {};
  }

  lenis = new Lenis({ lerp: 0.09, autoRaf: true, anchors: true });

  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToY(y: number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(y, { immediate, force: true });
    return;
  }

  window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

/** Freezes page scrolling for overlays (menu, lightbox, loader). */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) {
    lenis?.stop();
  } else {
    lenis?.start();
  }
}

export function markIntroDone() {
  if (introDone) {
    return;
  }

  introDone = true;
  introListeners.forEach((listener) => listener());
}

/** True once the intro loader has started lifting, so hero animations can begin. */
export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (listener) => {
      introListeners.add(listener);
      return () => introListeners.delete(listener);
    },
    () => introDone,
    () => true,
  );
}
