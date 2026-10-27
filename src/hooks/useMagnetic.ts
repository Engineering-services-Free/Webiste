import { useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent } from "react";

/** Pointer-following offset for primary buttons; mouse only. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.3 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.3 });

  return {
    style: { x, y },
    onPointerMove: (event: ReactPointerEvent<T>) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    },
  };
}
