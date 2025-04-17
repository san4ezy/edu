import { apiClient } from './config';
import { ApiResponse } from './config';

export interface Event {
  id: string;
  name: string;
  description?: string;
  website?: string;
  contacts?: string;
  team_id: string;
}

export interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  data: Event[];
}

export const eventsService = {
  async getEvents(params?: {
    search?: string;
    ordering?: string;
    limit?: number;
    offset?: number;
  }): Promise<EventsResponse> {
    const response = await apiClient.get<ApiResponse<Event[]>>('/events/events/', { params });
    const pagination = response.data.pagination as unknown as Pagination;
    return {
      count: pagination?.count || 0,
      next: pagination?.next || null,
      previous: pagination?.previous || null,
      data: response.data.data
    };
  },

  async getEvent(id: string): Promise<Event> {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/events/${id}/`);
    return response.data.data;
  },

  async createEvent(data: Omit<Event, 'id'>): Promise<Event> {
    const response = await apiClient.post<ApiResponse<Event>>('/events/events/', data);
    return response.data.data;
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const response = await apiClient.put<ApiResponse<Event>>(`/events/events/${id}/`, data);
    return response.data.data;
  },

  async patchEvent(id: string, data: Partial<Event>): Promise<Event> {
    const response = await apiClient.patch<ApiResponse<Event>>(`/events/events/${id}/`, data);
    return response.data.data;
  },
}; 
