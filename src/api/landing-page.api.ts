import { apiClient } from "./apiclients";

import type {
  GetLandingPageResponse,
  LandingPage,
} from "../typings/landing-page.typings";

type RawLandingPage = Omit<LandingPage, "id"> & {
  id?: string;
  _id?: string;
};
type RawGetLandingPageResponse = Omit<GetLandingPageResponse, "data"> & {
  data: RawLandingPage | null;
};

function normalizeLandingPage(raw: RawLandingPage): LandingPage {
  const { _id, id, ...rest } = raw;

  return { ...rest, id: id ?? _id ?? "" };
}

export function getLandingPage(): Promise<GetLandingPageResponse> {
  return apiClient
    .get<RawGetLandingPageResponse>("/landing-page")
    .then((response) => ({
      ...response.data,
      data: response.data.data
        ? normalizeLandingPage(response.data.data)
        : null,
    }));
}
