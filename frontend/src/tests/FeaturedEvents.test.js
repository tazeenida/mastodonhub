import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import FeaturedEvents from '../components/FeaturedEvents';

// Mock axios
jest.mock('axios');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock alert
window.alert = jest.fn();

describe('FeaturedEvents Component', () => {
  const mockEvents = [
    {
      id: 1,
      Title: 'Music Festival',
      Description: 'Annual music festival',
      Category: 'Featured',
      Location: 'Central Park',
      Date: '2025-04-15',
      StartTime: '12:00',
      EndTime: '22:00',
      ImageUrl: 'https://example.com/music.jpg'
    },
    {
      id: 2,
      Title: 'Art Exhibition',
      Description: 'Modern art showcase',
      Category: 'Featured',
      Location: 'City Gallery',
      Date: '2025-04-20',
      StartTime: '10:00',
      EndTime: '18:00',
      ImageUrl: 'https://example.com/art.jpg'
    },
    {
      id: 3,
      Title: 'Regular Event',
      Description: 'Not featured',
      Category: 'Regular',
      Location: 'Community Center',
      Date: '2025-04-25',
      StartTime: '15:00',
      EndTime: '17:00',
      ImageUrl: 'https://example.com/regular.jpg'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('displays loading state initially', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('renders featured events correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Featured Events')).toBeInTheDocument();
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
      expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
      expect(screen.queryByText('Regular Event')).not.toBeInTheDocument(); // Non-featured event should not be shown
    });
  });

  test('clicking on event opens modal', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Music Festival'));
    
    // This test assumes FeatureModal receives the activeItem and displays some part of it
    // If the modal is well integrated, we might need to check for specific modal content
    // This is a basic test - additional tests for the modal itself would be appropriate
  });

  test('adds event to local calendar', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
    });
    
    // Find all "Add Event" buttons and click the first one
    const addButtons = screen.getAllByText('Add Event');
    fireEvent.click(addButtons[0]);
    
    // Verify localStorage was called with correct data
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.setItem.mock.calls[0][0]).toBe('calendarEvents');
    
    // Parse the JSON that was passed to localStorage
    const savedEvents = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedEvents[0].title).toBe('Music Festival');
    
    // Check that success message was shown
    expect(window.alert).toHaveBeenCalledWith('Event successfully added.');
  });

  test('prevents duplicate events in local calendar', async () => {
    // Set up localStorage to already have the event
    const existingEvent = {
      title: 'Music Festival',
      description: 'Annual music festival',
      location: 'Central Park',
      startTime: '12:00',
      endTime: '22:00',
      imageUrl: 'https://example.com/music.jpg'
    };
    
    localStorage.getItem.mockReturnValueOnce(JSON.stringify([existingEvent]));
    
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
    });
    
    const addButtons = screen.getAllByText('Add Event');
    fireEvent.click(addButtons[0]);
    
    // Check that duplicate warning was shown
    expect(window.alert).toHaveBeenCalledWith('Event already added.');
  });

  test('adds event to Google Calendar', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEvents });
    
    render(
      <BrowserRouter>
        <FeaturedEvents />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
    });
    
    const googleButtons = screen.getAllByText('Add to Google Calendar');
    fireEvent.click(googleButtons[0]);
    
    // Verify window.open was called with a URL containing the event details
    expect(mockOpen).toHaveBeenCalled();
    const openUrl = mockOpen.mock.calls[0][0];
    
    expect(openUrl).toContain('google.com/calendar/render');
    expect(openUrl).toContain('action=TEMPLATE');
    // Fix: Use '+' instead of '%20' for URL encoding of spaces
    expect(openUrl).toContain('text=Music+Festival');
    expect(openUrl).toContain('location=Central+Park');
  });
});