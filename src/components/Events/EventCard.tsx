import React from "react";
import { Event } from "../../types/Event";
import { Link } from "react-router-dom";

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div key={event.id} className="card w-full bg-base-100 shadow-xl">
            <figure className="relative h-48">
                {event.image ? (
                    <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{event.name}</h2>
                {event.short_description && (
                    <p className="text-gray-600 text-justify line-clamp-3">{event.short_description}</p>
                )}
                <div className="card-actions justify-end mt-4">
                    <Link to={`/events/${event.id}`} className="btn btn-accent">
                        Dive in
                    </Link>
                    <Link to={`/events/${event.id}`} className="btn btn-primary">
                        I wish it
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;