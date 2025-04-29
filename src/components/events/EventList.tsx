import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Event } from "../../types/Event";
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
            const response = await eventService.getEvents({
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
            console.error("Failed to fetch events:", error);
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
                            <p className="text-gray-500">No events found</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <div key={event.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">{event.name}</h2>
                                        {event.description && (
                                            <p className="line-clamp-3">{event.description}</p>
                                        )}
                                        {event.website && (
                                            <a 
                                                href={event.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="link link-primary"
                                            >
                                                Visit Website
                                            </a>
                                        )}
                                        {event.contacts && (
                                            <p className="text-sm text-gray-500">
                                                Contact: {event.contacts}
                                            </p>
                                        )}
                                        <div className="card-actions justify-end mt-4">
                                            <Link to={`/events/${event.id}`} className="btn btn-primary">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {events && events.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                className="btn btn-sm"
                                disabled={!pagination.previous}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>
                            <span className="self-center px-2">
                                Page {page} of {Math.ceil(pagination.count / limit)}
                            </span>
                            <button
                                className="btn btn-sm"
                                disabled={!pagination.next}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default EventList;
