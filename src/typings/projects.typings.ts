import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "./api.typings";

export type ProjectStatus = "draft" | "published" | "archived";

export interface ProjectImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface ProjectResult {
  metric: string;
  value: string;
  description?: string;
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  clientId: string;
  industry: string;
  location?: string;
  shortDescription: string;
  overview: string;
  heroImage: ProjectImage;
  gallery: ProjectImage[];
  challenge: string;
  solution: string;
  engineeringScope: string[];
  technologies: string[];
  results: ProjectResult[];
  duration?: string;
  year: number;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  relatedServices: string[];
  seo?: ProjectSeo;
  createdAt: string;
  updatedAt: string;
}

export interface GetProjectsParams extends PaginationParams {
  status?: ProjectStatus;
  featured?: boolean;
  industry?: string;
}

export type GetProjectsResponse = PaginatedApiResponse<Project>;
export type GetProjectResponse = ApiResponse<Project>;
