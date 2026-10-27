import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { BrowserRouter, useLocation } from "react-router-dom";

import { UniversalLoader } from "./components/common/UniversalLoader";
import { ScrollProgress } from "./components/site/motion";
import { EASE } from "./lib/site";
import { CtaBand, SiteFooter } from "./components/site/SiteFooter";
import { SiteHeader } from "./components/site/SiteHeader";
import { WebsiteRoutes } from "./routes/WebsiteRoutes";

function SiteLayout() {
  const location = useLocation();
  const showCta = !["/contact", "/404"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only z-[70] rounded bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <SiteHeader />

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          id="main"
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: EASE } }}
        >
          <WebsiteRoutes location={location} />
        </motion.main>
      </AnimatePresence>

      {showCta && <CtaBand />}
      <SiteFooter />
      <UniversalLoader />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SiteLayout />
      </BrowserRouter>
    </MotionConfig>
  );
}
