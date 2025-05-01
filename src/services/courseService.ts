import { Course, CourseListResponse } from '../types/Course';
import api from './api';

interface CourseParams {
    search?: string;
    limit?: number;
    offset?: number;
}

export const courseService = {
    getCourses: async (params?: CourseParams): Promise<CourseListResponse> => {
        try {
            const response = await api.get<CourseListResponse>('/courses/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    getCourse: async (id: string): Promise<Course> => {
        const response = await api.get<{ data: Course }>(`/courses/${id}/`);
        return response.data.data;
    },

    createCourse: async (courseData: Omit<Course, 'id'>): Promise<Course> => {
        const response = await api.post<{ data: Course }>('/courses/', courseData);
        return response.data.data;
    }
};

export default courseService;
