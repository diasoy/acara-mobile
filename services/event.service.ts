import { api } from "@/lib/axios";
import {
  CreateEventPayload,
  DeleteEventResponse,
  EventApiResponse,
  EventDetailApiResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from "@/types/event";
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

export async function createEvent(formData: CreateEventPayload) {
  try {
    const response = await api.post("/events", formData);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal membuat acara. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function updateEvent(
  id: string,
  formData: UpdateEventPayload,
): Promise<UpdateEventResponse> {
  try {
    const response = await api.put(`/events/${id}`, formData);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal memperbarui acara. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<DeleteEventResponse> {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    ToastAndroid.show(
      "Gagal menghapus acara. Silakan coba lagi.",
      ToastAndroid.SHORT,
    );
    throw error;
  }
}
