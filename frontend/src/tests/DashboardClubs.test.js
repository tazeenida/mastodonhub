import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ClubsPage from '../components/ClubsPage'; // Adjust path as needed
import ClubModal from '../components/clubsModal'; // Adjust path as needed

// Mock the axios module
jest.mock('axios');

// Mock the ClubModal component
jest.mock('../components/clubsModal', () => {
  return jest.fn(({ isOpen, toggle, activeItem }) => 
    isOpen ? (
      <div data-testid="club-modal">
        <button onClick={toggle} data-testid="close-modal">Close</button>
        <h2>{activeItem.Title}</h2>
      </div>
    ) : null
  );
});

describe('ClubsPage Component', () => {
  const mockClubs = [
    { 
      id: 1, 
      Title: 'Chess Club', 
      ImageUrl: 'chess.jpg',
      Description: 'A club for chess enthusiasts'
    },
    { 
      id: 2, 
      Title: 'Book Club', 
      ImageUrl: 'book.jpg',
      Description: 'A club for book lovers'
    }
  ];

  beforeEach(() => {
    ClubModal.mockClear();
  });

  test('renders loading state initially', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders clubs after successful data fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Chess Club')).toBeInTheDocument();
      expect(screen.getByText('Book Club')).toBeInTheDocument();
    });
    
    // Update this test to account for the banner image
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3); // Changed from 2 to 3 to include banner image
    
    // Find images by alt text instead of position
    const chessImg = screen.getByAltText('Chess Club');
    const bookImg = screen.getByAltText('Book Club');
    
    expect(chessImg).toHaveAttribute('src', 'chess.jpg');
    expect(bookImg).toHaveAttribute('src', 'book.jpg');
  });

  test('renders error message when fetch fails', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('opens modal when club is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Chess Club')).toBeInTheDocument();
    });
    
    // Click on the first club
    fireEvent.click(screen.getByText('Chess Club'));
    
    // Check if modal is rendered with correct props
    expect(ClubModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        activeItem: mockClubs[0]
      }),
      expect.anything()
    );
  });

  test('closes modal when toggle function is called', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    // Wait for clubs to load
    await waitFor(() => {
      expect(screen.getByText('Chess Club')).toBeInTheDocument();
    });
    
    // Open modal
    fireEvent.click(screen.getByText('Chess Club'));
    
    // Instead of checking for modal directly in the DOM, check if the ClubModal was called with the right props
    expect(ClubModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isOpen: true,
        activeItem: expect.objectContaining({
          Title: 'Chess Club'
        })
      }),
      expect.anything()
    );
    
    // Get the toggle function from the last call to ClubModal
    const lastCall = ClubModal.mock.calls[ClubModal.mock.calls.length - 1];
    const toggleFunction = lastCall[0].toggle;
    
    // Call the toggle function directly
    toggleFunction();
    
    // Check if ClubModal was called again with isOpen: false
    await waitFor(() => {
      expect(ClubModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false
        }),
        expect.anything()
      );
    });
  });

  test('makes API request with correct URL', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    render(
      <BrowserRouter>
        <ClubsPage />
      </BrowserRouter>
    );
    
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/mastodonhub/clubs/');
  });
});