import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import eventService from "../../services/eventService";
import { Event } from "../../types/Event.ts";
import PlanCard from "./PlanCard.tsx";

function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await eventService.retrieve(id);
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

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        if (!event) return;

        const target = new Date(event.start_dt);
        if (isNaN(target.getTime())) {
            console.warn("Invalid start_dt:", event.start_dt);
            return;
        }

        const tick = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [event]);

    const handleBuyPlan = async (planId: string) => {
        if (!event?.id || buying) return;

        try {
            setBuying(true);
            await eventService.buy(event.id, planId);
            // Show success message
            alert('Successfully purchased the plan!');
            // Optionally redirect to user's courses or refresh the page
            navigate('/courses');
        } catch (error) {
            console.error('Failed to purchase plan:', error);
            // Show error message
            alert('Failed to purchase the plan. Please try again.');
        } finally {
            setBuying(false);
        }
    };

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
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0">
                <Link to="/events" className="btn btn-outline btn-sm">
                    ← Back to Events
                </Link>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none sm:rounded-xl overflow-hidden">
                {event.image && (
                    <figure className="w-full h-64 sm:h-96 lg:h-[32rem]">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="object-cover w-full h-full"
                        />
                    </figure>
                )}
                <div className="card-body p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        <h1 className="card-title text-2xl sm:text-3xl">{event.name}</h1>

                        {/* Event Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(event.start_dt).toLocaleDateString()}</span>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-justify">{event.description}</p>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pricing Plans
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto py-4 px-0 sm:px-4">
                                {event.plans.map((plan) => (
                                    <PlanCard key={plan.id} plan={plan} onBuy={handleBuyPlan} />
                                ))}
                            </div>
                        </div>

                        {/* Time Remaining Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Time Remaining
                            </h2>
                            <div className="grid grid-flow-col gap-2 sm:gap-3 text-center auto-cols-max justify-center">
                                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                    <span className="countdown font-mono text-3xl">
                                        <span style={{ ["--value" as unknown as number]: timeLeft.days } as React.CSSProperties} aria-live="polite">{timeLeft.days}</span>
                                    </span> days
                                </div>
                                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                    <span className="countdown font-mono text-3xl">
                                        <span style={{ ["--value" as unknown as number]: timeLeft.hours } as React.CSSProperties} aria-live="polite">{timeLeft.hours}</span>
                                    </span> hours
                                </div>
                                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                    <span className="countdown font-mono text-3xl">
                                        <span style={{ ["--value" as unknown as number]: timeLeft.minutes } as React.CSSProperties} aria-live="polite">{timeLeft.minutes}</span>
                                    </span> min
                                </div>
                                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                    <span className="countdown font-mono text-3xl">
                                        <span style={{ ["--value" as unknown as number]: timeLeft.seconds } as React.CSSProperties} aria-live="polite">{timeLeft.seconds}</span>
                                    </span> sec
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        {event.contacts && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Information
                                </h2>
                                <div className="alert alert-info shadow-lg mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <div className="text-sm">{event.contacts}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions Section */}
                        <div className="card-actions justify-end mt-6">
                            {event.website && (
                                <a
                                    href={event.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                >
                                    Visit Website
                                </a>
                            )}
                            <button className="btn btn-primary">Register Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetail;
