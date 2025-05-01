export interface Event {
    id: string; // UUID format
    name: string;
    description: string | null;
    website: string | null;
    contacts: string | null;
    team_id: string; // UUID format
    date: string; // ISO date string
    image: string | null;
    location: string | null;
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
