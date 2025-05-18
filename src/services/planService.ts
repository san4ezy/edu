import { Plan, PlanManagement } from '../types/Event';
import api from './api';

interface PlanParams {
    search?: string;
    limit?: number;
    offset?: number;
}

interface PlanResponse {
    success: boolean;
    status_code: number;
    pagination: any;
    errors: string[];
    data: PlanManagement;
    service_data: any;
}

interface PlanListResponse {
    success: boolean;
    status_code: number;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
    };
    errors: string[];
    data: PlanManagement[];
    service_data: any;
}

export const planService = {
    // Get all plans for a course
    list: async (courseId: string, params?: PlanParams): Promise<PlanListResponse> => {
        try {
            const response = await api.get<PlanListResponse>(`/management-courses/${courseId}/plans/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching plans:', error);
            throw error;
        }
    },

    // Get a specific plan
    retrieve: async (courseId: string, planId: string): Promise<PlanManagement> => {
        try {
            const response = await api.get<PlanResponse>(`/management-courses/${courseId}/plans/${planId}/`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching plan:', error);
            throw error;
        }
    },

    // Create a new plan
    create: async (courseId: string, planData: Partial<PlanManagement>): Promise<PlanManagement> => {
        try {
            const response = await api.post<PlanResponse>(`/management-courses/${courseId}/plans/`, planData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating plan:', error);
            throw error;
        }
    },

    // Update an existing plan
    update: async (courseId: string, planId: string, planData: Partial<PlanManagement>): Promise<PlanManagement> => {
        try {
            const response = await api.patch<PlanResponse>(`/management-courses/${courseId}/plans/${planId}/`, planData);
            return response.data.data;
        } catch (error) {
            console.error('Error updating plan:', error);
            throw error;
        }
    },

    // Delete a plan
    delete: async (courseId: string, planId: string): Promise<void> => {
        try {
            await api.delete(`/management-courses/${courseId}/plans/${planId}/`);
        } catch (error) {
            console.error('Error deleting plan:', error);
            throw error;
        }
    }
};

export default planService;
