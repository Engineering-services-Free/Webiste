import { useQuery } from "@tanstack/react-query";

import { getWebsiteDashboard } from "../api/website-dashboard.api";

export function useWebsiteDashboard() {
  return useQuery({
    queryKey: ["website-dashboard"],
    queryFn: getWebsiteDashboard,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
