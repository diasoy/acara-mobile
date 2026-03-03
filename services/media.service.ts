import { api } from "@/lib/axios";
import { getAccessToken } from "@/lib/auth-token";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import {
  MediaMultiplePayload,
  MediaPayload,
  RemoveMediaPayload,
  RemoveMediaResponse,
  UploadMediaMultipleResponse,
  UploadMediaSingleResponse,
} from "@/types/media";
import { AxiosError } from "axios";
import { ToastAndroid } from "react-native";

function extractApiMessage(payload: unknown) {
  if (payload && typeof payload === "object") {
    const candidate = payload as {
      message?: string;
      meta?: { message?: string };
    };

    if (candidate.meta?.message) {
      return candidate.meta.message;
    }

    if (candidate.message) {
      return candidate.message;
    }
  }

  return null;
}

function getAbsoluteApiUrl(path: string) {
  const baseUrl = api.defaults.baseURL ?? "";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function postMultipartWithFetchFallback<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  try {
    const response = await api.post(path, formData);
    return response.data as T;
  } catch (error) {
    const isNetworkError = (error as AxiosError)?.message === "Network Error";

    if (!isNetworkError) {
      throw error;
    }

    const token = await getAccessToken();
    const response = await fetch(getAbsoluteApiUrl(path), {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const responseText = await response.text();
    let parsedBody: unknown = null;

    if (responseText) {
      try {
        parsedBody = JSON.parse(responseText);
      } catch {
        parsedBody = null;
      }
    }

    if (!response.ok) {
      const apiMessage = extractApiMessage(parsedBody);
      throw new Error(
        apiMessage ?? `Gagal upload media. HTTP ${response.status}.`,
      );
    }

    return parsedBody as T;
  }
}

function appendSingleFile(
  formData: FormData,
  fieldName: "file" | "files",
  file: MediaPayload["file"],
) {
  formData.append(fieldName, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);
}

export async function uploadMediaSingle(
  payload: MediaPayload,
): Promise<UploadMediaSingleResponse> {
  try {
    const singleFieldFormData = new FormData();
    appendSingleFile(singleFieldFormData, "file", payload.file);

    return await postMultipartWithFetchFallback<UploadMediaSingleResponse>(
      "/media/upload-single",
      singleFieldFormData,
    );
  } catch (error) {
    const status = (error as AxiosError)?.response?.status ?? null;

    // Fallback for backends that still parse single file under "files".
    if (status === 400 || status === 404 || status === 422 || status === null) {
      try {
        const legacyFieldFormData = new FormData();
        appendSingleFile(legacyFieldFormData, "files", payload.file);

        return await postMultipartWithFetchFallback<UploadMediaSingleResponse>(
          "/media/upload-single",
          legacyFieldFormData,
        );
      } catch (legacyError) {
        ToastAndroid.show(
          getApiErrorMessage(
            legacyError,
            "Gagal upload media. Silakan coba lagi.",
          ),
          ToastAndroid.SHORT,
        );
        throw legacyError;
      }
    }

    ToastAndroid.show(
      getApiErrorMessage(error, "Gagal upload media. Silakan coba lagi."),
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function uploadMediaMultiple(
  payload: MediaMultiplePayload,
): Promise<UploadMediaMultipleResponse> {
  try {
    const formData = new FormData();

    payload.files.forEach((file) => {
      formData.append("files", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    return await postMultipartWithFetchFallback<UploadMediaMultipleResponse>(
      "/media/upload-multiple",
      formData,
    );
  } catch (error) {
    ToastAndroid.show(
      getApiErrorMessage(error, "Gagal upload media. Silakan coba lagi."),
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function removeMedia(
  payload: RemoveMediaPayload,
): Promise<RemoveMediaResponse> {
  try {
    const response = await api.delete("/media/remove", {
      data: payload,
    });

    return response.data;
  } catch (error) {
    ToastAndroid.show(
      getApiErrorMessage(error, "Gagal menghapus media lama."),
      ToastAndroid.SHORT,
    );
    throw error;
  }
}
