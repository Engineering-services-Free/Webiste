import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getDocumentById,
  getDocuments,
} from "../api/documents.api";
import type { GetDocumentsParams } from "../typings/documents.typings";
import { PUBLIC_CONTENT_STALE_TIME, PUBLIC_LIST_STALE_TIME } from "./queryConfig";

export function useDocuments(params?: GetDocumentsParams) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => getDocuments(params),
    staleTime: PUBLIC_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["documents", "id", id],
    queryFn: () => getDocumentById(id),
    enabled: Boolean(id),
    staleTime: PUBLIC_CONTENT_STALE_TIME,
  });
}
