import React, { useState } from 'react';
import art_event1 from '../images/art_event1.jpeg';
import art_event2 from '../images/art_event2.jpeg';
import art_event3 from '../images/art_event3.jpeg';
import art_event4 from '../images/art_event4.jpeg';
import art_event5 from '../images/art_event5.jpeg';

function ArtEvents() {
  const handleAddToCalendar = (event) => {
    // Load calendar events from local storage
    const storedEvents = localStorage.getItem('calendarEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];

    // Check if the event title already exists in the calendarEvents array
    const isDuplicate = events.some((e) => e.title === event.title);

    // If the event title already exists, display a message and return
    if (isDuplicate) {
      alert('Event already added to calendar.');
      return;
    }

    // Otherwise, add the event to the calendarEvents array
    events.push(event);
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  };

  const handleRemoveFromCalendar = (eventTitle) => {
    // Remove the event from the calendarEvents array
    const storedEvents = localStorage.getItem('calendarEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const updatedEvents = events.filter((e) => e.title !== eventTitle);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const events = [
    {
      title: 'Art Exhibition: Modern Masters',
      description: 'Explore stunning works of modern art by renowned artists!',
      location: 'Visual Arts Gallery',
      date: '2024-07-15',
      startTime: '10:00 AM',
      endTime: '6:00 PM',
      imageUrl: art_event1,
    },
    {
      title: 'Sculpture Workshop',
      description: 'Learn the art of sculpture from expert sculptors!',
      location: 'Kettler',
      date: '2024-08-05',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      imageUrl: art_event2,
    },
    {
      title: 'Painting Class: Abstract Art',
      description: 'Unleash your creativity with abstract painting techniques!',
      location: 'Walb Studio',
      date: '2024-08-20',
      startTime: '6:00 PM',
      endTime: '8:00 PM',
      imageUrl: art_event3,
    },
    {
      title: 'Art History Lecture Series',
      description: 'Delve into the rich history of art with engaging lectures!',
      location: 'Kettler Hall',
      date: '2024-09-10',
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      imageUrl: art_event4,
    },
    {
      title: 'Pottery Making Demonstration',
      description: 'Witness the magic of pottery making in action!',
      location: 'Visual Arts Gallery',
      date: '2024-10-15',
      startTime: '11:00 AM',
      endTime: '1:00 PM',
      imageUrl: art_event5,
    },
  ];

  return (
    <div>
      <section id="ArtEvents">
        <h1>Art Events</h1>
        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
          {events.map((event, index) => (
            <div key={index} className="ArtEvents-item">
              <img src={event.imageUrl} alt={event.title} />
              <div className="event-title">{event.title}</div>
              <div className="event-date">{event.date}</div>
              <div className="event-description">{event.description}</div>
              <div className="event-time">{event.startTime} - {event.endTime}</div>
              <div className="event-location">{event.location}</div>
              <button onClick={() => handleAddToCalendar(event)} style={{ marginRight: '5px' }}>Add to Calendar</button>
              <button onClick={() => handleRemoveFromCalendar(event.title)}>Remove from Calendar</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ArtEvents;
