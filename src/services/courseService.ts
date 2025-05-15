import api from './api';
import {PaidCourse, PaidCourseListResponse} from "../types/Event.ts";

interface CourseParams {
    search?: string;
    limit?: number;
    offset?: number;
}

export const courseService = {
    list: async (params?: CourseParams): Promise<PaidCourseListResponse> => {
        try {
            const response = await api.get<PaidCourseListResponse>('/paid-courses/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    retrieve: async (id: string): Promise<PaidCourse> => {
        try {
            const response = await api.get(`/paid-courses/${id}/`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

};

export default courseService;
