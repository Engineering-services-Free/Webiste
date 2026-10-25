import { apiClient } from "./apiclients";

import type {
  GetDocumentResponse,
  GetDocumentsParams,
  GetDocumentsResponse,
  DocumentVisibility,
  WebsiteDocument,
} from "../typings/documents.typings";

type RawDocument = Omit<WebsiteDocument, "id" | "visibility"> & {
  id?: string;
  _id?: string;
  visibility: DocumentVisibility;
};
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeDocument(raw: RawDocument): WebsiteDocument {
  if (raw.visibility !== "public") {
    throw new Error("This document is not available to the public website.");
  }

  const { _id, id, ...rest } = raw;

  return { ...rest, visibility: "public", id: id ?? _id ?? "" };
}

export function getDocuments(
  params?: GetDocumentsParams,
): Promise<GetDocumentsResponse> {
  return apiClient
    .get<WithData<GetDocumentsResponse, RawDocument[]>>("/documents", {
      params: { ...params, visibility: "public" },
    })
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeDocument),
    }));
}

export function getDocumentById(id: string): Promise<GetDocumentResponse> {
  return apiClient
    .get<WithData<GetDocumentResponse, RawDocument>>(
      `/website/documents/${id}`,
    )
    .then((response) => ({
      ...response.data,
      data: normalizeDocument(response.data.data),
    }));
}
