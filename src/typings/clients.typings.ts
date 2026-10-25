import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "./api.typings";

export interface ClientImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface Client {
  id: string;
  name: string;
  image: ClientImage;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetClientsParams extends PaginationParams {
  industry?: string;
}

export type GetClientsResponse = PaginatedApiResponse<Client>;
export type GetClientResponse = ApiResponse<Client>;
