import { Event, UpdateEventPayload } from "@/types/event";

export function buildEventUpdatePayload(
  event: Event,
  overrides: UpdateEventPayload = {},
): UpdateEventPayload {
  const payload: UpdateEventPayload = {
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    description: event.description,
    banner: event.banner,
    isFeatured: event.isFeatured,
    isOnline: event.isOnline,
    isPublish: event.isPublish,
    category: event.category,
  };

  if (event.location) {
    payload.location = {
      region: event.location.region,
      coordinates: [
        event.location.coordinates[0],
        event.location.coordinates[1],
      ],
      address: event.location.address,
      _id: event.location._id,
    };
  }

  return {
    ...payload,
    ...overrides,
  };
}
