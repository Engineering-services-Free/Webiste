import { ArrowUp, MessageCircle } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

import { useContact } from "@/hooks/useContact";
import { whatsappHref } from "@/lib/format";
import { EASE } from "@/lib/site";
import { scrollToY } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Ring that trails the pointer on precise-pointer devices. Elements can set
 * `data-cursor="View"` to show a label inside an expanded ring.
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHovering(Boolean(target?.closest("a, button, [role='button'], label, select")));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) {
    return null;
  }

  const size = label ? 88 : hovering ? 56 : 32;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <motion.div
        className={cn(
          "absolute left-0 top-0 grid place-items-center rounded-full",
          label
            ? "bg-white text-ink"
            : "border border-white mix-blend-difference",
        )}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 size-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
      />
    </div>
  );
}

/** Ink panels that sweep across the screen between routes. */
export function PageCurtain() {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] origin-bottom bg-ink"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[55] grid origin-top place-items-center bg-ink"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <img src="/Logo.png" alt="" className="size-14 rounded-full bg-white p-2" />
      </motion.div>
    </>
  );
}

/** Fixed WhatsApp shortcut plus a back-to-top button whose ring tracks progress. */
export function FloatingActions() {
  const contact = useContact().data?.data;
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => setShow(latest > 600));

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => scrollToY(0)}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="group relative grid size-12 place-items-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-ink hover:text-white"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                style={{ pathLength: scrollYProgress }}
              />
            </svg>
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
      {contact?.whatsappNumber && (
        <motion.a
          href={whatsappHref(contact.whatsappNumber, "Hello Muthammal Engineering, I'd like to discuss a project.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.4, duration: 0.6, ease: EASE }}
          className="group relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-30 [animation-duration:2.4s]" />
          <MessageCircle className="relative size-6" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            Chat with us
          </span>
        </motion.a>
      )}
    </div>
  );
}

/** Subtle film grain over the whole page for a printed, tactile finish. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
