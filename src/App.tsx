import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { BrowserRouter, useLocation } from "react-router-dom";

import { UniversalLoader } from "./components/common/UniversalLoader";
import { CustomCursor, FloatingActions, Grain, PageCurtain } from "./components/site/chrome";
import { ScrollProgress } from "./components/site/motion";
import { CtaBand, SiteFooter } from "./components/site/SiteFooter";
import { SiteHeader } from "./components/site/SiteHeader";
import { scrollToY } from "./lib/scroll";
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

      <AnimatePresence mode="wait" onExitComplete={() => scrollToY(0, true)}>
        <motion.main id="main" key={location.pathname} className="flex-1">
          <PageCurtain />
          <WebsiteRoutes location={location} />
        </motion.main>
      </AnimatePresence>

      {showCta && <CtaBand />}
      <SiteFooter />
      <FloatingActions />
      <UniversalLoader />
      <CustomCursor />
      <Grain />
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
