import { useSyncExternalStore } from "react";

let introDone = false;
const introListeners = new Set<() => void>();

export function scrollToY(y: number, immediate = false) {
  window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

/** Freezes page scrolling for overlays (menu, lightbox, loader). */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
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
