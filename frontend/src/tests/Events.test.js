import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Events from '../components/Events';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import FeaturedEvents from '../components/FeaturedEvents';
import YourEvents from '../components/YourEvents';

// Properly mock default-exported subcomponents
jest.mock('../components/SearchForm', () => ({
  __esModule: true,
  default: () => <div>SearchForm Component</div>,
}));
jest.mock('../components/FeaturedEvents', () => ({
  __esModule: true,
  default: () => <div>FeaturedEvents Component</div>,
}));
jest.mock('../components/YourEvents', () => ({
  __esModule: true,
  default: () => <div>YourEvents Component</div>,
}));

beforeEach(() => {
  global.fetch = jest.fn();
  jest.clearAllMocks();
});

describe('Events', () => {
  it('renders banner and subcomponents', () => {
    render(
      <Router>
        <Events />
      </Router>
    );

    expect(screen.getByAltText(/banner_event/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover exciting events with MastodonHub/i)).toBeInTheDocument();
    expect(screen.getByText(/SearchForm Component/i)).toBeInTheDocument();
    expect(screen.getByText(/FeaturedEvents Component/i)).toBeInTheDocument();
    expect(screen.getByText(/YourEvents Component/i)).toBeInTheDocument();
  });

  it('renders blogs fetched from API', async () => {
    const mockBlogs = [
      {
        id: 1,
        title: 'Campus Fest',
        content: 'A fun-filled experience.',
        rating: 5,
        created_at: '2025-04-01T10:00:00Z',
      },
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockBlogs,
    });

    render(
      <Router>
        <Events />
      </Router>
    );

    // Wait for blog to render
    const blogTitle = await screen.findByText(/Campus Fest/i);
    expect(blogTitle).toBeInTheDocument();
    expect(screen.getByText(/A fun-filled experience./i)).toBeInTheDocument();
    expect(screen.getByText(/Rating: 5\/5/i)).toBeInTheDocument();
    expect(screen.getByText(/Posted:/i)).toBeInTheDocument();
  });

  it('handles fetch failure gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <Router>
        <Events />
      </Router>
    );

    // Wait for fetch to fail and ensure no blog is rendered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(screen.queryByText(/Rating:/i)).not.toBeInTheDocument();
  });

  it('renders the "Write a Review" link correctly', () => {
    render(
      <Router>
        <Events />
      </Router>
    );

    const reviewLink = screen.getByRole('link', { name: /Write a Review/i });
    expect(reviewLink).toBeInTheDocument();
    expect(reviewLink).toHaveAttribute('href', '/blogs');
  });
});