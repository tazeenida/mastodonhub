import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FeatureModal from './FeatureModal';

const backendUrl = `https://django-mastodonhub-react-1.onrender.com`;

function FeaturedEvents() {
  const [FeaturedEvents, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState({});
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/mastodonhub/events/`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleFeatureClick = (FeaturedEvents) => {
    console.log('Opening modal for', FeaturedEvents);
    setActiveItem(FeaturedEvents);
    setModal(true); // Set modal to open when clicking on an event
  };

  const addEventToCalendar = (event) => {
    const storedEvents = localStorage.getItem('calendarEvents');
    const currentEvents = storedEvents ? JSON.parse(storedEvents) : [];

    const isDuplicate = currentEvents.some(
      (e) => e.title === event.Title
    );

    if (isDuplicate) {
      alert('Event already added.');
      return;
    }

    currentEvents.push({
      title: event.Title,
      description: event.Description,
      location: event.Location,
      startTime: event.StartTime,
      endTime: event.EndTime,
      imageUrl: event.ImageUrl,
    });

    localStorage.setItem('calendarEvents', JSON.stringify(currentEvents));
    alert('Event successfully added.');
  };

  const addEventToGoogleCalendar = (event) => {
    const formatDate = (dateString, timeString) => {
      const fullDateTime = `${dateString}T${timeString}`;
      const date = new Date(fullDateTime);

      if (isNaN(date)) {
        console.error('Invalid date:', fullDateTime);
        return null;
      }

      const utcDate = new Date(date.toISOString());
      const formattedDate = utcDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      return formattedDate;
    };

    const startTimeFormatted = formatDate(event.Date, event.StartTime);
    const endTimeFormatted = formatDate(event.Date, event.EndTime);

    if (!startTimeFormatted || !endTimeFormatted) {
      alert('Invalid event date or time.');
      return;
    }

    const googleCalendarUrl = new URL('https://www.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE'); // Fixed typo here: removed extra space
    googleCalendarUrl.searchParams.append('text', event.Title);
    googleCalendarUrl.searchParams.append('details', event.Description);
    googleCalendarUrl.searchParams.append('location', event.Location);
    googleCalendarUrl.searchParams.append('dates', `${startTimeFormatted}/${endTimeFormatted}`);

    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const filteredFeaturedEvents = FeaturedEvents.filter((event) => event.Category === 'Featured');

  return (
    <div>
      <h1 className="event-title">Featured Events</h1>
      <section id="FeaturedEvents">
        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
          {filteredFeaturedEvents.map((FeaturedEvents, index) => (
            <div id="FeaturedEvents" key={index}>
              <Link className="featured-event-link" onClick={() => handleFeatureClick(FeaturedEvents)}>
                <img className="event-images" src={FeaturedEvents.ImageUrl} alt="Event" />
                <div className="event-title">{FeaturedEvents.Title}</div>
              </Link>
              <button onClick={() => addEventToCalendar(FeaturedEvents)}>Add Event</button>
              <button onClick={() => addEventToGoogleCalendar(FeaturedEvents)}>Add to Google Calendar</button>
            </div>
          ))}
          <FeatureModal isOpen={modal} toggle={() => setModal(!modal)} activeItem={activeItem} />
        </div>
      </section>
    </div>
  );
}

export default FeaturedEvents;
