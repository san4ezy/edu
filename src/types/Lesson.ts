export interface Lesson {
    id: string;
    name: string;
    short_description: string;
    description: string | null;
    content: string;
    start_dt: string;
    end_dt: string;
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

export interface PaidLessonListResponse {
    success: boolean;
    status_code: number;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
    };
    errors: string[];
    data: PaidLesson[];
    service_data: any;
}
