import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { UniversalError } from "@/components/common/UniversalError";
import { Reveal, SmartImage, Stagger, StaggerItem } from "@/components/site/motion";
import { EASE } from "@/lib/site";
import {
  ButtonLink,
  Chip,
  GridLines,
  PageHero,
  PageSkeleton,
  QueryError,
  RichText,
  SectionHeading,
} from "@/components/site/ui";
import { useClients } from "@/hooks/useClients";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProjectBySlug, useProjects } from "@/hooks/useProjects";
import { useServices } from "@/hooks/useServices";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjectImage } from "@/typings/projects.typings";
import { lockScroll } from "@/lib/scroll";

const GALLERY_PREVIEW = 9;

export function ProjectDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useProjectBySlug(slug);
  const clients = useClients({ limit: 100 }).data?.data ?? [];
  const services = useServices({ status: "published" }).data?.data ?? [];
  const allProjects = useProjects({ status: "published" }).data?.data ?? [];
  const project = query.data?.data;

  usePageMeta(
    project ? project.seo?.metaTitle || titleCase(project.title) : undefined,
    project?.seo?.metaDescription || project?.shortDescription,
  );

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (query.data && !project) {
    return <UniversalError type="not-found" />;
  }

  if (!project) {
    return <PageSkeleton />;
  }

  const client = clients.find((item) => item.id === project.clientId);
  const relatedServices = services.filter((service) => project.relatedServices.includes(service.id));
  const currentIndex = allProjects.findIndex((item) => item.id === project.id);
  const nextProject =
    allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : undefined;

  const facts = [
    { label: "Client", value: client?.name },
    { label: "Industry", value: project.industry },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year ? String(project.year) : undefined },
    { label: "Duration", value: project.duration },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <>
      <PageHero
        eyebrow="Case study"
        title={titleCase(project.title)}
        description={project.shortDescription}
        image={project.heroImage}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Projects", to: "/projects" },
          { label: titleCase(project.title) },
        ]}
      />

      {/* Fact strip */}
      <section className="border-b border-ink/10 bg-white">
        <Stagger className="container-site grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-5" gap={0.06}>
          {facts.map((fact) => (
            <StaggerItem key={fact.label} className="py-8 pr-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{fact.label}</p>
              <p className="mt-2 font-display text-lg uppercase text-ink">{fact.value}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Overview */}
      <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="eyebrow text-brand">Project overview</span>
          </Reveal>
          {project.engineeringScope.length > 0 && (
            <Reveal delay={0.1} className="mt-8">
              <h3 className="font-display text-lg uppercase text-ink">Engineering scope</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.engineeringScope.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          )}
          {relatedServices.length > 0 && (
            <Reveal delay={0.15} className="mt-8">
              <h3 className="font-display text-lg uppercase text-ink">Services used</h3>
              <ul className="mt-4 space-y-2">
                {relatedServices.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="group inline-flex items-center gap-2 text-brand"
                    >
                      {service.title}
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
        <Reveal>
          <RichText value={project.overview} />
        </Reveal>
      </section>

      {/* Challenge & solution */}
      {(project.challenge || project.solution) && (
        <section className="relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
          <GridLines />
          <div className="container-site grid gap-6 lg:grid-cols-2">
            {[
              { label: "The challenge", body: project.challenge, accent: "bg-brand-red" },
              { label: "Our solution", body: project.solution, accent: "bg-brand" },
            ]
              .filter((block) => block.body)
              .map((block, index) => (
                <Reveal
                  key={block.label}
                  delay={index * 0.12}
                  className="rounded-md border border-white/10 bg-white/[0.03] p-8 sm:p-12"
                >
                  <span className={cn("block h-1 w-12", block.accent)} />
                  <h2 className="display mt-6 text-3xl">{block.label}</h2>
                  <RichText value={block.body} invert className="mt-4" />
                </Reveal>
              ))}
          </div>
        </section>
      )}

      {/* Results */}
      {project.results.length > 0 && (
        <section className="container-site py-24 sm:py-32">
          <SectionHeading eyebrow="Results" title="What the project achieved" />
          <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {project.results.map((result) => (
              <StaggerItem
                key={result.metric}
                className="group rounded-md border border-ink/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(13,15,18,0.3)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-brand">{result.metric}</p>
                <p className="display mt-4 text-2xl text-ink">{result.value}</p>
                {result.description && (
                  <p className="mt-3 leading-7 text-muted-foreground">{result.description}</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>
          {project.technologies.length > 0 && (
            <Reveal className="mt-16 border-t border-ink/10 pt-10">
              <h3 className="font-display text-lg uppercase text-ink">Methods & technologies</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          )}
        </section>
      )}

      {project.gallery.length > 0 && <Gallery images={project.gallery} title={project.title} />}

      {nextProject && (
        <Link
          to={`/projects/${nextProject.slug}`}
          data-cursor="Next"
          className="group relative isolate block overflow-hidden bg-ink py-24 text-white sm:py-32"
        >
          <SmartImage
            src={nextProject.heroImage.url}
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 transition duration-[1.4s] group-hover:scale-105 group-hover:opacity-45"
          />
          <div className="container-site flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow text-white/60">Next project</span>
              <p className="display mt-5 max-w-3xl text-3xl sm:text-5xl">{titleCase(nextProject.title)}</p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
              <ArrowUpRight className="size-6" />
            </span>
          </div>
        </Link>
      )}

      <section className="container-site flex justify-center py-16">
        <ButtonLink to="/projects" tone="outline-dark">Back to all projects</ButtonLink>
      </section>
    </>
  );
}

function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? images : images.slice(0, GALLERY_PREVIEW);

  const step = useCallback(
    (delta: number) =>
      setActive((index) => (index === null ? index : (index + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    lockScroll(true);
    window.addEventListener("keydown", onKey);

    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, step]);

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-site">
        <SectionHeading eyebrow={`Gallery · ${images.length} photos`} title="From the fabrication yard to site" />
        <Stagger className="mt-16 columns-1 gap-4 sm:columns-2 lg:columns-3" gap={0.05}>
          {visible.map((image, index) => (
            <StaggerItem key={`${image.url}-${index}`} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(index)}
                data-cursor="Zoom"
                className="group relative block w-full overflow-hidden rounded-md bg-ink"
                aria-label={`Open photo ${index + 1} of ${images.length}`}
              >
                <SmartImage
                  src={image.url}
                  alt={image.alt || title}
                  className="w-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition duration-500 group-hover:bg-ink/35 group-hover:opacity-100">
                  <Expand className="size-7 text-white" />
                </span>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
        {images.length > GALLERY_PREVIEW && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="inline-flex h-12 items-center rounded-[4px] border border-ink/25 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition hover:bg-ink hover:text-white"
            >
              {showAll ? "Show fewer photos" : `Show all ${images.length} photos`}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={images[active].url}
                alt={images[active].alt || title}
                className="max-h-[82vh] max-w-full rounded-md object-contain"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                onClick={(event) => event.stopPropagation()}
              />
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 text-white">
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="grid size-12 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-ink"
              >
                <ArrowLeft className="size-5" />
              </button>
              <span className="min-w-16 text-center text-sm tabular-nums text-white/70">
                {active + 1} / {images.length}
              </span>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="grid size-12 place-items-center rounded-full border border-white/30 transition hover:bg-white hover:text-ink"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Close photo viewer"
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 grid size-12 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
