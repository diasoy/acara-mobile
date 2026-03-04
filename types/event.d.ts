export interface Location {
  region: number;
  coordinates: [number, number];
  address: string;
  _id: string;
}

export interface Pagination {
  current: number;
  total: number;
  totalPages: number;
}

export interface Meta {
  status: number;
  message: string;
}

export interface EventApiResponse {
  meta: Meta;
  data: Event[];
  pagination: Pagination;
}

export interface EventDetailApiResponse {
  meta: Meta;
  data: Event;
}

export interface EventLocation {
  region: number;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  _id?: string;
}

export interface CreateEventPayload {
  name: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  description: string;
  banner?: string;
  isFeatured: boolean;
  isOnline: boolean;
  isPublish: boolean;
  category: string; // Category ID
  location?: EventLocation;
}

export interface UpdateEventPayload {
  name?: string;
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  description?: string;
  banner?: string;
  isFeatured?: boolean;
  isOnline?: boolean;
  isPublish?: boolean;
  category?: string; // Category ID
  location?: EventLocation;
}

export interface Event {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  banner?: string;
  category: string;
  isFeatured: boolean;
  isOnline: boolean;
  isPublish: boolean;
  description: string;
  createdBy: string;
  slug: string;
  location?: EventLocation;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateEventResponse {
  meta: {
    status: number;
    message: string;
  };
  data: Event;
}

export interface EventsResponse {
  meta: {
    status: number;
    message: string;
  };
  data: Event[];
}

export interface EventByIdResponse {
  meta: {
    status: number;
    message: string;
  };
  data: Event;
}

export interface UpdateEventResponse {
  meta: {
    status: number;
    message: string;
  };
  data: Event;
}

// Optional: Delete Event Response
export interface DeleteEventResponse {
  meta: {
    status: number;
    message: string;
  };
  data?: {
    _id: string;
    deletedAt?: string;
  };
}
