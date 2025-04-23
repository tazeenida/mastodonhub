import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourEvents from '../components/YourEvents';
import React from 'react';

// Mock localStorage
beforeEach(() => {
  let store = {};
  global.Storage.prototype.getItem = jest.fn((key) => store[key] || null);
  global.Storage.prototype.setItem = jest.fn((key, value) => {
    store[key] = value;
  });
  global.Storage.prototype.removeItem = jest.fn((key) => {
    delete store[key];
  });
});

// Sample event data
const sampleEvent = {
  title: "Tech Conference",
  description: "A conference about the latest in technology.",
  location: "Main Hall",
  startTime: "10:00 AM",
  endTime: "2:00 PM",
  imageUrl: "https://example.com/event.jpg",
};

describe('YourEvents Component', () => {
  test('renders "No events found" when no events are present', () => {
    render(<YourEvents />);
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });

  test('loads events from localStorage on mount', async () => {
    localStorage.setItem('calendarEvents', JSON.stringify([sampleEvent]));

    render(<YourEvents />);

    expect(await screen.findByText('Tech Conference')).toBeInTheDocument();
    expect(screen.getByText('A conference about the latest in technology.')).toBeInTheDocument();
    expect(screen.getByText('Main Hall')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 2:00 PM')).toBeInTheDocument();
  });

  test('removes an event and updates localStorage', async () => {
    localStorage.setItem('calendarEvents', JSON.stringify([sampleEvent]));

    render(<YourEvents />);

    const removeButton = screen.getByText(/Remove Event/i);
    fireEvent.click(removeButton);

    await waitFor(() => expect(screen.getByText(/No events found/i)).toBeInTheDocument());

    expect(localStorage.setItem).toHaveBeenCalledWith('calendarEvents', JSON.stringify([]));
  });

  test('clears all events and updates localStorage', async () => {
    localStorage.setItem('calendarEvents', JSON.stringify([sampleEvent]));

    render(<YourEvents />);

    const clearButton = screen.getByText(/Clear All Events/i);
    fireEvent.click(clearButton);

    await waitFor(() => expect(screen.getByText(/No events found/i)).toBeInTheDocument());

    expect(localStorage.removeItem).toHaveBeenCalledWith('calendarEvents');
  });
});
