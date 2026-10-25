import type { ApiResponse } from "./api.typings";

export interface LandingHero {
  title: string;
  description?: string;
}

export interface LandingPage {
  id: string;
  hero: LandingHero;
  whatWeDo: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GetLandingPageResponse = ApiResponse<LandingPage | null>;
