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

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
}

export enum PaidLessonStatus {
    NEW = 'NEW',
    VIEWED = 'VIEWED',
    PASSED = 'PASSED'
}

export interface PaidLesson {
    id: string;
    lesson: Lesson;
    status: PaidLessonStatus;
}

export interface PaidCourse {
    id: string;
    course: Course;
    plan: Plan;
    lessons: PaidLesson[];
}

export interface UserCourseListResponse {
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
