import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { HtmlContent } from "@/components/common/HtmlContent";
import { UniversalError } from "@/components/common/UniversalError";
import { getUniversalErrorType } from "@/components/common/universalError.utils";
import { useMagnetic } from "@/hooks/useMagnetic";
import { isHtml } from "@/lib/format";
import { scrollToY, useIntroDone } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import type { Pagination as PaginationMeta } from "@/typings/api.typings";

import { Reveal, SmartImage, SplitText } from "./motion";

const MotionLink = motion.create(Link);
import { EASE } from "@/lib/site";

type ButtonTone = "light" | "dark" | "outline-light" | "outline-dark";

const toneClasses: Record<ButtonTone, string> = {
  light: "bg-white text-ink hover:bg-white/90",
  dark: "bg-ink text-white hover:bg-ink-soft",
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-ink",
  "outline-dark": "border border-ink/25 text-ink hover:bg-ink hover:text-white",
};

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  tone?: ButtonTone;
  className?: string;
  external?: boolean;
  icon?: ReactNode;
}

/** Uppercase pill-less CTA with a sliding arrow, modelled on the Altnest buttons. */
export function ButtonLink({
  to,
  children,
  tone = "dark",
  className,
  external,
  icon,
}: ButtonLinkProps) {
  const magnetic = useMagnetic<HTMLAnchorElement>();
  const classes = cn(
    "group/btn inline-flex h-12 items-center gap-3 whitespace-nowrap rounded-[4px] px-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
    toneClasses[tone],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      <span className="relative block size-4 overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-500 ease-out group-hover/btn:translate-x-full group-hover/btn:-translate-y-full">
          {icon ?? <ArrowUpRight className="size-4" />}
        </span>
        <span className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-500 ease-out group-hover/btn:translate-x-0 group-hover/btn:translate-y-0">
          {icon ?? <ArrowUpRight className="size-4" />}
        </span>
      </span>
    </>
  );

  if (external) {
    return (
      <motion.a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...magnetic}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <MotionLink to={to} className={classes} {...magnetic}>
      {content}
    </MotionLink>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert,
  align = "left",
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  invert?: boolean;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Reveal>
          <span className={cn("eyebrow", invert ? "text-white/60" : "text-brand")}>
            {eyebrow}
          </span>
        </Reveal>
        <SplitText
          text={title}
          className={cn(
            "display mt-5 text-[2rem] sm:text-5xl lg:text-[3.5rem]",
            invert ? "text-white" : "text-ink",
          )}
        />
        {description && (
          <Reveal delay={0.15}>
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-8",
                invert ? "text-white/65" : "text-muted-foreground",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2}>{action}</Reveal>}
    </div>
  );
}

/** Renders CMS fields that may be either rich HTML or plain text with newlines. */
export function RichText({
  value,
  className,
  invert,
}: {
  value?: string | null;
  className?: string;
  invert?: boolean;
}) {
  if (!value?.trim()) {
    return null;
  }

  const classes = cn("rich-text", invert && "rich-text-invert", className);

  if (isHtml(value)) {
    return <HtmlContent html={value} className={classes} />;
  }

  return (
    <div className={classes}>
      {value
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
    </div>
  );
}

export function Chip({
  children,
  invert,
  className,
}: {
  children: ReactNode;
  invert?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-sm",
        invert
          ? "border-white/20 text-white/80"
          : "border-ink/15 bg-white/60 text-ink/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image?: { url: string; alt: string };
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
  compact?: boolean;
}

/** Dark, full-bleed page header shared by every inner page. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  children,
  compact,
}: PageHeroProps) {
  const ready = useIntroDone();
  return (
    <section
      className={cn(
        "relative isolate flex overflow-hidden bg-ink text-white",
        compact ? "min-h-[52vh]" : "min-h-[72vh]",
      )}
    >
      {image?.url ? (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ scale: 1.15 }}
          animate={ready && { scale: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <SmartImage
            src={image.url}
            alt={image.alt || title}
            eager
            className="h-full w-full object-cover"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(21,97,192,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(217,24,66,0.18),transparent_50%)]" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <GridLines />

      <div className="container-site flex flex-col justify-end pb-14 pt-36 sm:pb-20">
        {crumbs && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 12 }}
            animate={ready && { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55"
          >
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {index > 0 && <span className="text-white/30">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="line-clamp-1 text-white/80">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
        <motion.span
          className="eyebrow text-white/60"
          initial={{ opacity: 0 }}
          animate={ready && { opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {eyebrow}
        </motion.span>
        <SplitText
          as="h1"
          immediate
          delay={0.25}
          text={title}
          className="display mt-5 max-w-5xl text-[2.4rem] sm:text-6xl lg:text-7xl"
        />
        {description && (
          <motion.p
            className="mt-7 max-w-2xl text-lg leading-8 text-white/70"
            initial={{ opacity: 0, y: 16 }}
            animate={ready && { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready && { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.75 }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Faint architectural grid used as texture on dark sections. */
export function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]",
        className,
      )}
    />
  );
}

export function PageSkeleton() {
  return (
    <div aria-busy="true">
      <div className="min-h-[60vh] animate-pulse bg-ink" />
      <div className="container-site grid gap-6 py-20 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="aspect-[4/5] animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function QueryError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="pt-24">
      <UniversalError type={getUniversalErrorType(error)} onRetry={onRetry} />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Reveal>
      <div className="rounded-md border border-dashed border-ink/20 px-6 py-20 text-center text-muted-foreground">
        {message}
      </div>
    </Reveal>
  );
}

export function Pagination({
  pagination,
  onChange,
}: {
  pagination?: PaginationMeta;
  onChange: (page: number) => void;
}) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  const go = (page: number) => {
    onChange(page);
    scrollToY(0);
  };

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={!pagination.hasPreviousPage}
        onClick={() => go(pagination.page - 1)}
        className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === pagination.page ? "page" : undefined}
          onClick={() => go(page)}
          className={cn(
            "grid size-11 place-items-center rounded-full text-sm transition",
            page === pagination.page
              ? "bg-ink text-white"
              : "border border-ink/15 hover:bg-ink/5",
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={!pagination.hasNextPage}
        onClick={() => go(pagination.page + 1)}
        className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
