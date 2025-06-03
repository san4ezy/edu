import { PaidLesson, PaidLessonListResponse } from '../types/Lesson';
import { Lesson } from '../types/Event';
import api from './api';

interface LessonParams {
    search?: string;
    limit?: number;
    offset?: number;
}

interface LessonResponse {
    success: boolean;
    status_code: number;
    pagination: any;
    errors: string[];
    data: Lesson;
    service_data: any;
}

// Simple cache to prevent duplicate requests
const lessonCache = new Map<string, Promise<PaidLesson>>();

export const lessonService = {
    list: async (params?: LessonParams): Promise<PaidLessonListResponse> => {
        try {
            const response = await api.get<PaidLessonListResponse>('/paid-lessons/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching lessons:', error);
            throw error;
        }
    },

    retrieve: async (id: string): Promise<PaidLesson> => {
        try {
            // Check if we already have a request in progress for this ID
            if (lessonCache.has(id)) {
                return await lessonCache.get(id)!;
            }

            // Create new request and cache it
            const requestPromise = api.get(`/paid-lessons/${id}/`).then(response => response.data.data);
            lessonCache.set(id, requestPromise);

            // Clean up cache after request completes (success or failure)
            requestPromise
                .finally(() => {
                    lessonCache.delete(id);
                })
                .catch(() => {
                    // Error handled by the component
                });

            return await requestPromise;
        } catch (error) {
            throw error;
        }
    },

    // Management API endpoints
    managementRetrieve: async (id: string): Promise<Lesson> => {
        try {
            const response = await api.get<LessonResponse>(`/management-lessons/${id}/`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, lessonData: Partial<Lesson> | FormData): Promise<Lesson> => {
        try {
            // Set proper headers if lessonData is FormData
            const headers = lessonData instanceof FormData 
                ? { 'Content-Type': 'multipart/form-data' } 
                : undefined;

            // Use PATCH to only update the provided fields
            const response = await api.patch<LessonResponse>(`/management-lessons/${id}/`, lessonData, { headers });
            return response.data.data;
        } catch (error) {
            console.error('Error updating lesson:', error);
            throw error;
        }
    },

    create: async (courseId: string, lessonData: Partial<Lesson> | FormData): Promise<Lesson> => {
        try {
            // Set proper headers if lessonData is FormData
            const headers = lessonData instanceof FormData 
                ? { 'Content-Type': 'multipart/form-data' } 
                : undefined;

            const response = await api.post<LessonResponse>(`/management-courses/${courseId}/lessons/`, lessonData, { headers });
            return response.data.data;
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw error;
        }
    }
};

export default lessonService;