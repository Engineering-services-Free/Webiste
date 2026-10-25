import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "./api.typings";

export type DocumentType =
  | "brochure"
  | "certificate"
  | "company-profile"
  | "presentation"
  | "other";

export type DocumentVisibility = "public" | "internal";

export interface DocumentFile {
  url: string;
  storagePath: string;
}

export interface WebsiteDocument {
  id: string;
  title: string;
  type: DocumentType;
  description?: string;
  clientId?: string;
  file: DocumentFile;
  visibility: "public";
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetDocumentsParams extends PaginationParams {
  type?: DocumentType;
  clientId?: string;
}

export type GetDocumentsResponse =
  PaginatedApiResponse<WebsiteDocument>;
export type GetDocumentResponse = ApiResponse<WebsiteDocument>;
