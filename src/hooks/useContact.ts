import { useQuery } from "@tanstack/react-query";

import { getContact } from "../api/contact.api";
import { PUBLIC_CONTENT_STALE_TIME } from "./queryConfig";

export function useContact() {
  return useQuery({
    queryKey: ["contact"],
    queryFn: getContact,
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
