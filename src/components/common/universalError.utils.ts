import axios from "axios";

export type UniversalErrorType = "network" | "server" | "not-found" | "unknown";

export function getUniversalErrorType(error: unknown): UniversalErrorType {
  if (!axios.isAxiosError(error)) {
    return "unknown";
  }

  const status = error.response?.status;

  if (status === undefined) {
    return "network";
  }

  if (status === 404) {
    return "not-found";
  }

  if (status >= 500) {
    return "server";
  }

  return "unknown";
}
