import { apiClient } from "./apiclients";

import type { About, GetAboutResponse } from "../typings/about.typings";

type RawAbout = Omit<About, "id"> & { id?: string; _id?: string };
type RawGetAboutResponse = Omit<GetAboutResponse, "data"> & {
  data: RawAbout | null;
};

function normalizeAbout(raw: RawAbout): About {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getAbout(): Promise<GetAboutResponse> {
  return apiClient
    .get<RawGetAboutResponse>("/about")
    .then((response) => ({
      ...response.data,
      data: response.data.data
        ? normalizeAbout(response.data.data)
        : null,
    }));
}
