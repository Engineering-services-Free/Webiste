import { apiClient } from "./apiclients";

import type {
  GetServiceResponse,
  GetServicesParams,
  GetServicesResponse,
  Service,
} from "../typings/services.typings";

type RawService = Omit<Service, "id"> & { id?: string; _id?: string };
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeService(raw: RawService): Service {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getServices(
  params?: GetServicesParams,
): Promise<GetServicesResponse> {
  return apiClient
    .get<WithData<GetServicesResponse, RawService[]>>("/services", { params })
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeService),
    }));
}

export function getServiceById(id: string): Promise<GetServiceResponse> {
  return apiClient
    .get<WithData<GetServiceResponse, RawService>>(`/services/${id}`)
    .then((response) => ({
      ...response.data,
      data: normalizeService(response.data.data),
    }));
}

export function getServiceBySlug(slug: string): Promise<GetServiceResponse> {
  return apiClient
    .get<WithData<GetServiceResponse, RawService>>(
      `/website/services/slug/${encodeURIComponent(slug)}`,
    )
    .then((response) => ({
      ...response.data,
      data: normalizeService(response.data.data),
    }));
}
