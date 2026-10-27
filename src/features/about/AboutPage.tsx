import { ParallaxImage, Reveal, SmartImage, SplitText, Stagger, StaggerItem } from "@/components/site/motion";
import {
  ButtonLink,
  EmptyState,
  PageHero,
  PageSkeleton,
  QueryError,
  RichText,
  SectionHeading,
} from "@/components/site/ui";
import { useAbout } from "@/hooks/useAbout";
import { useFounders } from "@/hooks/useFounders";
import { usePageMeta } from "@/hooks/usePageMeta";
import { truncate } from "@/lib/format";

export function AboutPage() {
  const aboutQuery = useAbout();
  const foundersQuery = useFounders();
  const about = aboutQuery.data?.data ?? null;
  const founders = [...(foundersQuery.data?.data ?? [])].sort((a, b) => a.order - b.order);

  usePageMeta("About", about ? truncate(about.overview, 160) : undefined);

  const blockingError =
    aboutQuery.data === undefined
      ? aboutQuery.error
      : foundersQuery.data === undefined
        ? foundersQuery.error
        : null;

  if (blockingError) {
    return (
      <QueryError
        error={blockingError}
        onRetry={() => {
          if (aboutQuery.data === undefined) {
            void aboutQuery.refetch();
            return;
          }
          void foundersQuery.refetch();
        }}
      />
    );
  }

  if (!aboutQuery.data || !foundersQuery.data) {
    return <PageSkeleton />;
  }

  const [lead, ...rest] = (about?.overview ?? "").split(/\n{2,}/);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Built on precision, safety and craft"
        description={lead ? truncate(lead, 220) : undefined}
        image={about?.heroImage}
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {about ? (
        <section className="container-site grid gap-14 py-24 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <span className="eyebrow text-brand">Who we are</span>
            </Reveal>
            <SplitText
              text="An engineering partner for India's industrial builders"
              className="display mt-5 text-4xl text-ink sm:text-5xl"
            />
            <Reveal delay={0.2} className="mt-10">
              <ParallaxImage
                src={about.heroImage.url}
                alt={about.heroImage.alt || "Muthammal Engineering Services"}
                className="aspect-[4/3] rounded-md"
              />
            </Reveal>
          </div>
          <div>
            <Reveal>
              <RichText value={lead} className="text-xl leading-9 text-ink" />
            </Reveal>
            <Reveal delay={0.1}>
              <RichText value={rest.join("\n\n")} />
            </Reveal>
            {about.aboutUs && (
              <Reveal delay={0.15} className="mt-12 border-t border-ink/10 pt-12">
                <RichText value={about.aboutUs} />
              </Reveal>
            )}
            <Reveal className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/services">Our services</ButtonLink>
              <ButtonLink to="/documents" tone="outline-dark">Company profile</ButtonLink>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="container-site py-24">
          <EmptyState message="Our company story is being updated." />
        </section>
      )}

      {founders.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-site">
            <SectionHeading
              eyebrow="Leadership"
              title="The people behind the work"
              description="A hands-on team that stays close to every drawing, fabrication yard and site."
            />
            <Stagger className="mt-16 grid gap-10 md:grid-cols-2">
              {founders.map((founder) => (
                <StaggerItem key={founder.id} className="group grid gap-8 sm:grid-cols-[14rem_1fr]">
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-ink">
                    <SmartImage
                      src={founder.image?.url}
                      alt={founder.image?.alt || founder.name}
                      className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>
                  <div>
                    <h3 className="display text-2xl text-ink">{founder.name}</h3>
                    <RichText value={founder.overview} className="mt-2 text-base leading-7" />
                    {founder.experience && (
                      <div className="mt-4 border-t border-ink/10 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                          Experience
                        </p>
                        <RichText value={founder.experience} className="text-base leading-7" />
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
