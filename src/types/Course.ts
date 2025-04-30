export interface Course {
    id: string; // UUID format
    name: string;
    description: string | null;
    team_id: string; // UUID format
}

export interface ApiResponse<T> {
    success: boolean;
    status_code: number;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
    };
    errors: string[];
    data: T;
    service_data: any | null;
}

export interface CourseListResponse extends ApiResponse<Course[]> {}
