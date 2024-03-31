import React, { useState, useEffect } from 'react';

function YourEvents() {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    // Load calendar events from local storage when component mounts
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setCalendarEvents(JSON.parse(storedEvents));
    }
  }, []);

  const removeEvent = (index) => {
    // Remove the event at the specified index from the calendarEvents array
    const updatedEvents = [...calendarEvents];
    updatedEvents.splice(index, 1);
    setCalendarEvents(updatedEvents);
    // Update localStorage with the updated events
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const clearEvents = () => {
    // Clear calendar events
    localStorage.removeItem('calendarEvents');
    setCalendarEvents([]);
  };

  return (
    <div id="YourEvents">
      <h2>Your Events</h2>
      <button onClick={clearEvents}>Clear Events</button>
      <div className="YourEvent-container">
        {calendarEvents.map((event, index) => (
          <div key={index} className="YourEvent-item">
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} width="200px" height="200px"/>}
            <div className="event-title">{event.title}</div>
            <div className="event-description">{event.description}</div>
            <div className="event-location">{event.location}</div>
            <div className="event-time" style={{ padding: '5px' }}>{event.startTime} - {event.endTime}</div>
            <button onClick={() => removeEvent(index)}>Remove Event</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourEvents;
