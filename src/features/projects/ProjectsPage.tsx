import { useState } from "react";

import { ProjectCard } from "@/components/site/cards";
import { Reveal } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  Pagination,
  QueryError,
  SectionHeading,
} from "@/components/site/ui";
import { useClients } from "@/hooks/useClients";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

export function ProjectsPage() {
  const [page, setPage] = useState(1);
  const query = useProjects({ status: "published", ...(page > 1 && { page }) });
  const clients = useClients({ limit: 100 }).data?.data ?? [];
  usePageMeta("Projects");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const projects = query.data.data;
  const clientName = (id: string) => clients.find((client) => client.id === id)?.name;

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Steel, piping and structures delivered on site"
        description="A selection of fabrication, erection and engineering work completed for industrial clients."
        image={projects[0]?.heroImage}
        crumbs={[{ label: "Home", to: "/" }, { label: "Projects" }]}
      />
      <section className="container-site py-24 sm:py-32">
        <SectionHeading
          eyebrow={`${query.data.pagination.total} project${query.data.pagination.total === 1 ? "" : "s"}`}
          title="Our portfolio"
        />
        {projects.length > 0 ? (
          <div className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal
                key={project.id}
                delay={(index % 2) * 0.12}
                className={cn(index % 2 === 1 && "md:mt-24")}
              >
                <ProjectCard project={project} large clientName={clientName(project.clientId)} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-16">
            <EmptyState message="No public projects are available yet." />
          </div>
        )}
        <Pagination pagination={query.data.pagination} onChange={setPage} />
      </section>
    </>
  );
}
