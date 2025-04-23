import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MusicEvents from '../components/MusicEvents';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
window.alert = jest.fn();
window.open = jest.fn();

describe('MusicEvents', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(
      <Router>
        <MusicEvents />
      </Router>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message if fetching events fails', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching events'));

    render(
      <Router>
        <MusicEvents />
      </Router>
    );

    const errorMsg = await screen.findByText(/Error:/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('displays music events when fetched successfully', async () => {
    const mockData = [
      {
        Title: 'Summer Music Festival',
        Description: 'Join us for a day of live music from various artists!',
        Location: 'City Park',
        Date: '2024-07-11',
        StartTime: '12:00 PM',
        EndTime: '10:00 PM',
        ImageUrl: 'https://example.com/music1.jpg',
        Category: 'Music',
      },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <Router>
        <MusicEvents />
      </Router>
    );

    expect(await screen.findByText(/Summer Music Festival/i)).toBeInTheDocument();
    expect(screen.getByText(/Join us for a day of live music/i)).toBeInTheDocument();
  });

  it('adds a music event to localStorage when "Add Event" is clicked', async () => {
    const mockData = [
      {
        Title: 'Summer Music Festival',
        Description: 'Join us for a day of live music from various artists!',
        Location: 'City Park',
        Date: '2024-07-11',
        StartTime: '12:00 PM',
        EndTime: '10:00 PM',
        ImageUrl: 'https://example.com/music1.jpg',
        Category: 'Music',
      },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <Router>
        <MusicEvents />
      </Router>
    );

    const addBtn = await screen.findByText(/Add Event/i);
    fireEvent.click(addBtn);

    const stored = JSON.parse(localStorage.getItem('calendarEvents'));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Summer Music Festival');
    expect(window.alert).toHaveBeenCalledWith('Event successfully added.');
  });

  it('prevents duplicate music event from being added', async () => {
    const mockEvent = {
      Title: 'Summer Music Festival',
      Description: 'Live music!',
      Location: 'City Park',
      Date: '2024-07-11',
      StartTime: '12:00 PM',
      EndTime: '10:00 PM',
      ImageUrl: 'https://example.com/music1.jpg',
      Category: 'Music',
    };

    localStorage.setItem('calendarEvents', JSON.stringify([{ title: mockEvent.Title }]));
    axios.get.mockResolvedValue({ data: [mockEvent] });

    render(
      <Router>
        <MusicEvents />
      </Router>
    );

    const addBtn = await screen.findByText(/Add Event/i);
    fireEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith('Event already added.');
  });

  it('opens Google Calendar with correct URL when "Add to Google Calendar" is clicked', async () => {
    const mockEvent = {
      Title: 'Jazz Night',
      Description: 'Smooth jazz experience',
      Location: 'Jazz Club',
      Date: '2024-08-20',
      StartTime: '18:00',
      EndTime: '21:00',
      ImageUrl: 'https://example.com/jazz.jpg',
      Category: 'Music',
    };

    axios.get.mockResolvedValue({ data: [mockEvent] });

    render(
      <Router>
        <MusicEvents />
      </Router>
    );

    const googleBtn = await screen.findByText(/Add to Google Calendar/i);
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });

    const calledUrl = window.open.mock.calls[0][0];
    const parsed = new URL(calledUrl);

    expect(parsed.href).toContain('https://www.google.com/calendar/render');
    expect(parsed.searchParams.get('text')).toBe(mockEvent.Title);
    expect(parsed.searchParams.get('details')).toBe(mockEvent.Description);
    expect(parsed.searchParams.get('location')).toBe(mockEvent.Location);
    expect(parsed.searchParams.get('dates')).toMatch(/20240820T/);
  });

  it('shows alert if event has invalid date or time for Google Calendar', async () => {
    const invalidEvent = {
      Title: 'Broken Jazz',
      Description: 'Bad time format',
      Location: 'Somewhere',
      Date: 'invalid-date',
      StartTime: '99:99',
      EndTime: '12:00',
      ImageUrl: 'https://example.com/bad.jpg',
      Category: 'Music',
    };
  
    axios.get.mockResolvedValue({ data: [invalidEvent] });
  
    render(
      <Router>
        <MusicEvents />
      </Router>
    );
  
    const googleBtn = await screen.findByText(/Add to Google Calendar/i);
    fireEvent.click(googleBtn);
  
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid end date or time.');
    });
  });
  
  it('does not render any music events if category is not Music', async () => {
    const nonMusicEvent = {
      Title: 'Tech Talk',
      Category: 'Tech',
    };
  
    axios.get.mockResolvedValue({ data: [nonMusicEvent] });
  
    render(
      <Router>
        <MusicEvents />
      </Router>
    );
  
    await waitFor(() => {
      expect(screen.queryByText(/Tech Talk/i)).not.toBeInTheDocument();
    });
  });
  
});
