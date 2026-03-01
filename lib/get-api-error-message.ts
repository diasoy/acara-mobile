import { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  meta?: {
    message?: string;
  };
};

export function getApiErrorMessage(error: unknown, fallback = "Terjadi kesalahan."): string {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (payload?.meta?.message) {
      return payload.meta.message;
    }
    if (payload?.message) {
      return payload.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
