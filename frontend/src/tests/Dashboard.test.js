import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../components/FeaturedEvents', () => () => <div data-testid="featured-events" />);
jest.mock('../components/FeaturedClubs', () => () => <div data-testid="featured-clubs" />);
jest.mock('../images/header img.jpg', () => 'mock-header-img.jpg');

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders header image with correct alt text', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const headerImage = screen.getByAltText('Header');
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute('src', 'mock-header-img.jpg');
  });

  it('renders welcome message', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Welcome to MastodonHub/i);
    expect(screen.getByText(/Your gateway to campus life!/i)).toBeInTheDocument();
  });

  it('shows "Get Started" button when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('does not show "Get Started" button when user is authenticated', () => {
    localStorage.setItem('access_token', 'mock-token');

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Get Started/i)).not.toBeInTheDocument();
  });

  it('calls navigate to /signup when "Get Started" is clicked', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const button = screen.getByText(/Get Started/i);
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('calls navigate to /events when "View All" in Featured Events is clicked', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const button = screen.getAllByText(/View All →/i)[0];
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  it('calls navigate to /clubs when "View All" in Featured Clubs is clicked', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const button = screen.getAllByText(/View All →/i)[1];
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/clubs');
  });

  it('renders all stats correctly', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Total Events/i)).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();

    expect(screen.getByText(/Active Clubs/i)).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText(/This Week/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText(/New Clubs/i)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders FeaturedClubs and FeaturedEvents components', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByTestId('featured-clubs')).toBeInTheDocument();
    expect(screen.getByTestId('featured-events')).toBeInTheDocument();
  });
});
