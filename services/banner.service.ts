import { api } from "@/lib/axios";
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
import { ToastAndroid } from "react-native";

export async function getAllBanner(
  params?: ListBannerParams,
): Promise<BannersApiResponse> {
  try {
    const response = await api.get("/banners", { params });
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memuat banner. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function getBannerById(
  id: string,
): Promise<BannerDetailApiResponse> {
  try {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memuat detail banner. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function createBanner(
  formData: CreateBannerPayload,
): Promise<CreateBannerResponse> {
  try {
    const response = await api.post("/banners", formData);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal membuat banner. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function updateBanner(
  id: string,
  formData: UpdateBannerPayload,
): Promise<UpdateBannerResponse> {
  try {
    const response = await api.put(`/banners/${id}`, formData);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memperbarui banner. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function deleteBanner(id: string): Promise<DeleteBannerResponse> {
  try {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal menghapus banner. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

// export async function getEventById(
//   id: string,
// ): Promise<EventDetailApiResponse> {
//   try {
//     const response = await api.get(`/events/${id}`);
//     return response.data;
//   } catch (error) {
//     ToastAndroid.show(
//       "Gagal memuat detail acara. Silakan coba lagi.",
//       ToastAndroid.SHORT,
//     );
//     throw error;
//   }
// }

// export async function createEvent(formData: CreateEventPayload) {
//   try {
//     const response = await api.post("/events", formData);
//     return response.data;
//   } catch (error) {
//     ToastAndroid.show(
//       "Gagal membuat acara. Silakan coba lagi.",
//       ToastAndroid.SHORT,
//     );
//     throw error;
//   }
// }

// export async function updateEvent(
//   id: string,
//   formData: UpdateEventPayload,
// ): Promise<UpdateEventResponse> {
//   try {
//     const response = await api.put(`/events/${id}`, formData);
//     return response.data;
//   } catch (error) {
//     ToastAndroid.show(
//       "Gagal memperbarui acara. Silakan coba lagi.",
//       ToastAndroid.SHORT,
//     );
//     throw error;
//   }
// }

// export async function deleteEvent(id: string): Promise<DeleteEventResponse> {
//   try {
//     const response = await api.delete(`/events/${id}`);
//     return response.data;
//   } catch (error) {
//     ToastAndroid.show(
//       "Gagal menghapus acara. Silakan coba lagi.",
//       ToastAndroid.SHORT,
//     );
//     throw error;
//   }
// }
