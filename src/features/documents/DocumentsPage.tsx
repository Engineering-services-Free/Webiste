import { useState } from "react";

import { DocumentCard } from "@/components/site/cards";
import { Stagger, StaggerItem } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  Pagination,
  QueryError,
  SectionHeading,
} from "@/components/site/ui";
import { useDocuments } from "@/hooks/useDocuments";
import { usePageMeta } from "@/hooks/usePageMeta";

export function DocumentsPage() {
  const [page, setPage] = useState(1);
  const query = useDocuments(page > 1 ? { page } : undefined);
  usePageMeta("Documents");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const documents = [...query.data.data].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        compact
        eyebrow="Documents"
        title="Brochures, profiles & certificates"
        description="Download our company brochure, project portfolio and supporting documents."
        crumbs={[{ label: "Home", to: "/" }, { label: "Documents" }]}
      />
      <section className="container-site py-24 sm:py-32">
        <SectionHeading
          eyebrow={`${query.data.pagination.total} document${query.data.pagination.total === 1 ? "" : "s"}`}
          title="Resource library"
        />
        {documents.length > 0 ? (
          <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <StaggerItem key={document.id} className="h-full">
                <DocumentCard document={document} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="mt-16">
            <EmptyState message="No public documents are available yet." />
          </div>
        )}
        <Pagination pagination={query.data.pagination} onChange={setPage} />
      </section>
    </>
  );
}
