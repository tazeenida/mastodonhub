import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import EventBlog from '../components/EventBlog'; // Adjust path as needed

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

// Mock the fetch function
global.fetch = jest.fn();
global.alert = jest.fn();

describe('EventBlog Component', () => {
  const mockEvents = [
    { id: 1, Title: 'Concert in the Park' },
    { id: 2, Title: 'Tech Conference 2025' }
  ];
  
  const mockBlogs = [
    { id: 1, title: 'Amazing Concert', content: 'Had a great time', rating: 5, eventId: 1 },
    { id: 2, title: 'Tech Conference Review', content: 'Very informative', rating: 4, eventId: 2 }
  ];

  const navigateMock = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup useNavigate mock
    useNavigate.mockImplementation(() => navigateMock);
    
    // Setup fetch mock for events
    global.fetch.mockImplementation((url) => {
      if (url === 'http://127.0.0.1:8000/api/mastodonhub/events/') {
        return Promise.resolve({
          json: () => Promise.resolve(mockEvents)
        });
      } else if (url === 'http://127.0.0.1:8000/api/mastodonhub/blogs/') {
        return Promise.resolve({
          json: () => Promise.resolve(mockBlogs)
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  test('renders the review form', async () => {
    render(
      <MemoryRouter>
        <EventBlog />
      </MemoryRouter>
    );
    
    // Check if form elements are rendered
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
    expect(screen.getByText('Select Event')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Your Review')).toBeInTheDocument();
    expect(screen.getByText('Rating (1-5 stars)')).toBeInTheDocument();
    expect(screen.getByText('Post Review')).toBeInTheDocument();
  });

  test('fetches and displays events in dropdown', async () => {
    render(
      <MemoryRouter>
        <EventBlog />
      </MemoryRouter>
    );
    
    // Wait for events to be loaded
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/mastodonhub/events/');
    });
    
    // Check if events are added to the dropdown
    await waitFor(() => {
      expect(screen.getByText('Concert in the Park')).toBeInTheDocument();
      expect(screen.getByText('Tech Conference 2025')).toBeInTheDocument();
    });
  });

  test('updates form state when inputs change', async () => {
    render(
      <MemoryRouter>
        <EventBlog />
      </MemoryRouter>
    );
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Post Review')).toBeInTheDocument();
    });
    
    // Get form elements by their labels and then find the input/textarea
    const titleLabel = screen.getByText('Title');
    const titleInput = titleLabel.parentElement.querySelector('input');
    
    const reviewLabel = screen.getByText('Your Review');
    const contentTextarea = reviewLabel.parentElement.querySelector('textarea');
    
    const ratingLabel = screen.getByText('Rating (1-5 stars)');
    const ratingInput = ratingLabel.parentElement.querySelector('input');
    
    // Simulate user input
    fireEvent.change(titleInput, { target: { value: 'Great Event' } });
    fireEvent.change(contentTextarea, { target: { value: 'I had an amazing time at this event.' } });
    fireEvent.change(ratingInput, { target: { value: '4' } });
    
    // Check if inputs have updated values
    expect(titleInput.value).toBe('Great Event');
    expect(contentTextarea.value).toBe('I had an amazing time at this event.');
    expect(ratingInput.value).toBe('4');
  });
  
  test('handles form submission correctly', async () => {
    render(
      <MemoryRouter>
        <EventBlog />
      </MemoryRouter>
    );
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Post Review')).toBeInTheDocument();
    });
    
    // Get title input using the label
    const titleLabel = screen.getByText('Title');
    const titleInput = titleLabel.parentElement.querySelector('input');
    
    // Get content textarea using the label
    const reviewLabel = screen.getByText('Your Review');
    const contentTextarea = reviewLabel.parentElement.querySelector('textarea');
    
    // Fill in the form
    fireEvent.change(titleInput, { target: { value: 'Great Event' } });
    fireEvent.change(contentTextarea, { target: { value: 'I had an amazing time.' } });
    
    // Get and click the submit button using its text
    const submitButton = screen.getByText('Post Review');
    fireEvent.click(submitButton);
    
    // Check if alert was shown
    expect(global.alert).toHaveBeenCalledWith('Review Successfully Posted!');
    
    // Check if navigation was triggered
    expect(navigateMock).toHaveBeenCalledWith('/Dashboard');
  });
  
  test('handles fetch errors gracefully', async () => {
    // Mock console.error to test error handling
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Make fetch throw an error
    global.fetch.mockImplementation(() => {
      return Promise.reject(new Error('Network error'));
    });
    
    render(
      <MemoryRouter>
        <EventBlog />
      </MemoryRouter>
    );
    
    // Wait for error to be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});