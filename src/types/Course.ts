import {Lesson, PaidLesson} from "./Lesson.ts";

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

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
}

export interface PaidCourse {
    id: string;
    course: Course;
    plan: Plan;
    lessons: PaidLesson[];
}

export interface PaidCourseListResponse {
    success: boolean;
    status_code: number;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
    };
    errors: string[];
    data: PaidCourse[];
    service_data: any;
}
