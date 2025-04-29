import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import eventService from "../../services/eventService";
import { Event } from "../../types/Event";

function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await eventService.getEvent(id);
                setEvent(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch event details:", err);
                setError("Failed to load event details. The event may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <div className="alert alert-error max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary mt-4"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p>Event not found</p>
                <Link to="/events" className="btn btn-primary mt-4">Back to Events</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link to="/events" className="btn btn-outline btn-sm">
                    ← Back to Events
                </Link>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h1 className="card-title text-3xl mb-2">{event.name}</h1>

                    {event.description && (
                        <div className="prose max-w-none mb-6">
                            <p>{event.description}</p>
                        </div>
                    )}

                    {event.website && (
                        <div className="mb-4">
                            <a 
                                href={event.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}

                    {event.contacts && (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-bold">Contact Information</h3>
                                <div className="text-sm">{event.contacts}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetail;
