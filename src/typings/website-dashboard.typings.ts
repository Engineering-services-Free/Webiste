import type { ApiResponse } from "./api.typings";

export interface LandingDashboardImage {
  url: string;
  alt: string;
}

export interface WebsiteLandingBlog {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: LandingDashboardImage;
  readingTime: number;
  createdAt: string;
}

export interface WebsiteLandingProject {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  industry: string;
  year: number;
  heroImage: LandingDashboardImage;
  createdAt: string;
}

export interface WebsiteLandingService {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  heroImage: LandingDashboardImage;
  featured: boolean;
  createdAt: string;
}

export interface WebsiteLandingClient {
  id: string;
  name: string;
  industry: string;
  image: LandingDashboardImage;
}

export interface WebsiteDashboardData {
  blogs: WebsiteLandingBlog[];
  projects: WebsiteLandingProject[];
  services: WebsiteLandingService[];
  clients: WebsiteLandingClient[];
}

export interface GetWebsiteDashboardResponse
  extends ApiResponse<WebsiteDashboardData> {
  message: string;
}
