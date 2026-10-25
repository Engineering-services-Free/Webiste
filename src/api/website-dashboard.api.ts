import { apiClient } from "./apiclients";

import type {
  GetWebsiteDashboardResponse,
} from "../typings/website-dashboard.typings";

export function getWebsiteDashboard(): Promise<GetWebsiteDashboardResponse> {
  return apiClient
    .get<GetWebsiteDashboardResponse>("/website/dashboard")
    .then((response) => response.data);
}
