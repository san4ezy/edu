import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService, Event } from '../services/api/events';

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await eventsService.getEvent(eventId);
      setEvent(eventData);
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
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

  if (!event) {
    return (
      <div className="no-events-container">
        <div className="no-events-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="no-events-title">Event Not Found</h2>
        <p className="no-events-message">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/events')}
          className="clear-search-button"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <div className="event-detail-header">
        <button
          onClick={() => navigate('/events')}
          className="back-button"
        >
          ← Back to Events
        </button>
        <h1 className="event-detail-title">{event.name}</h1>
      </div>

      <div className="event-detail-content">
        {event.description && (
          <div className="event-detail-section">
            <h2 className="event-detail-section-title">Description</h2>
            <p className="event-detail-description">{event.description}</p>
          </div>
        )}

        {event.website && (
          <div className="event-detail-section">
            <h2 className="event-detail-section-title">Website</h2>
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="event-detail-website"
            >
              Visit Website
            </a>
          </div>
        )}

        {event.contacts && (
          <div className="event-detail-section">
            <h2 className="event-detail-section-title">Contacts</h2>
            <p className="event-detail-contacts">{event.contacts}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
