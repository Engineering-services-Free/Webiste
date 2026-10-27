import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getClientById, getClients } from "../api/clients.api";
import type { GetClientsParams } from "../typings/clients.typings";
import { PUBLIC_CONTENT_STALE_TIME, PUBLIC_LIST_STALE_TIME } from "./queryConfig";

export function useClients(params?: GetClientsParams) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
    staleTime: PUBLIC_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", "id", id],
    queryFn: () => getClientById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
