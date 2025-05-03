import { PaidCourse, UserCourseListResponse } from '../types/Course';
import api from './api';

interface CourseParams {
    search?: string;
    limit?: number;
    offset?: number;
}

export const courseService = {
    getCourses: async (params?: CourseParams): Promise<UserCourseListResponse> => {
        try {
            const response = await api.get<UserCourseListResponse>('/user-courses/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    getCourse: async (id: string): Promise<PaidCourse> => {
        try {
            const response = await api.get(`/user-courses/${id}/`);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    },

};

export default courseService;
