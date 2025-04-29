import { Event, EventListResponse } from "../types/Event";
import api from "./api";

interface EventsParams {
    search?: string;
    ordering?: string;
    limit?: number;
    offset?: number;
}

export const eventService = {
    getEvents: async (params: EventsParams = {}): Promise<EventListResponse> => {
        const response = await api.get<EventListResponse>('/events/', { params });
        return response.data;
    },

    getEvent: async (id: string): Promise<Event> => {
        const response = await api.get<{ data: Event }>(`/events/${id}/`);
        return response.data.data;
    },

    createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
        const response = await api.post<{ data: Event }>('/events/', eventData);
        return response.data.data;
    }
};

export default eventService;
