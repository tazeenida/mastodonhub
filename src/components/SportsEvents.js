import React, { useState } from 'react';
import football_event from '../images/football_event.jpeg';
import basketball_event from '../images/basketball_event.jpeg';
import tennis_event from '../images/tennis_event.jpeg';
import cricket_event from '../images/cricket_event.jpeg';
import rugby_event from '../images/rugby_event.jpeg';
import swimming_event from '../images/swimming_event.jpeg';

function SportsEvents() {
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
      title: 'Football Match',
      description: 'Watch an exciting football match between two top teams!',
      location: 'Stadium',
      date: '2024-07-15',
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      imageUrl: football_event,
    },
    {
      title: 'Basketball Game',
      description: 'Cheer for your favorite basketball team in a thrilling game!',
      location: 'Arena',
      date: '2024-08-05',
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      imageUrl: basketball_event,
    },
    {
      title: 'Tennis Tournament',
      description: 'Enjoy watching professional tennis players compete in a tournament!',
      location: 'Tennis Club',
      date: '2024-08-20',
      startTime: '10:00 AM',
      endTime: '5:00 PM',
      imageUrl: tennis_event,
    },
    {
      title: 'Cricket Match',
      description: 'Witness an intense cricket match featuring national teams!',
      location: 'Cricket Ground',
      date: '2024-09-10',
      startTime: '2:00 PM',
      endTime: '7:00 PM',
      imageUrl: cricket_event,
    },
    {
      title: 'Rugby Championship',
      description: 'Experience the excitement of rugby as teams compete for the championship title!',
      location: 'Rugby Stadium',
      date: '2024-09-25',
      startTime: '3:00 PM',
      endTime: '8:00 PM',
      imageUrl: rugby_event,
    },
    {
      title: 'Swimming Competition',
      description: 'See swimmers from around the world compete in various swimming events!',
      location: 'Aquatic Center',
      date: '2024-10-15',
      startTime: '9:00 AM',
      endTime: '2:00 PM',
      imageUrl: swimming_event,
    },
  ];

  return (
    <div>
      <section id="SportsEvents">
        <h1>Sports Events</h1>
        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
          {events.map((event, index) => (
            <div key={index} className="SportsEvents-item">
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

export default SportsEvents;
