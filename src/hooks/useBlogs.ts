import { useQuery } from "@tanstack/react-query";

import {
  getBlogById,
  getBlogBySlug,
  getBlogs,
} from "../api/blogs.api";
import type { GetBlogsParams } from "../typings/blogs.typings";
import { PUBLIC_CONTENT_STALE_TIME, PUBLIC_LIST_STALE_TIME } from "./queryConfig";

export function useBlogs(params?: GetBlogsParams) {
  return useQuery({
    queryKey: ["blogs", params],
    queryFn: () => getBlogs(params),
    staleTime: PUBLIC_LIST_STALE_TIME,
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blogs", "id", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery({
    queryKey: ["blogs", "slug", slug],
    queryFn: () => getBlogBySlug(slug),
    enabled: Boolean(slug),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
