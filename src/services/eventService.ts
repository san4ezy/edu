import {BuyEventResponse, Event, EventListResponse} from "../types/Event";
import api from "./api";

interface EventsParams {
    search?: string;
    ordering?: string;
    limit?: number;
    offset?: number;
}

interface EventResponse {
    success: boolean;
    status_code: number;
    pagination: any;
    errors: string[];
    data: Event;
    service_data: any;
}

export const eventService = {
    list: async (params: EventsParams = {}): Promise<EventListResponse> => {
        const response = await api.get<EventListResponse>('/events/', { params });
        return response.data;
    },

    retrieve: async (id: string): Promise<Event> => {
        const response = await api.get<{ data: Event }>(`/events/${id}/`);
        return response.data.data;
    },

    create: async (eventData: FormData | Omit<Event, 'id'>): Promise<Event> => {
        const headers = eventData instanceof FormData 
            ? { 'Content-Type': 'multipart/form-data' } 
            : undefined;
            
        const response = await api.post<{ data: Event }>('/events/', eventData, { headers });
        return response.data.data;
    },

    buy: async (eventId: string, planId: string): Promise<BuyEventResponse> => {
        const response = await api.post<BuyEventResponse>(`/events/${eventId}/buy/`, {
            plan_id: planId
        });
        return response.data;
    },

    // // Management API endpoints
    // managementList: async (params: EventsParams = {}): Promise<EventListResponse> => {
    //     const response = await api.get<EventListResponse>('/management-events/', { params });
    //     return response.data;
    // },
    //
    // managementRetrieve: async (id: string): Promise<Event> => {
    //     const response = await api.get<EventResponse>(`/management-events/${id}/`);
    //     return response.data.data;
    // },

    update: async (id: string, eventData: FormData | Partial<Event>): Promise<Event> => {
        const headers = eventData instanceof FormData 
            ? { 'Content-Type': 'multipart/form-data' } 
            : undefined;
            
        const response = await api.patch<EventResponse>(`/events/${id}/`, eventData, { headers });
        return response.data.data;
    }
};

export default eventService;