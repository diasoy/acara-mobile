export interface Banner {
  _id: string;
  title: string;
  image: string;
  isShow: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  total: number;
  current: string | number | null;
  totalPages: number | null;
}

export interface Meta {
  status: number;
  message: string;
}

export interface BannersApiResponse {
  meta: Meta;
  data: Banner[];
  pagination: Pagination;
}

export interface BannerDetailApiResponse {
  meta: Meta;
  data: Banner;
}

export interface CreateBannerPayload {
  title: string;
  image: string;
  isShow: boolean;
}

export interface UpdateBannerPayload {
  title?: string;
  image?: string;
  isShow?: boolean;
}

export interface CreateBannerResponse {
  meta: Meta;
  data: Banner;
}

export interface UpdateBannerResponse {
  meta: Meta;
  data: Banner;
}

export interface DeleteBannerResponse {
  meta: Meta;
  data?: {
    _id: string;
    deletedAt?: string;
  };
}

export interface ListBannerParams {
  limit?: number;
  page?: number;
  search?: string;
}
