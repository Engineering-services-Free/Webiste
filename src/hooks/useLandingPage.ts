import { useQuery } from "@tanstack/react-query";

import { getLandingPage } from "../api/landing-page.api";
import { PUBLIC_CONTENT_STALE_TIME } from "./queryConfig";

export function useLandingPage() {
  return useQuery({
    queryKey: ["landing-page"],
    queryFn: getLandingPage,
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
