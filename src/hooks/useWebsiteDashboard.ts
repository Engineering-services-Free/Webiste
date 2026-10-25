import { useQuery } from "@tanstack/react-query";

import { getWebsiteDashboard } from "../api/website-dashboard.api";
import { PUBLIC_CONTENT_STALE_TIME } from "./queryConfig";

export function useWebsiteDashboard() {
  return useQuery({
    queryKey: ["website-dashboard"],
    queryFn: getWebsiteDashboard,
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
