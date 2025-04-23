import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClubsPage from '../components/ClubsPage';
import axios from 'axios';

// Mocking the axios GET request
jest.mock('axios');

// Mock child components
jest.mock('../components/clubsFilter', () => ({ onFilterChange }) => (
  <button onClick={() => onFilterChange('Science', '')}>Mock Filter</button>
));

jest.mock('../components/clubsModal', () => ({ isOpen, toggle, activeItem }) => (
  isOpen ? <div>{activeItem?.Title} Modal Open <button onClick={toggle}>Close</button></div> : null
));

const mockClubsData = [
  { id: 1, Title: 'Science Club', Category: 'Science', ImageUrl: 'science.jpg' },
  { id: 2, Title: 'Math Club', Category: 'Math', ImageUrl: 'math.jpg' }
];

describe('ClubsPage', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<ClubsPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('renders clubs after API fetch', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubsData });

    render(<ClubsPage />);

    await waitFor(() => {
      expect(screen.getByText('Science Club')).toBeInTheDocument();
      expect(screen.getByText('Math Club')).toBeInTheDocument();
    });

    // Check image rendering
    expect(screen.getByAltText('Science Club')).toHaveAttribute('src', 'science.jpg');
    expect(screen.getByAltText('Math Club')).toHaveAttribute('src', 'math.jpg');
  });

  it('displays error state when API fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch clubs'));

    render(<ClubsPage />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch clubs')).toBeInTheDocument();
    });
  });

  it('shows message when no clubs are returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<ClubsPage />);
    await waitFor(() => {
      expect(screen.queryByText('Error: Failed to fetch clubs')).not.toBeInTheDocument();
    });

  });

  it('applies filtering based on category', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubsData });

    render(<ClubsPage />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Science Club')).toBeInTheDocument();
    });

    // Trigger filter
    fireEvent.click(screen.getByText('Mock Filter'));

    // Only Science Club should remain
    await waitFor(() => {
      expect(screen.getByText('Science Club')).toBeInTheDocument();
      expect(screen.queryByText('Math Club')).not.toBeInTheDocument();
    });
  });

  it('opens modal when club is clicked and closes on button click', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubsData });

    render(<ClubsPage />);

    await waitFor(() => {
      expect(screen.getByText('Science Club')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Science Club'));

    await waitFor(() => {
      expect(screen.getByText('Science Club Modal Open')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByText('Science Club Modal Open')).not.toBeInTheDocument();
    });
  });
});
