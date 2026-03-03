import { getAllEvents, getEventById } from "@/services/event.service";
import { EventApiResponse, EventDetailApiResponse } from "@/types/event";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  return useQuery<EventApiResponse>({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });
}

export function useEventById(id: string) {
  return useQuery<EventDetailApiResponse>({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
}
