import { ArrowUpRight, Check, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { UniversalError } from "@/components/common/UniversalError";
import { BlogCard } from "@/components/site/cards";
import { Reveal, Stagger, StaggerItem } from "@/components/site/motion";
import {
  ButtonLink,
  Chip,
  PageHero,
  PageSkeleton,
  QueryError,
  RichText,
  SectionHeading,
} from "@/components/site/ui";
import { useBlogBySlug, useBlogs } from "@/hooks/useBlogs";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProjects } from "@/hooks/useProjects";
import { formatDate, titleCase } from "@/lib/format";

export function BlogDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useBlogBySlug(slug);
  const projects = useProjects({ status: "published" }).data?.data ?? [];
  const blogs = useBlogs({ status: "published" }).data?.data ?? [];
  const blog = query.data?.data;

  usePageMeta(
    blog ? blog.seo?.metaTitle || titleCase(blog.title) : undefined,
    blog?.seo?.metaDescription || blog?.shortDescription,
  );

  if (query.error && query.data === undefined) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  if (query.data && !blog) {
    return <UniversalError type="not-found" />;
  }

  if (!blog) {
    return <PageSkeleton />;
  }

  const project = projects.find((item) => item.id === blog.projectId);
  const more = blogs.filter((item) => item.id !== blog.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${formatDate(blog.publishedAt ?? blog.createdAt)} · ${blog.readingTime} min read`}
        title={titleCase(blog.title)}
        image={blog.coverImage}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Insights", to: "/blogs" },
          { label: titleCase(blog.title) },
        ]}
      />

      <article className="container-site grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div className="min-w-0 max-w-3xl">
          <Reveal>
            <p className="font-display text-xl uppercase leading-9 text-ink sm:text-2xl">
              {blog.shortDescription}
            </p>
          </Reveal>
          {blog.overview && (
            <Reveal delay={0.1} className="mt-10 border-l-2 border-brand pl-6">
              <RichText value={blog.overview} />
            </Reveal>
          )}
          <Reveal delay={0.15} className="mt-12">
            <RichText value={blog.content} />
          </Reveal>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
          <Reveal className="rounded-md border border-ink/10 bg-white p-7">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Clock className="size-3.5" />
              {blog.readingTime} min read
            </p>
            {blog.keyTakeaways.length > 0 && (
              <>
                <h2 className="mt-6 font-display text-lg uppercase text-ink">Key takeaways</h2>
                <ul className="mt-4 space-y-3">
                  {blog.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem] leading-6 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>
          {blog.technologies.length > 0 && (
            <Reveal delay={0.1}>
              <h2 className="font-display text-lg uppercase text-ink">Technologies</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {blog.technologies.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Reveal>
          )}
          {project && (
            <Reveal delay={0.15}>
              <Link
                to={`/projects/${project.slug}`}
                className="group block rounded-md bg-ink p-7 text-white"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-white/55">Related project</span>
                <p className="display mt-3 text-lg">{titleCase(project.title)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  View case study
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          )}
        </aside>
      </article>

      {more.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="container-site">
            <SectionHeading
              eyebrow="Keep reading"
              title="More from our sites"
              action={<ButtonLink to="/blogs" tone="outline-dark">All articles</ButtonLink>}
            />
            <Stagger className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <StaggerItem key={item.id} className="h-full">
                  <BlogCard blog={item} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
