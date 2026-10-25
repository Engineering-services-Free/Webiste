import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "./api.typings";

export type BlogStatus = "draft" | "published" | "archived";

export interface BlogImage {
  url: string;
  alt: string;
  storagePath?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  coverImage: BlogImage;
  content: string;
  projectId: string;
  technologies: string[];
  keyTakeaways: string[];
  readingTime: number;
  status: BlogStatus;
  featured: boolean;
  order: number;
  publishedAt?: string;
  seo?: BlogSeo;
  createdAt: string;
  updatedAt: string;
}

export interface GetBlogsParams extends PaginationParams {
  status?: BlogStatus;
  featured?: boolean;
  projectId?: string;
}

export type GetBlogsResponse = PaginatedApiResponse<Blog>;
export type GetBlogResponse = ApiResponse<Blog>;
