import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getProjectById,
  getProjectBySlug,
  getProjects,
} from "../api/projects.api";
import type { GetProjectsParams } from "../typings/projects.typings";
import { PUBLIC_CONTENT_STALE_TIME, PUBLIC_LIST_STALE_TIME } from "./queryConfig";

export function useProjects(params?: GetProjectsParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
    staleTime: PUBLIC_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", "id", id],
    queryFn: () => getProjectById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
