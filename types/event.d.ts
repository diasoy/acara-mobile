export interface Location {
  region: number;
  coordinates: [number, number];
  address: string;
  _id: string;
}

export interface Event {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  banner: string;
  category: string;
  isFeatured: boolean;
  isOnline: boolean;
  isPublish: boolean;
  description: string;
  createdBy: string;
  slug: string;
  location: Location;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
