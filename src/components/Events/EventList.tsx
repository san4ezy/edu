import React, { useEffect, useState } from "react";
import { Event } from "../../types/Event";
import EventCard from './EventCard';
import eventService from "../../services/eventService";

function EventList() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchEvents = async (searchTerm = "", pageNum = 1) => {
        try {
            setLoading(true);
            const offset = (pageNum - 1) * limit;
            const response = await eventService.list({
                search: searchTerm,
                limit,
                offset,
            });

            setEvents(response.data || []);
            setPagination({
                count: response.pagination.count || 0,
                next: response.pagination.next,
                previous: response.pagination.previous,
            });
        } catch (error) {
            // Don't show authentication errors to the user
            if (error.name === 'AuthenticationError') {
                // Authentication errors are handled silently by the API service
                return;
            }
            console.error("Failed to fetch Events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(search, page);
    }, [search, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchEvents(search, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Events</h1>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="input input-bordered flex-grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center my-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    {!events || events.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">There are no events yet.</p>
                            <p className="text-gray-500">Ask your favorite influencer to provide a link for Event you interested in.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}

                    {events && events.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    disabled={!pagination.previous}
                                    onClick={() => handlePageChange(page - 1)}
                                >«</button>
                                <button className="join-item btn">
                                    {page} of {Math.ceil(pagination.count / limit)}
                                </button>
                                <button
                                    className="join-item btn"
                                    disabled={!pagination.next}
                                    onClick={() => handlePageChange(page + 1)}
                                >»</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default EventList;
