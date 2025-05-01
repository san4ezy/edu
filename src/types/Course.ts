export interface Lesson {
    id: string;
    name: string;
    short_description: string;
    description: string | null;
    start_dt: string;
    end_dt: string;
}

export interface Course {
    id: string;
    event: string;
    name: string;
    short_description: string;
    description: string;
    image: string;
    start_dt: string;
    end_dt: string;
    lessons: Lesson[];
}

export interface CourseListResponse {
    success: boolean;
    status_code: number;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
    };
    errors: string[];
    data: Course[];
    service_data: any;
}
