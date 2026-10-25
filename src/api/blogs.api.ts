import { apiClient } from "./apiclients";

import type {
  Blog,
  GetBlogResponse,
  GetBlogsParams,
  GetBlogsResponse,
} from "../typings/blogs.typings";

type RawBlog = Omit<Blog, "id"> & { id?: string; _id?: string };
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeBlog(raw: RawBlog): Blog {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getBlogs(params?: GetBlogsParams): Promise<GetBlogsResponse> {
  return apiClient
    .get<WithData<GetBlogsResponse, RawBlog[]>>("/blogs", { params })
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeBlog),
    }));
}

export function getBlogById(id: string): Promise<GetBlogResponse> {
  return apiClient
    .get<WithData<GetBlogResponse, RawBlog>>(`/blogs/${id}`)
    .then((response) => ({
      ...response.data,
      data: normalizeBlog(response.data.data),
    }));
}

export function getBlogBySlug(slug: string): Promise<GetBlogResponse> {
  return apiClient
    .get<WithData<GetBlogResponse, RawBlog>>(
      `/website/blogs/slug/${encodeURIComponent(slug)}`,
    )
    .then((response) => ({
      ...response.data,
      data: normalizeBlog(response.data.data),
    }));
}
