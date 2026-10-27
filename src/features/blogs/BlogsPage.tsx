import { ArrowUpRight, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { BlogCard } from "@/components/site/cards";
import { Reveal, SmartImage, Stagger, StaggerItem } from "@/components/site/motion";
import {
  EmptyState,
  PageHero,
  PageSkeleton,
  Pagination,
  QueryError,
} from "@/components/site/ui";
import { useBlogs } from "@/hooks/useBlogs";
import { usePageMeta } from "@/hooks/usePageMeta";
import { formatDate, titleCase, truncate } from "@/lib/format";

export function BlogsPage() {
  const [page, setPage] = useState(1);
  const query = useBlogs({ status: "published", ...(page > 1 && { page }) });
  usePageMeta("Insights");

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (!query.data) {
    return <PageSkeleton />;
  }

  const blogs = query.data.data;
  const [lead, ...rest] = page === 1 ? blogs : [undefined, ...blogs];

  return (
    <>
      <PageHero
        compact
        eyebrow="Insights"
        title="Field notes & project stories"
        description="How our teams plan, fabricate and erect industrial structures, told from the site."
        crumbs={[{ label: "Home", to: "/" }, { label: "Insights" }]}
      />
      <section className="container-site py-24 sm:py-32">
        {blogs.length === 0 && <EmptyState message="No articles have been published yet." />}

        {lead && (
          <Reveal>
            <Link
              to={`/blogs/${lead.slug}`}
              className="group grid overflow-hidden rounded-md bg-ink text-white lg:grid-cols-[1.25fr_1fr]"
            >
              <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[28rem]">
                <SmartImage
                  src={lead.coverImage?.url}
                  alt={lead.coverImage?.alt || lead.title}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
                <div>
                  <span className="eyebrow text-white/55">Latest article</span>
                  <h2 className="display mt-6 text-3xl sm:text-4xl">{titleCase(lead.title)}</h2>
                  <p className="mt-5 leading-8 text-white/70">{truncate(lead.shortDescription, 260)}</p>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs uppercase tracking-[0.16em] text-white/60">
                  <span className="flex items-center gap-4">
                    {formatDate(lead.publishedAt ?? lead.createdAt)}
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {lead.readingTime} min
                    </span>
                  </span>
                  <span className="grid size-12 place-items-center rounded-full border border-white/30 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-ink">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map(
              (blog) =>
                blog && (
                  <StaggerItem key={blog.id} className="h-full">
                    <BlogCard blog={blog} />
                  </StaggerItem>
                ),
            )}
          </Stagger>
        )}
        <Pagination pagination={query.data.pagination} onChange={setPage} />
      </section>
    </>
  );
}
