import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import music_event from '../images/music.png';
import jazz_event_image from '../images/jazz_event_image.jpeg';
import indie_showcase_image from '../images/indie_showcase_image.jpeg';
import classical_recital_image from '../images/classical_recital_image.jpeg';
import country_festival_image from '../images/country_festival_image.jpeg';
import rock_concert_image from '../images/rock_concert_image.jpeg';

function MusicEvents() {
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
      title: 'Summer Music Festival',
      description: 'Join us for a day of live music from various artists!',
      location: 'City Park',
      date: '2024-07-20',
      startTime: '12:00 PM',
      endTime: '10:00 PM',
      imageUrl: music_event,
    },
    {
      title: 'Jazz Night at the Lounge',
      description: 'Relax with smooth jazz tunes and great ambiance.',
      location: 'The Lounge',
      date: '2024-08-10',
      startTime: '8:00 PM',
      endTime: '11:00 PM',
      imageUrl: jazz_event_image,
    },
    {
      title: 'Rock Concert: Legends Live',
      description: 'Experience the electrifying energy of rock music with legendary bands!',
      location: 'Stadium Arena',
      date: '2024-09-05',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      imageUrl: rock_concert_image,
    },
    {
      title: 'Classical Music Recital',
      description: 'Immerse yourself in the timeless beauty of classical music performed by talented musicians.',
      location: 'Concert Hall',
      date: '2024-09-15',
      startTime: '6:30 PM',
      endTime: '9:30 PM',
      imageUrl: classical_recital_image,
    },
    {
      title: 'Country Music Festival',
      description: 'Get your cowboy boots ready for a day filled with country music and fun!',
      location: 'Fairgrounds',
      date: '2024-10-01',
      startTime: '11:00 AM',
      endTime: '9:00 PM',
      imageUrl: country_festival_image,
    },
    {
      title: 'Indie Band Showcase',
      description: 'Discover new indie bands and enjoy live performances in an intimate setting.',
      location: 'Local Pub',
      date: '2024-10-20',
      startTime: '8:00 PM',
      endTime: '11:00 PM',
      imageUrl: indie_showcase_image,
    },
  ];

  return (
    <div>
      <section id="MusicEvents">
        <h1>Music Events</h1>
        <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
        <div id="WorkshopsEvents-container" style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'black' }} className="event-images">
          {events.map((event, index) => (
            <div key={index} className="WorkshopsEvents-item">
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
        </div>
      </section>
    </div>
  );
}

export default MusicEvents;
