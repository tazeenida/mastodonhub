import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const backendUrl = 'http://127.0.0.1:8000';

function MusicEvents() {
  const [musicEvents, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  
  const addEventToGoogleCalendar = (event) => {
    const formatDate = (dateString, timeString) => {
      const fullDateTime = `${dateString}T${timeString}`;
      const date = new Date(fullDateTime);

      if (isNaN(date)){
        console.error('Invalid date:', fullDateTime);
        return null;
      }

      const utcDate = new Date(date.toISOString());
      const formattedDate = utcDate.toISOString().replace(/[-:]/g, '').split('.')[0]+ 'Z';
      return formattedDate;
    };

    const startTimeFormatted = formatDate(event.Date, event.StartTime);
    const endTimeFormatted = formatDate(event.Date, event.EndTime );

    if(!startTimeFormatted || !endTimeFormatted){
      alert('Invalid end date or time.');
      return;
    }

    const googleCalendarUrl = new URL('https://www.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', event.Title);
    googleCalendarUrl.searchParams.append('details', event.Description);
    googleCalendarUrl.searchParams.append('location', event.Location);
    googleCalendarUrl.searchParams.append('dates', `${startTimeFormatted}/${endTimeFormatted}`);

    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const filteredMusicEvents = musicEvents.filter((event) => event.Category === 'Music');
  return (
    <div>
      <section id="MusicEvents">
        <h1>Music Events</h1>
        <div id="Events-container" style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black', flexWrap: 'wrap', }} className="event-images">
          {filteredMusicEvents.map((musicEvents) => (
            <Link className="Events-item">
              <img className="event-images" src={musicEvents.ImageUrl} alt="Event" />
                <div className="event-title">{musicEvents.Title}</div>
              <div className="event-date">{musicEvents.Date}</div>
              <div className="event-description">{musicEvents.Description}</div>
              <div className="event-time">{musicEvents.StartTime} - {musicEvents.EndTime}</div>
              <div className="event-location">{musicEvents.Location}</div>
              <button onClick={() => addEventToCalendar(musicEvents)}>Add Event</button>
              <button onClick={() => addEventToGoogleCalendar(musicEvents)}>Add to Google Calendar</button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MusicEvents;
