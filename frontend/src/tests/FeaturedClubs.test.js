import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import FeaturedClubs from '../components/FeaturedClubs';

// Mock axios
jest.mock('axios');

// Mock sample data
const mockClubs = [
  {
    "Title": "Basketball Club",
    "PresidentName": "Myles Olagbegi",
    "TreasurerName": "Autumn Searfoss",
    "AdvisorName": "Nick Brand",
    "Email": "BBclub@pfw.edu",
    "ImageUrl": "https://horizoneroundtable.com/wp-content/uploads/2022/09/image_2022-10-02_180312764.png",
    "Category": "Featured"
  },
  {
    "Title": "Chess Club",
    "PresidentName": "John Doe",
    "TreasurerName": "Jane Smith",
    "AdvisorName": "Dr. White",
    "Email": "chess@pfw.edu",
    "ImageUrl": "chess-club-image.jpg",
    "Category": "Featured"
  }
];

// Wrapper component to provide router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FeaturedClubs Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderWithRouter(<FeaturedClubs />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    renderWithRouter(<FeaturedClubs />);
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('renders featured clubs successfully', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    renderWithRouter(<FeaturedClubs />);
    
    await waitFor(() => {
      expect(screen.getByText('Featured Clubs')).toBeInTheDocument();
      expect(screen.getByText('Basketball Club')).toBeInTheDocument();
      expect(screen.getByText('Chess Club')).toBeInTheDocument();
    });
  });

  test('opens modal when clicking on a club', async () => {
    axios.get.mockResolvedValueOnce({ data: mockClubs });
    
    renderWithRouter(<FeaturedClubs />);
    
    await waitFor(() => {
      const basketballClub = screen.getByText('Basketball Club');
      fireEvent.click(basketballClub);
      // Note: You'll need to add specific tests for your modal content
      // This will depend on how your ClubModal component is implemented
    });
  });

  test('filters only featured clubs', async () => {
    const mixedClubs = [
      ...mockClubs,
      {
        "Title": "Non-Featured Club",
        "Category": "Regular"
      }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mixedClubs });
    
    renderWithRouter(<FeaturedClubs />);
    
    await waitFor(() => {
      expect(screen.getByText('Basketball Club')).toBeInTheDocument();
      expect(screen.getByText('Chess Club')).toBeInTheDocument();
      expect(screen.queryByText('Non-Featured Club')).not.toBeInTheDocument();
    });
  });
});