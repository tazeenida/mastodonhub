import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtEvents from '../components/ArtEvents';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
window.open = jest.fn();
window.alert = jest.fn();

// Optional: suppress console.error spam during test failures
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ArtEvents', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(
      <Router>
        <ArtEvents />
      </Router>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message if fetching events fails', async () => {
    axios.get.mockRejectedValue(new Error('Error fetching events'));

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    const errorMsg = await screen.findByText(/Error:/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('displays event data when fetched successfully', async () => {
    const mockData = [{
      Title: 'Art Exhibition 1',
      Description: 'A beautiful art exhibition.',
      Location: 'Gallery 1',
      StartTime: '10:00 AM',
      EndTime: '12:00 PM',
      Date: '2025-02-20',
      Category: 'Art',
      ImageUrl: 'https://example.com/image1.jpg',
    }];
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    const title = await screen.findByText(/Art Exhibition 1/i);
    expect(title).toBeInTheDocument();

    expect(screen.getByText(/A beautiful art exhibition./i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM - 12:00 PM/i)).toBeInTheDocument();
    expect(screen.getByText(/Gallery 1/i)).toBeInTheDocument();
  });

  it('adds an event to localStorage when "Add Event" button is clicked', async () => {
    const mockData = [{
      Title: 'Art Exhibition 1',
      Description: 'A beautiful art exhibition.',
      Location: 'Gallery 1',
      StartTime: '10:00 AM',
      EndTime: '12:00 PM',
      Date: '2025-02-20',
      Category: 'Art',
      ImageUrl: 'https://example.com/image1.jpg',
    }];
    axios.get.mockResolvedValue({ data: mockData });

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    const addBtn = await screen.findByText(/Add Event/i);
    await userEvent.click(addBtn);

    const stored = JSON.parse(localStorage.getItem('calendarEvents'));
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Art Exhibition 1');
    expect(window.alert).toHaveBeenCalledWith('Event successfully added.');
  });

  it('prevents duplicate events from being added', async () => {
    const mockData = [{
      Title: 'Art Exhibition 1',
      Description: 'A beautiful art exhibition.',
      Location: 'Gallery 1',
      StartTime: '10:00 AM',
      EndTime: '12:00 PM',
      Date: '2025-02-20',
      Category: 'Art',
      ImageUrl: 'https://example.com/image1.jpg',
    }];
    axios.get.mockResolvedValue({ data: mockData });

    localStorage.setItem('calendarEvents', JSON.stringify([
      { title: 'Art Exhibition 1' }
    ]));

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    const addBtn = await screen.findByText(/Add Event/i);
    await userEvent.click(addBtn);

    expect(window.alert).toHaveBeenCalledWith('Event already added.');
  });

  it('opens Google Calendar with correct URL when button clicked', async () => {
    const mockData = [{
      Title: 'Art Exhibition 1',
      Description: 'A beautiful art exhibition.',
      Location: 'Gallery 1',
      StartTime: '10:00',
      EndTime: '12:00',
      Date: '2025-02-20',
      Category: 'Art',
      ImageUrl: 'https://example.com/image1.jpg',
    }];
    axios.get.mockResolvedValue({ data: mockData });
  
    render(
      <Router>
        <ArtEvents />
      </Router>
    );
  
    const googleBtn = await screen.findByText(/Add to Google Calendar/i);
    await userEvent.click(googleBtn);
  
    await waitFor(() => {
      expect(window.open).toHaveBeenCalled();
    });
  
    const url = window.open.mock.calls[0][0];
    const parsed = new URL(url);
  
    expect(url).toContain('https://www.google.com/calendar/render');
    expect(parsed.searchParams.get('text')).toBe('Art Exhibition 1');
    expect(parsed.searchParams.get('details')).toBe('A beautiful art exhibition.');
    expect(parsed.searchParams.get('location')).toBe('Gallery 1');
  });
  

  it('handles no Art category match gracefully', async () => {
    const nonArtEvent = [{
      Title: 'Science Expo',
      Description: 'Explore science!',
      Category: 'Science',
    }];
    axios.get.mockResolvedValue({ data: nonArtEvent });

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Science Expo/i)).not.toBeInTheDocument();
    });
  });

  it('renders nothing if events array is empty', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <ArtEvents />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Add Event/i)).not.toBeInTheDocument();
    });
  });
});
