import {
  createBanner,
  deleteBanner,
  getAllBanner,
  getBannerById,
  updateBanner,
} from "@/services/banner.service";
import {
  BannerDetailApiResponse,
  BannersApiResponse,
  CreateBannerPayload,
  CreateBannerResponse,
  DeleteBannerResponse,
  ListBannerParams,
  UpdateBannerPayload,
  UpdateBannerResponse,
} from "@/types/banner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BANNERS_QUERY_KEY = ["banners"] as const;
const BANNER_DETAIL_QUERY_KEY = (id: string) => ["banner", id] as const;

type UpdateBannerVariables = {
  id: string;
  payload: UpdateBannerPayload;
};

export function useBanners(params?: ListBannerParams) {
  return useQuery<BannersApiResponse>({
    queryKey: BANNERS_QUERY_KEY,
    queryFn: () => getAllBanner(params),
  });
}

export function useBannerById(id: string) {
  return useQuery<BannerDetailApiResponse>({
    queryKey: BANNER_DETAIL_QUERY_KEY(id),
    queryFn: () => getBannerById(id),
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation<CreateBannerResponse, unknown, CreateBannerPayload>({
    mutationFn: createBanner,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation<UpdateBannerResponse, unknown, UpdateBannerVariables>({
    mutationFn: ({ id, payload }) => updateBanner(id, payload),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
      void queryClient.invalidateQueries({
        queryKey: BANNER_DETAIL_QUERY_KEY(variables.id),
      });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation<DeleteBannerResponse, unknown, string>({
    mutationFn: deleteBanner,
    onSuccess: (_response, id) => {
      void queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: BANNER_DETAIL_QUERY_KEY(id) });
    },
  });
}
