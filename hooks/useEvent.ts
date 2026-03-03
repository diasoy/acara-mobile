import { deleteEvent, getAllEvents, getEventById, updateEvent } from "@/services/event.service";
import {
  DeleteEventResponse,
  EventApiResponse,
  EventDetailApiResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from "@/types/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EVENTS_QUERY_KEY = ["events"] as const;
const EVENT_QUERY_KEY = (id: string) => ["event", id] as const;

type UpdateEventVariables = {
  id: string;
  payload: UpdateEventPayload;
};

export function useEvents() {
  return useQuery<EventApiResponse>({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: getAllEvents,
  });
}

export function useDetailEvent(id: string) {
  return useQuery<EventDetailApiResponse>({
    queryKey: EVENT_QUERY_KEY(id),
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
}

export const useEventById = useDetailEvent;

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<UpdateEventResponse, unknown, UpdateEventVariables>({
    mutationFn: ({ id, payload }) => updateEvent(id, payload),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      void queryClient.invalidateQueries({
        queryKey: EVENT_QUERY_KEY(variables.id),
      });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<DeleteEventResponse, unknown, string>({
    mutationFn: deleteEvent,
    onSuccess: (_response, eventId) => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.removeQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    },
  });
}
