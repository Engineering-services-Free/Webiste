import { useState } from "react";

import { ServiceCard } from "@/components/site/cards";
import { Stagger, StaggerItem } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  Pagination,
  QueryError,
  SectionHeading,
} from "@/components/site/ui";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useServices } from "@/hooks/useServices";
import { cn } from "@/lib/utils";

export function ServicesPage() {
  const [page, setPage] = useState(1);
  const query = useServices({ status: "published", ...(page > 1 && { page }) });
  usePageMeta("Services");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const services = query.data.data;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Integrated engineering & industrial services"
        description="Design, fabrication, erection, piping, mechanical and electrical works delivered by one accountable team."
        image={services[0]?.heroImage}
        crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />
      <section className="container-site py-24 sm:py-32">
        <SectionHeading
          eyebrow={`${query.data.pagination.total} service${query.data.pagination.total === 1 ? "" : "s"}`}
          title="What we can deliver for you"
        />
        {services.length > 0 ? (
          <Stagger
            className={cn(
              "mt-16 grid gap-5",
              services.length > 1 ? "md:grid-cols-2 xl:grid-cols-3" : "max-w-3xl",
            )}
          >
            {services.map((service, index) => (
              <StaggerItem key={service.id} className="h-full">
                <ServiceCard service={service} index={(page - 1) * query.data.pagination.limit + index} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mt-16">
            <EmptyState message="No public services are available yet." />
          </div>
        )}
        <Pagination pagination={query.data.pagination} onChange={setPage} />
      </section>
    </>
  );
}
