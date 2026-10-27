import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { EASE } from "@/lib/site";
import { lockScroll, markIntroDone } from "@/lib/smooth-scroll";

const MIN_INTRO_MS = 1800;
const BRAND = "MUTHAMMAL";

function subscribeToInitialQueries(
  onStoreChange: () => void,
  queryClient: ReturnType<typeof useQueryClient>,
): () => void {
  return queryClient.getQueryCache().subscribe(onStoreChange);
}

function hasPendingInitialQueries(
  queryClient: ReturnType<typeof useQueryClient>,
): boolean {
  return queryClient.getQueryCache().getAll().some((query) => {
    return (
      query.getObserversCount() > 0 &&
      query.state.fetchStatus === "fetching" &&
      query.state.data === undefined
    );
  });
}

/**
 * Branded intro on the first visit, then a slim top progress bar whenever a
 * route waits on data it has never fetched before.
 */
export function UniversalLoader() {
  const queryClient = useQueryClient();
  const isLoading = useSyncExternalStore(
    (onStoreChange) => subscribeToInitialQueries(onStoreChange, queryClient),
    () => hasPendingInitialQueries(queryClient),
    () => false,
  );
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <AnimatePresence onExitComplete={() => lockScroll(false)}>
        {!introFinished && (
          <IntroOverlay isLoading={isLoading} onDone={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {introFinished && isLoading && <RouteProgress />}
      </AnimatePresence>
    </>
  );
}

function IntroOverlay({
  isLoading,
  onDone,
}: {
  isLoading: boolean;
  onDone: () => void;
}) {
  const progress = useMotionValue(0);
  const [count, setCount] = useState(0);
  const [minElapsed, setMinElapsed] = useState(false);
  const ringOffset = useTransform(progress, [0, 100], [301.6, 0]);
  const barScale = useTransform(progress, [0, 100], [0, 1]);
  const ready = minElapsed && !isLoading;

  useEffect(() => {
    lockScroll(true);
    const timer = window.setTimeout(() => setMinElapsed(true), MIN_INTRO_MS);
    const unsubscribe = progress.on("change", (value) => setCount(Math.round(value)));
    // Creep toward 90% while data loads; the last stretch waits for real readiness.
    const creep = animate(progress, 90, { duration: 2.6, ease: [0.2, 0.7, 0.3, 1] });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
      creep.stop();
    };
  }, [progress]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const finish = animate(progress, 100, {
      duration: 0.6,
      ease: EASE,
      onComplete: () => {
        markIntroDone();
        onDone();
      },
    });

    return () => finish.stop();
  }, [ready, progress, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] text-white"
      role="status"
      aria-label="Loading page content"
      exit={{ pointerEvents: "none" }}
    >
      {/* Trailing brand layer gives the lift a two-tone curtain */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-brand"
        exit={{ clipPath: "inset(0 0 100% 0)" }}
        initial={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 1, ease: EASE, delay: 0.12 }}
      />
      <motion.div
        className="absolute inset-0 flex flex-col overflow-hidden bg-ink"
        initial={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />

        <motion.div
          className="relative flex flex-1 flex-col items-center justify-center gap-8"
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="relative grid size-32 place-items-center sm:size-36">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="1" />
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#loader-gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="301.6"
                style={{ strokeDashoffset: ringOffset }}
              />
              <defs>
                <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1561c0" />
                  <stop offset="100%" stopColor="#d91842" />
                </linearGradient>
              </defs>
            </svg>
            <motion.span
              className="grid size-24 place-items-center rounded-full bg-white p-3 sm:size-28"
              initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <img src="/Logo.png" alt="" className="h-full w-full object-contain" />
            </motion.span>
          </div>

          <div className="text-center">
            <p className="flex justify-center overflow-hidden font-display text-3xl tracking-[0.18em] sm:text-4xl" aria-hidden="true">
              {BRAND.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 + index * 0.05 }}
                >
                  {letter}
                </motion.span>
              ))}
            </p>
            <motion.p
              className="mt-3 text-[0.68rem] uppercase tracking-[0.5em] text-white/50"
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.8 }}
            >
              Engineering Services
            </motion.p>
          </div>
        </motion.div>

        <div className="relative px-5 pb-8 sm:px-12 sm:pb-10">
          <div className="flex items-end justify-between gap-6">
            <motion.p
              className="max-w-[10rem] text-xs uppercase leading-5 tracking-[0.2em] text-white/45 sm:max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Design · Fabrication · Erection
            </motion.p>
            <p className="font-display text-6xl leading-none tabular-nums text-white sm:text-8xl">
              {String(count).padStart(3, "0")}
              <span className="text-2xl text-white/40 sm:text-3xl">%</span>
            </p>
          </div>
          <div className="mt-6 h-px w-full bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-brand to-brand-red"
              style={{ scaleX: barScale }}
            />
          </div>
        </div>
      </motion.div>
      <span className="sr-only">Loading page content...</span>
    </motion.div>
  );
}

function RouteProgress() {
  return (
    <motion.div
      role="status"
      aria-label="Loading page content"
      className="fixed inset-x-0 top-0 z-[90] h-[3px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
    >
      <motion.div
        className="h-full w-1/3 bg-gradient-to-r from-transparent via-brand to-brand-red"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
