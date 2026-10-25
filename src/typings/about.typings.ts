import type { ApiResponse } from "./api.typings";

export interface AboutImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface About {
  id: string;
  heroImage: AboutImage;
  overview: string;
  aboutUs: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GetAboutResponse = ApiResponse<About | null>;
