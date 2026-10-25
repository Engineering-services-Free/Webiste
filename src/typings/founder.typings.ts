import type { ApiResponse } from "./api.typings";

export interface FounderImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface Founder {
  id: string;
  name: string;
  image: FounderImage;
  overview: string;
  experience: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type GetFoundersResponse = ApiResponse<Founder[]>;
export type GetFounderResponse = ApiResponse<Founder>;
