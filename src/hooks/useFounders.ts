import { useQuery } from "@tanstack/react-query";

import { getFounderById, getFounders } from "../api/founder.api";
import { PUBLIC_CONTENT_STALE_TIME } from "./queryConfig";

export function useFounders() {
  return useQuery({
    queryKey: ["founders"],
    queryFn: getFounders,
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}

export function useFounder(id: string) {
  return useQuery({
    queryKey: ["founders", "id", id],
    queryFn: () => getFounderById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
