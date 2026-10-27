import { ArrowUpRight, Clock, FileText, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import { documentTypeLabel, formatDate, titleCase, truncate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { WebsiteDocument } from "@/typings/documents.typings";

import { SmartImage } from "./motion";

interface CardImage {
  url: string;
  alt: string;
}

export interface ServiceCardData {
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: CardImage;
  tagline?: string;
}

export function ServiceCard({
  service,
  index,
}: {
  service: ServiceCardData;
  index: number;
}) {
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex h-full min-h-[30rem] flex-col justify-end overflow-hidden rounded-md bg-ink text-white"
    >
      <SmartImage
        src={service.heroImage?.url}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10 transition-opacity duration-500 group-hover:opacity-90" />
      <span className="absolute left-6 top-6 font-display text-sm text-white/70">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute right-6 top-6 grid size-12 place-items-center rounded-full border border-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-ink">
        <ArrowUpRight className="size-5" />
      </span>
      <div className="relative p-6 sm:p-8">
        {service.tagline && (
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/60">
            {service.tagline}
          </p>
        )}
        <h3 className="display text-2xl sm:text-3xl">{service.title}</h3>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-white/70 transition-colors duration-500 group-hover:text-white/90">
          {truncate(service.shortDescription, 180)}
        </p>
      </div>
    </Link>
  );
}

export interface ProjectCardData {
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: CardImage;
  industry?: string;
  location?: string;
  year?: number;
}

export function ProjectCard({
  project,
  large,
  clientName,
}: {
  project: ProjectCardData;
  large?: boolean;
  clientName?: string;
}) {
  return (
    <Link to={`/projects/${project.slug}`} className="group block">
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-ink",
          large ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <SmartImage
          src={project.heroImage?.url}
          alt={project.heroImage?.alt || project.title}
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
        <span className="absolute bottom-5 right-5 grid size-14 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
        {project.year && (
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wider text-ink backdrop-blur">
            {project.year}
          </span>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {(clientName || project.industry) && (
          <span>{clientName ?? project.industry}</span>
        )}
        {project.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {project.location}
          </span>
        )}
      </div>
      <h3
        className={cn(
          "display mt-3 text-ink transition-colors group-hover:text-brand",
          large ? "text-2xl sm:text-[2rem]" : "text-xl sm:text-2xl",
        )}
      >
        {titleCase(project.title)}
      </h3>
      <p className="mt-3 line-clamp-2 max-w-2xl leading-7 text-muted-foreground">
        {truncate(project.shortDescription, 200)}
      </p>
    </Link>
  );
}

export interface BlogCardData {
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: CardImage;
  readingTime: number;
  createdAt: string;
  publishedAt?: string;
}

export function BlogCard({ blog }: { blog: BlogCardData }) {
  return (
    <Link
      to={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(13,15,18,0.35)]"
    >
      <div className="aspect-[16/10] overflow-hidden bg-ink">
        <SmartImage
          src={blog.coverImage?.url}
          alt={blog.coverImage?.alt || blog.title}
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <span>{formatDate(blog.publishedAt ?? blog.createdAt)}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {blog.readingTime} min read
          </span>
        </div>
        <h3 className="display mt-4 text-xl text-ink transition-colors group-hover:text-brand sm:text-2xl">
          {titleCase(blog.title)}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 leading-7 text-muted-foreground">
          {truncate(blog.shortDescription, 220)}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ClientLogo({
  client,
  className,
}: {
  client: { name: string; industry?: string; image: CardImage };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        className,
      )}
    >
      <div className="grid h-20 w-40 place-items-center">
        <SmartImage
          src={client.image?.url}
          alt={client.image?.alt || client.name}
          className="max-h-20 max-w-40 object-contain grayscale transition duration-500 group-hover:grayscale-0 hover:grayscale-0"
        />
      </div>
    </div>
  );
}

export function DocumentCard({ document }: { document: WebsiteDocument }) {
  return (
    <Link
      to={`/documents/${document.id}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-ink/10 bg-white p-8 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-white"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-full bg-brand/10 text-brand transition-colors duration-500 group-hover:bg-white/10 group-hover:text-white">
          <FileText className="size-6" />
        </span>
        <span className="rounded-full border border-current/20 px-3 py-1 text-xs uppercase tracking-[0.14em] opacity-70">
          {documentTypeLabel(document.type)}
        </span>
      </div>
      <div className="mt-16">
        <h3 className="display text-2xl">{document.title}</h3>
        {document.description && (
          <p className="mt-3 line-clamp-3 leading-7 opacity-70">{document.description}</p>
        )}
        <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          View document
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
