import { api } from "@/lib/axios";
import { EventApiResponse, EventDetailApiResponse } from "@/types/event";
import { ToastAndroid } from "react-native";

export async function getAllEvents(): Promise<EventApiResponse> {
  try {
    const response = await api.get("/events");
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memuat acara. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function getEventById(
  id: string,
): Promise<EventDetailApiResponse> {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memuat detail acara. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}
