export interface Media {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  api_key: string;
}

export interface Meta {
  status: number;
  message: string;
}

export interface UploadMediaSingleResponse {
  meta: Meta;
  data: Media;
}

export interface UploadMediaMultipleResponse {
  meta: Meta;
  data: Media[];
}

export interface RemoveMediaPayload {
  fileUrl: string;
}

export interface RemoveMediaResponse {
  meta: Meta;
  data?: unknown;
}

export interface MediaPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface MediaMultiplePayload {
  files: {
    uri: string;
    name: string;
    type: string;
  }[];
}

// Deprecated: Use UploadMediaSingleResponse instead
export interface MediaResponse {
  meta: Meta;
  data: Media;
}
