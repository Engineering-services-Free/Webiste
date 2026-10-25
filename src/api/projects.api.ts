import { apiClient } from "./apiclients";

import type {
  GetProjectResponse,
  GetProjectsParams,
  GetProjectsResponse,
  Project,
} from "../typings/projects.typings";

type RawProject = Omit<Project, "id"> & { id?: string; _id?: string };
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeProject(raw: RawProject): Project {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getProjects(
  params?: GetProjectsParams,
): Promise<GetProjectsResponse> {
  return apiClient
    .get<WithData<GetProjectsResponse, RawProject[]>>("/projects", { params })
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeProject),
    }));
}

export function getProjectById(id: string): Promise<GetProjectResponse> {
  return apiClient
    .get<WithData<GetProjectResponse, RawProject>>(`/projects/${id}`)
    .then((response) => ({
      ...response.data,
      data: normalizeProject(response.data.data),
    }));
}

export function getProjectBySlug(slug: string): Promise<GetProjectResponse> {
  return apiClient
    .get<WithData<GetProjectResponse, RawProject>>(
      `/website/projects/slug/${encodeURIComponent(slug)}`,
    )
    .then((response) => ({
      ...response.data,
      data: normalizeProject(response.data.data),
    }));
}
