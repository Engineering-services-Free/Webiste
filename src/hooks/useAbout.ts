import { useQuery } from "@tanstack/react-query";

import { getAbout } from "../api/about.api";
import { PUBLIC_CONTENT_STALE_TIME } from "./queryConfig";

export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
