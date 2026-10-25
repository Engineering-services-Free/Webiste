import { apiClient } from "./apiclients";

import type { Contact, GetContactResponse } from "../typings/contact.typings";

type RawContact = Omit<Contact, "id"> & { id?: string; _id?: string };
type RawGetContactResponse = Omit<GetContactResponse, "data"> & {
  data: RawContact | null;
};

function normalizeContact(raw: RawContact): Contact {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getContact(): Promise<GetContactResponse> {
  return apiClient
    .get<RawGetContactResponse>("/contact")
    .then((response) => ({
      ...response.data,
      data: response.data.data
        ? normalizeContact(response.data.data)
        : null,
    }));
}
