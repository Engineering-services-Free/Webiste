import { apiClient } from "./apiclients";

import type {
  Client,
  GetClientResponse,
  GetClientsParams,
  GetClientsResponse,
} from "../typings/clients.typings";

type RawClient = Omit<Client, "id"> & { id?: string; _id?: string };
type WithData<Response, Data> = Omit<Response, "data"> & { data: Data };

function normalizeClient(raw: RawClient): Client {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getClients(
  params?: GetClientsParams,
): Promise<GetClientsResponse> {
  return apiClient
    .get<WithData<GetClientsResponse, RawClient[]>>("/clients", { params })
    .then((response) => ({
      ...response.data,
      data: response.data.data.map(normalizeClient),
    }));
}

export function getClientById(id: string): Promise<GetClientResponse> {
  return apiClient
    .get<WithData<GetClientResponse, RawClient>>(`/clients/${id}`)
    .then((response) => ({
      ...response.data,
      data: normalizeClient(response.data.data),
    }));
}
