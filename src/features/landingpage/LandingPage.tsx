import {
  ArrowDown,
  Factory,
  HardHat,
  PencilRuler,
  ShieldCheck,
  Timer,
  Zap,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { BlogCard, ClientLogo, ProjectCard, ServiceCard } from "@/components/site/cards";
import {
  CountUp,
  Marquee,
  ParallaxImage,
  Reveal,
  SplitText,
  Stagger,
  StaggerItem,
} from "@/components/site/motion";
import {
  ButtonLink,
  EmptyState,
  GridLines,
  PageSkeleton,
  QueryError,
  RichText,
  SectionHeading,
} from "@/components/site/ui";
import { useClients } from "@/hooks/useClients";
import { useLandingPage } from "@/hooks/useLandingPage";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProjects } from "@/hooks/useProjects";
import { useServices } from "@/hooks/useServices";
import { useWebsiteDashboard } from "@/hooks/useWebsiteDashboard";
import { EASE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { LandingPage as LandingContent } from "@/typings/landing-page.typings";

const SECTORS = [
  { name: "Oil & Gas", icon: Factory },
  { name: "Power & Energy", icon: Zap },
  { name: "Petrochemical", icon: Factory },
  { name: "Infrastructure", icon: HardHat },
  { name: "Construction", icon: HardHat },
  { name: "Process Plants", icon: PencilRuler },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Safety first",
    text: "Site practices, method statements and supervision that protect people, plant and schedule.",
  },
  {
    icon: PencilRuler,
    title: "Technical precision",
    text: "Fabrication-ready drawings and dimensional control from the design desk to final erection.",
  },
  {
    icon: HardHat,
    title: "Quality workmanship",
    text: "Skilled welders, fitters and erectors delivering work that passes inspection the first time.",
  },
  {
    icon: Timer,
    title: "Timely execution",
    text: "Coordinated fabrication, logistics and site teams that keep industrial shutdowns on track.",
  },
];

