import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getServiceById,
  getServiceBySlug,
  getServices,
} from "../api/services.api";
import type { GetServicesParams } from "../typings/services.typings";
import { PUBLIC_CONTENT_STALE_TIME, PUBLIC_LIST_STALE_TIME } from "./queryConfig";

export function useServices(params?: GetServicesParams) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
    staleTime: PUBLIC_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["services", "id", id],
    queryFn: () => getServiceById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ["services", "slug", slug],
    queryFn: () => getServiceBySlug(slug),
    enabled: Boolean(slug),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
