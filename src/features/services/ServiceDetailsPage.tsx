import { Check, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { ProjectCard } from "@/components/site/cards";
import { Reveal, SplitText, Stagger, StaggerItem } from "@/components/site/motion";
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
import { UniversalError } from "@/components/common/UniversalError";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProjects } from "@/hooks/useProjects";
import { useServiceBySlug } from "@/hooks/useServices";
import { unique } from "@/lib/format";
import type { ServiceFaq } from "@/typings/services.typings";

export function ServiceDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useServiceBySlug(slug);
  const projects = useProjects({ status: "published" }).data?.data ?? [];
  const service = query.data?.data;

  usePageMeta(service?.seo?.metaTitle || service?.title, service?.seo?.metaDescription || service?.shortDescription);

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (query.data && !service) {
    return <UniversalError type="not-found" />;
  }

  if (!service) {
    return <PageSkeleton />;
  }

  const related = projects.filter((project) => project.relatedServices.includes(service.id));
  const process = [...service.process].sort((a, b) => a.step - b.step);
  const industries = unique(service.industries);

  return (
    <>
      <PageHero
        eyebrow={service.tagline || "Service"}
        title={service.title}
        description={service.shortDescription}
        image={service.heroImage}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: service.title },
        ]}
      >
        <ButtonLink to="/contact" tone="light">Discuss your requirement</ButtonLink>
      </PageHero>

      {/* Overview + summary */}
      <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <Reveal>
            <span className="eyebrow text-brand">Overview</span>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <RichText value={service.overview} className="text-lg leading-9" />
          </Reveal>
          {service.detail && (
            <Reveal delay={0.15} className="mt-8">
              <RichText value={service.detail} />
            </Reveal>
          )}
        </div>
        {service.summary.length > 0 && (
          <Reveal delay={0.2} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-md bg-ink p-8 text-white sm:p-10">
              <p className="eyebrow text-white/55">At a glance</p>
              <ul className="mt-8 space-y-5">
                {service.summary.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-brand">
                      <Check className="size-3.5" />
                    </span>
                    <span className="leading-7 text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
              {service.deliverables.length > 0 && (
                <>
                  <p className="eyebrow mt-10 text-white/55">Deliverables</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <Chip key={item} invert>{item}</Chip>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Reveal>
        )}
      </section>

      {/* Capabilities */}
      {service.capabilities.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-site">
            <SectionHeading eyebrow="Capabilities" title="What this service covers" />
            <Stagger className="mt-16 grid overflow-hidden rounded-md border-l border-t border-ink/10 md:grid-cols-2 lg:grid-cols-3">
              {service.capabilities.map((capability, index) => (
                <StaggerItem key={capability.title} className="group relative border-b border-r border-ink/10 bg-white p-8 transition-colors duration-500 hover:bg-ink hover:text-white sm:p-10">
                  <span className="font-display text-sm text-brand transition-colors group-hover:text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-8 text-xl">{capability.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground transition-colors group-hover:text-white/70">
                    {capability.description}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Process */}
      {process.length > 0 && (
        <section className="relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
          <GridLines />
          <div className="container-site">
            <SectionHeading invert eyebrow="Our process" title="How we take it from scope to site" />
            <ol className="relative mt-16 border-l border-white/15 md:ml-4">
              {process.map((step, index) => (
                <motion.li
                  key={step.step}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: index * 0.05 }}
                  className="group relative grid gap-3 pb-12 pl-10 md:grid-cols-[16rem_1fr] md:gap-12 md:pl-16"
                >
                  <span className="absolute -left-[9px] top-1.5 size-[17px] rounded-full border-2 border-ink bg-white/30 transition-colors duration-500 group-hover:bg-brand" />
                  <div>
                    <span className="font-display text-sm text-white/45">Step {String(step.step).padStart(2, "0")}</span>
                    <h3 className="display mt-2 text-xl">{step.title}</h3>
                  </div>
                  <p className="leading-7 text-white/65">{step.description}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Technologies, industries, benefits */}
      <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-3">
        {[
          { title: "Technologies & tools", items: service.technologies },
          { title: "Industries served", items: industries },
          { title: "Key benefits", items: unique(service.benefits) },
        ]
          .filter((group) => group.items.length > 0)
          .map((group, index) => (
            <Reveal key={group.title} delay={index * 0.1}>
              <h3 className="font-display text-lg uppercase text-ink">{group.title}</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          ))}
      </section>

      {service.faqs.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Reveal>
                <span className="eyebrow text-brand">FAQ</span>
              </Reveal>
              <SplitText text="Questions clients often ask" className="display mt-5 text-4xl text-ink sm:text-5xl" />
            </div>
            <FaqList faqs={service.faqs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-site py-24 sm:py-32">
          <SectionHeading
            eyebrow="Related projects"
            title="This service in action"
            action={<ButtonLink to="/projects" tone="outline-dark">All projects</ButtonLink>}
          />
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {related.slice(0, 4).map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.12}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function FaqList({ faqs }: { faqs: ServiceFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const id = `faq-${index}`;

        return (
          <Reveal key={`${faq.question}-${index}`} delay={index * 0.05}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg uppercase text-ink transition-colors hover:text-brand"
              >
                {faq.question}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15">
                  {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <RichText value={faq.answer} className="pb-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        );
      })}
    </div>
  );
}