export function LandingPage() {
  const landingQuery = useLandingPage();
  const dashboardQuery = useWebsiteDashboard();
  const projectsTotal = useProjects({ status: "published" }).data?.pagination.total;
  const servicesTotal = useServices({ status: "published" }).data?.pagination.total;
  const clientsTotal = useClients({ limit: 100 }).data?.pagination.total;

  const landing = landingQuery.data?.data ?? null;
  usePageMeta(undefined, landing?.hero.description);

  if (landingQuery.error && landingQuery.data === undefined) {
    return <QueryError error={landingQuery.error} onRetry={() => void landingQuery.refetch()} />;
  }

  if (dashboardQuery.error && dashboardQuery.data === undefined) {
    return <QueryError error={dashboardQuery.error} onRetry={() => void dashboardQuery.refetch()} />;
  }

  if (!landingQuery.data || !dashboardQuery.data) {
    return <PageSkeleton />;
  }

  const { blogs, projects, services, clients } = dashboardQuery.data.data;
  const stats = [
    { label: "Delivered projects", value: projectsTotal ?? projects.length },
    { label: "Core services", value: servicesTotal ?? services.length },
    { label: "Industrial clients", value: clientsTotal ?? clients.length },
  ];

  return (
    <>
      <Hero landing={landing} stats={stats} />

      {/* What we do */}
      <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div>
          <Reveal>
            <span className="eyebrow text-brand">What we do</span>
          </Reveal>
          <SplitText
            text="Engineering that holds up on site, not just on paper"
            className="display mt-5 text-4xl text-ink sm:text-5xl"
          />
          <Reveal delay={0.2} className="mt-10 hidden lg:block">
            <ParallaxImage
              src={projects[0]?.heroImage.url ?? ""}
              alt={projects[0]?.heroImage.alt ?? "Recent project"}
              className="aspect-[4/3] rounded-md"
            />
          </Reveal>
        </div>
        <div className="lg:pt-16">
          <Reveal>
            {landing?.whatWeDo ? (
              <RichText value={landing.whatWeDo} />
            ) : (
              <p className="text-muted-foreground">Our story is being updated.</p>
            )}
          </Reveal>
          <Stagger className="mt-12 grid gap-px overflow-hidden rounded-md border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="group bg-paper p-7 transition-colors duration-500 hover:bg-white">
                <Icon className="size-7 text-brand transition-transform duration-500 group-hover:-translate-y-1" />
                <h3 className="mt-6 font-display text-lg uppercase text-ink">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <ButtonLink to="/about">More about us</ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            eyebrow="Our services"
            title="Capabilities across the project lifecycle"
            description="From design and detailing to fabrication, erection and commissioning support."
            action={<ButtonLink to="/services" tone="outline-dark">All services</ButtonLink>}
          />
          {services.length > 0 ? (
            <Stagger className={cn("mt-16 grid gap-5", services.length > 1 && "md:grid-cols-2 xl:grid-cols-3")}>
              {services.map((service, index) => (
                <StaggerItem key={service.id} className="h-full">
                  <ServiceCard service={service} index={index} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <div className="mt-16">
              <EmptyState message="Services will be published soon." />
            </div>
          )}
        </div>
      </section>

      {/* Sectors - dark statement block in the spirit of Altnest's home three */}
      <section className="relative isolate overflow-hidden bg-ink py-24 text-white sm:py-36">
        <GridLines />
        <div className="container-site text-center">
          <Reveal>
            <span className="eyebrow text-white/55">Sectors we serve</span>
          </Reveal>
          <SplitText
            text="Trusted by industry where reliability is non-negotiable"
            className="display mx-auto mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-6xl"
          />
        </div>
        <div className="container-site mt-16">
        <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 md:grid-cols-3 lg:grid-cols-6" gap={0.07}>
          {SECTORS.map(({ name, icon: Icon }) => (
            <StaggerItem
              key={name}
              className="group flex flex-col items-center gap-5 bg-ink px-4 py-10 text-center transition-colors duration-500 hover:bg-brand"
            >
              <Icon className="size-8 text-white/50 transition-colors group-hover:text-white" />
              <span className="font-display text-sm uppercase tracking-wider">{name}</span>
            </StaggerItem>
          ))}
        </Stagger>
        </div>
      </section>

      {/* Projects */}
      <section className="container-site py-24 sm:py-32">
        <SectionHeading
          eyebrow="Featured work"
          title="Recent projects from the field"
          action={<ButtonLink to="/projects" tone="outline-dark">All projects</ButtonLink>}
        />
        {projects.length > 0 ? (
          <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
            {projects.slice(0, 4).map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 0.12} className={cn(index % 2 === 1 && "md:mt-24")}>
                <ProjectCard project={project} large />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-16">
            <EmptyState message="Projects will be published soon." />
          </div>
        )}
      </section>

      {/* Clients */}
      {clients.length > 0 && (
        <section className="border-y border-ink/10 bg-white py-20">
          <div className="container-site mb-12 flex flex-col items-center gap-4 text-center">
            <span className="eyebrow text-brand">Our clients</span>
            <p className="font-display text-2xl uppercase text-ink sm:text-3xl">
              Proud to work with leading manufacturers
            </p>
          </div>
          <Marquee duration={Math.max(20, clients.length * 8)}>
            {[...clients, ...clients, ...clients].map((client, index) => (
              <ClientLogo key={`${client.id}-${index}`} client={client} className="mx-10 sm:mx-16" />
            ))}
          </Marquee>
          <div className="mt-12 text-center">
            <ButtonLink to="/clients" tone="outline-dark">View all clients</ButtonLink>
          </div>
        </section>
      )}

      {/* Insights */}
      {blogs.length > 0 && (
        <section className="container-site py-24 sm:py-32">
          <SectionHeading
            eyebrow="Insights"
            title="Notes from our project sites"
            action={<ButtonLink to="/blogs" tone="outline-dark">All articles</ButtonLink>}
          />
          <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(0, 3).map((blog) => (
              <StaggerItem key={blog.id} className="h-full">
                <BlogCard blog={blog} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </>
  );
}

function Hero({
  landing,
  stats,
}: {
  landing: LandingContent | null;
  stats: { label: string; value: number }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const title = landing?.hero.title ?? "Muthammal Engineering Services";

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div className="absolute inset-0 -z-10" style={{ scale: videoScale }}>
        <motion.video
          className="h-full w-full object-cover"
          src="/Banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <motion.div
        className="container-site flex flex-col justify-end pb-10 pt-32 sm:pb-14"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.span
          className="eyebrow text-white/70"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
        >
          Engineering & industrial services · India
        </motion.span>
        <SplitText
          as="h1"
          immediate
          delay={0.4}
          text={title}
          className="display mt-6 max-w-5xl text-[2.6rem] sm:text-7xl lg:text-[5.5rem]"
        />
        {landing?.hero.description && (
          <motion.p
            className="mt-8 max-w-xl text-lg leading-8 text-white/75"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          >
            {landing.hero.description}
          </motion.p>
        )}
        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.05 }}
        >
          <ButtonLink to="/services" tone="light">Explore services</ButtonLink>
          <ButtonLink to="/projects" tone="outline-light">View projects</ButtonLink>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 border-t border-white/15 pt-8 sm:mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3 }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <CountUp value={stat.value} className="font-display text-3xl sm:text-5xl" />
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-white/55 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: window.innerHeight - 80, behavior: "smooth" });
        }}
        aria-label="Scroll to content"
        className="absolute bottom-10 right-5 hidden size-14 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink sm:grid lg:right-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.6 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <ArrowDown className="size-5" />
      </motion.a>
    </section>
  );
}
