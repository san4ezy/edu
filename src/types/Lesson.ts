// Base lesson interface
export interface Lesson {
    id: string;
    name: string;
    short_description?: string;
    description?: string;
    content?: string;
    start_dt: string;
    end_dt: string;
    files?: any[];
    external_files?: ExternalFile[];
}

// External file interface for videos, documents, etc.
export interface ExternalFile {
    name: string;
    folder: string;
    type: 'YOUTUBE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO';
    url: string;
}

// Paid lesson interface - represents a lesson purchased by the user
export interface PaidLesson {
    id: string;
    lesson: Lesson;
    status: 'NEW' | 'VIEWED' | 'PASSED';
}

// Response interface for paginated lesson lists
export interface PaidLessonListResponse {
    success: boolean;
    status_code: number;
    pagination: any;
    errors: string[];
    data: PaidLesson[];
    service_data: any;
}

// Lesson management interface - used for CRUD operations by managers
export interface LessonManagement extends Lesson {
    course_id?: string;
}
