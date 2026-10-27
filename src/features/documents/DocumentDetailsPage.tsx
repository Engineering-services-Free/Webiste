import { Download, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";

import { UniversalError } from "@/components/common/UniversalError";
import { Reveal } from "@/components/site/motion";
import { ButtonLink, PageHero, PageSkeleton, QueryError } from "@/components/site/ui";
import { useClients } from "@/hooks/useClients";
import { useDocument } from "@/hooks/useDocuments";
import { usePageMeta } from "@/hooks/usePageMeta";
import { documentTypeLabel, formatDate, isHttpUrl } from "@/lib/format";

export function DocumentDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const query = useDocument(id);
  const clients = useClients({ limit: 100 }).data?.data ?? [];
  const document = query.data?.data;

  usePageMeta(document?.title, document?.description);

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (query.data && !document) {
    return <UniversalError type="not-found" />;
  }

  if (!document) {
    return <PageSkeleton />;
  }

  const fileUrl = isHttpUrl(document.file.url) ? document.file.url : undefined;
  const client = clients.find((item) => item.id === document.clientId);
  const isPdf = /\.pdf($|\?)/i.test(document.file.storagePath || document.file.url);

  return (
    <>
      <PageHero
        compact
        eyebrow={documentTypeLabel(document.type)}
        title={document.title}
        description={document.description}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Documents", to: "/documents" },
          { label: document.title },
        ]}
      >
        {fileUrl && (
          <div className="flex flex-wrap gap-3">
            <ButtonLink to={fileUrl} external tone="light" icon={<ExternalLink className="size-4" />}>
              Open in new tab
            </ButtonLink>
            <ButtonLink to={fileUrl} external tone="outline-light" icon={<Download className="size-4" />}>
              Download
            </ButtonLink>
          </div>
        )}
      </PageHero>

      <section className="container-site py-16 sm:py-24">
        <Reveal className="mb-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-muted-foreground">
          <span>
            <span className="uppercase tracking-[0.16em]">Type · </span>
            {documentTypeLabel(document.type)}
          </span>
          {client && (
            <span>
              <span className="uppercase tracking-[0.16em]">Client · </span>
              {client.name}
            </span>
          )}
          <span>
            <span className="uppercase tracking-[0.16em]">Updated · </span>
            {formatDate(document.updatedAt)}
          </span>
        </Reveal>
        {fileUrl && isPdf ? (
          <Reveal delay={0.1}>
            <iframe
              src={fileUrl}
              title={document.title}
              className="h-[80vh] w-full rounded-md border border-ink/10 bg-white"
            />
          </Reveal>
        ) : (
          <p className="rounded-md border border-dashed border-ink/20 p-10 text-center text-muted-foreground">
            A preview isn't available for this file. Use the buttons above to open it.
          </p>
        )}
      </section>
    </>
  );
}
