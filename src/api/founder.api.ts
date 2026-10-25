import { apiClient } from "./apiclients";

import type {
  Founder,
  GetFounderResponse,
  GetFoundersResponse,
} from "../typings/founder.typings";

type RawFounder = Omit<Founder, "id"> & { id?: string; _id?: string };
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeFounder(raw: RawFounder): Founder {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getFounders(): Promise<GetFoundersResponse> {
  return apiClient
    .get<WithData<GetFoundersResponse, RawFounder[]>>("/founder")
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeFounder),
    }));
}

export function getFounderById(id: string): Promise<GetFounderResponse> {
  return apiClient
    .get<WithData<GetFounderResponse, RawFounder>>(`/founder/${id}`)
    .then((response) => ({
      ...response.data,
      data: normalizeFounder(response.data.data),
    }));
}
