import {
    removeMedia,
    uploadMediaMultiple,
    uploadMediaSingle,
} from "@/services/media.service";
import {
  Media,
  MediaMultiplePayload,
  MediaPayload,
  RemoveMediaPayload,
  RemoveMediaResponse,
} from "@/types/media";
import { useMutation } from "@tanstack/react-query";

export function useUploadMediaSingle() {
  return useMutation<Media, Error, MediaPayload>({
    mutationFn: async (payload) => {
      const response = await uploadMediaSingle(payload);
      return response.data;
    },
  });
}

export function useUploadMediaMultiple() {
  return useMutation<Media[], Error, MediaMultiplePayload>({
    mutationFn: async (payload) => {
      const response = await uploadMediaMultiple(payload);
      return response.data;
    },
  });
}

export function useRemoveMedia() {
  return useMutation<RemoveMediaResponse, Error, RemoveMediaPayload>({
    mutationFn: removeMedia,
  });
}
