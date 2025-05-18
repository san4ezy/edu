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
    is_paid: boolean;
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

export interface Event {
    id: string; // UUID format
    name: string;
    course: Course;
    short_description: string | null;
    description: string | null;
    website: string | null;
    contacts: string | null;
    team_id: string; // UUID format
    start_dt: string; // ISO date string
    end_dt: string; // ISO date string
    image: string | null;
    plans: Plan[];
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

export interface EventListResponse extends ApiResponse<Event[]> {}

export interface Course {
    id: string;
    name: string;
    short_description: string;
    description: string;
    image: string;
    start_dt: string;
    end_dt: string;
    lessons: Lesson[];
}

export interface Price {
    amount: number;
    currency: string;
}

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: Price;
}

export interface PlanManagement {
    id: string;
    name: string;
    description: string | null;
    price: {
        amount: number;
        currency: string;
    };
    price_amount: number;
    price_currency: string;
    lesson_ids?: string[]; // Make this optional since it can be undefined
}

export interface PaidCourse {
    id: string;
    name: string;
    short_description: string;
    description: string;
    image: string;
    start_dt: string;
    end_dt: string;
    plans: Plan[];
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

export interface BuyEventRequest {
    plan_id: string;
}

export interface BuyEventResponse {
    data: {
        plan_id: string;
    };
}
