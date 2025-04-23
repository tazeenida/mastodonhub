import React, { useState, useEffect } from 'react';

const YourEvents = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Purdue colors
  const purdueGold = "#CEB888";
  const purdueBlack = "#000000";

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setCalendarEvents(JSON.parse(storedEvents));
    }
  }, []);

  const eventExists = (event) => {
    return calendarEvents.some(
      (existingEvent) => 
        existingEvent.title === event.title && 
        existingEvent.startTime === event.startTime
    );
  };

  const removeEvent = (index) => {
    const updatedEvents = calendarEvents.filter((_, i) => i !== index);
    setCalendarEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const clearEvents = () => {
    localStorage.removeItem('calendarEvents');
    setCalendarEvents([]);
  };

  const addEvent = (event) => {
    if (eventExists(event)) {
      console.log("Event already exists in the calendar.");
      return;
    }

    const updatedEvents = [...calendarEvents, event];
    setCalendarEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px', color: purdueGold, fontWeight: 'bold', fontSize: '24px' }}>Your Events</h2>
      <button 
        onClick={clearEvents} 
        style={{ 
          marginBottom: '20px', 
          padding: '8px 16px', 
          backgroundColor: purdueBlack, 
          color: purdueGold, 
          border: `1px solid ${purdueGold}`, 
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Clear All Events
      </button>
      <div 
        id="Events-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '20px', 
          backgroundColor: purdueBlack
        }}
      >
        {calendarEvents.length === 0 ? (
          <div style={{ color: purdueGold, padding: '20px' }}>No events found.</div>
        ) : (
          calendarEvents.map((event, index) => (
            <div 
              key={index} 
              className="events-item"
              style={{ 
                width: '300px', 
                margin: '10px', 
                padding: '15px', 
                border: `2px solid ${purdueGold}`, 
                borderRadius: '5px',
                backgroundColor: purdueBlack,
                color: 'white',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: `0 4px 8px rgba(206, 184, 136, 0.3)`
              }}
            >
              {event.imageUrl && (
                <img
                  className="event-images"
                  src={event.imageUrl}
                  alt={event.title}
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover', 
                    marginBottom: '10px',
                    borderRadius: '3px',
                    border: `1px solid ${purdueGold}`
                  }}
                />
              )}
              <div className="event-title" style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: purdueGold }}>
                {event.title}
              </div>
              <div className="event-description" style={{ fontSize: '14px', marginBottom: '8px' }}>
                {event.description}
              </div>
              <div className="event-location" style={{ fontSize: '14px', marginBottom: '8px', color: purdueGold }}>
                {event.location}
              </div>
              <div className="event-time" style={{ fontSize: '14px', marginBottom: '12px' }}>
                {`${event.startTime} - ${event.endTime}`}
              </div>
              <button 
                onClick={() => removeEvent(index)}
                style={{ 
                  width: '100%',
                  padding: '8px 16px', 
                  backgroundColor: purdueBlack, 
                  color: purdueGold, 
                  border: `1px solid ${purdueGold}`, 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: 'auto',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = purdueBlack}
              >
                Remove Event
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default YourEvents;