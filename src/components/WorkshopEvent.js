import React from 'react';
import AddToCalendar from 'react-add-to-calendar';
import workshop_event1 from '../images/workshop_event1.jpg';
import workshop_event2 from '../images/workshop_event2.jpeg';
import workshop_event3 from '../images/workshop_event3.jpeg';
import workshop_event4 from '../images/workshop_event4.jpeg';
import workshop_event5 from '../images/workshop_event5.jpeg';
import workshop_event6 from '../images/workshop_event6.jpeg';

function WorkshopEvents() {
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
      title: 'Writing Workshops',
      description: 'Creative writing workshop focusing on fiction, poetry, or non-fiction.',
      location: 'Walb Union',
      date: '2024-03-15',
      startTime: '10:00 AM',
      endTime: '5:00 PM',
      imageUrl: workshop_event1,
    },
    {
      title: 'Oil Painting Workshop',
      description: 'Personal Development Workshops: Leadership workshops focusing on communication, team-building, and decision-making skills.',
      location: 'Kettler',
      date: '2024-03-15',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      imageUrl: workshop_event2,
    },
    {
      title: 'Photography Workshop',
      description: 'Learn photography basics and advanced techniques.',
      location: 'Arts Center',
      date: '2024-03-20',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      imageUrl: workshop_event3,
    },
    {
      title: 'Cooking Class',
      description: 'Hands-on cooking class with professional chefs.',
      location: 'Culinary Institute',
      date: '2024-03-20',
      startTime: '3:00 PM',
      endTime: '6:00 PM',
      imageUrl: workshop_event4,
    },
    {
      title: 'Gardening Workshop',
      description: 'Learn the basics of gardening and plant care.',
      location: 'Community Garden',
      date: '2024-03-25',
      startTime: '10:00 AM',
      endTime: '1:00 PM',
      imageUrl: workshop_event5,
    },
    {
      title: 'Yoga Retreat',
      description: 'Relax and rejuvenate with a weekend yoga retreat.',
      location: 'Mountain Retreat Center',
      date: '2024-04-05',
      startTime: '5:00 PM',
      endTime: '2024-04-07 12:00 PM',
      imageUrl: workshop_event6,
    },
    // Add more workshops as needed
  ];

  return (
    <div>
      <section id="WorkshopsEvents">
        <h1>Workshops</h1>
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
      </section>
    </div>
  );
}

export default WorkshopEvents;
