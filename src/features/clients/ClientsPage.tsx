import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";

import { SmartImage } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  QueryError,
  SectionHeading,
} from "@/components/site/ui";
import { useClients } from "@/hooks/useClients";
import { usePageMeta } from "@/hooks/usePageMeta";
import { unique } from "@/lib/format";
import { cn } from "@/lib/utils";

const ALL = "All";

export function ClientsPage() {
  const query = useClients({ limit: 100 });
  const [industry, setIndustry] = useState(ALL);
  usePageMeta("Clients");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const clients = query.data.data;
  const industries = [ALL, ...unique(clients.map((client) => client.industry))];
  const filtered = industry === ALL ? clients : clients.filter((client) => client.industry === industry);

  return (
    <>
      <PageHero
        compact
        eyebrow="Clients"
        title="Partners who trust our engineering"
        description="Manufacturers, process industries and infrastructure builders we have delivered for."
        crumbs={[{ label: "Home", to: "/" }, { label: "Clients" }]}
      />
      <section className="container-site py-24 sm:py-32">
        <SectionHeading
          eyebrow={`${query.data.pagination.total} client${query.data.pagination.total === 1 ? "" : "s"}`}
          title="Companies we work with"
        />

        {industries.length > 2 && (
          <LayoutGroup>
            <div role="tablist" aria-label="Filter by industry" className="mt-12 flex flex-wrap gap-2">
              {industries.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={industry === item}
                  onClick={() => setIndustry(item)}
                  className={cn(
                    "relative rounded-full px-5 py-2.5 text-sm transition-colors",
                    industry === item ? "text-white" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {industry === item && (
                    <motion.span
                      layoutId="industry-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        )}

        {filtered.length > 0 ? (
          <motion.ul layout className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client, index) => (
              <motion.li
                layout
                key={client.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="group flex flex-col overflow-hidden rounded-md border border-ink/10 bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(13,15,18,0.3)]"
              >
                <div className="grid aspect-[16/9] place-items-center p-10">
                  <SmartImage
                    src={client.image?.url}
                    alt={client.image?.alt || client.name}
                    className="max-h-28 max-w-[80%] object-contain grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-5">
                  <h3 className="font-display uppercase text-ink">{client.name}</h3>
                  {client.industry && (
                    <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs text-brand">
                      {client.industry}
                    </span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="mt-12">
            <EmptyState message="No clients to show yet." />
          </div>
        )}
      </section>
    </>
  );
}
