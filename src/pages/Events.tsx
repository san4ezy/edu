import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsService, Event } from '../services/api/events';

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getEvents({ search: searchTerm });
      setEvents(response?.data || []);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="text-2xl font-bold">Events</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="search-input"
          />
          <button
            type="submit"
            className="search-button"
          >
            Search
          </button>
        </form>
      </div>

      {!events || events.length === 0 ? (
        <div className="no-events-container">
          <div className="no-events-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="no-events-title">No Events Found</h2>
          <p className="no-events-message">
            {searchTerm 
              ? "No events match your search criteria. Try a different search term."
              : "There are no events available at the moment. Please check back later."}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                fetchEvents();
              }}
              className="clear-search-button"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-card"
            >
              <h2 className="event-title">{event.name}</h2>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="event-website"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit Website
                </a>
              )}
              {event.contacts && (
                <p className="event-contacts">Contacts: {event.contacts}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}; 
