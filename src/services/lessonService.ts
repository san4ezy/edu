import { PaidLesson, PaidLessonListResponse } from '../types/Lesson';
import api from './api';

interface LessonParams {
    search?: string;
    limit?: number;
    offset?: number;
}

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
            const response = await api.get(`/paid-lessons/${id}/`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

};

export default lessonService;
