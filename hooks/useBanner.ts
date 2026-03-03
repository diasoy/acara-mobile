import { getAllBanner } from "@/services/banner.service";
import { ListBannerParams } from "@/types/banner";
import { useQuery } from "@tanstack/react-query";

const BANNERS_QUERY_KEY = ["banners"] as const;

export function useBanners(params?: ListBannerParams) {
  return useQuery({
    queryKey: BANNERS_QUERY_KEY,
    queryFn: () => getAllBanner(params),
  });
}
