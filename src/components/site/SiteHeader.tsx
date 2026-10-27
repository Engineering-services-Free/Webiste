import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { useContact } from "@/hooks/useContact";
import { formatPhone, telHref } from "@/lib/format";
import { EASE, NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";


import { ButtonLink } from "./ui";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)} aria-label="Muthammal Engineering Services home">
      <span className="grid size-11 place-items-center rounded-full bg-white p-1.5 shadow-sm">
        <img src="/Logo.png" alt="" className="h-full w-full object-contain" />
      </span>
      <span className="font-display text-[0.95rem] uppercase leading-tight tracking-[0.08em]">
        Muthammal
        <span className="block text-[0.62rem] tracking-[0.3em] opacity-70">
          Engineering Services
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const contact = useContact().data?.data;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > 400 && latest > previous && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-white transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled || open
            ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-site flex h-20 items-center justify-between gap-6">
          <BrandMark />

          <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative px-3.5 py-2 text-[0.78rem] font-medium uppercase tracking-[0.14em] transition-colors",
                    isActive ? "text-white" : "text-white/65 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-white transition-transform duration-500",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink to="/contact" tone="light" className="hidden h-11 sm:inline-flex">
              Contact us
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border border-white/25 transition hover:bg-white hover:text-ink xl:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 text-white xl:hidden"
          >
            <motion.nav
              aria-label="Mobile navigation"
              className="container-site flex flex-1 flex-col justify-center gap-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
            >
              {[...NAV_LINKS, { to: "/contact", label: "Contact" }].map((link, index) => (
                <motion.div
                  key={link.to}
                  className="overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-baseline gap-4 py-1 font-display text-4xl uppercase sm:text-5xl",
                        isActive ? "text-white" : "text-white/50",
                      )
                    }
                  >
                    <span className="text-xs tracking-widest text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
            {contact && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6 } }}
                className="container-site flex flex-wrap gap-x-8 gap-y-2 border-t border-white/10 py-8 text-sm text-white/60"
              >
                <a href={telHref(contact.contactNumber1)}>{formatPhone(contact.contactNumber1)}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
