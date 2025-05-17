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

    managementList: async (params?: CourseParams): Promise<PaidCourseListResponse> => {
        try {
            const response = await api.get<PaidCourseListResponse>('/management-courses/', { params });
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

    managementRetrieve: async (id: string): Promise<PaidCourse> => {
        try {
            const response = await api.get(`/management-courses/${id}/`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, courseData: Partial<PaidCourse> | FormData): Promise<PaidCourse> => {
        try {
            // Set proper headers if courseData is FormData
            const headers = courseData instanceof FormData 
                ? { 'Content-Type': 'multipart/form-data' } 
                : undefined;

            const response = await api.patch(`/management-courses/${id}/`, courseData, { headers });
            return response.data.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },
};

export default courseService;