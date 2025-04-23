import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

jest.mock('axios');

// Suppress console error logs during expected failures
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Navigation Component', () => {
  test('renders main navigation links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText('MastodonHub')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Clubs')).toBeInTheDocument();
    expect(screen.getByText('Request Form')).toBeInTheDocument();
    expect(screen.getByText('Have a comment?')).toBeInTheDocument();
  });

  test('shows Signup and Login when not authenticated', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows username and logout when authenticated', async () => {
    localStorage.setItem('access_token', 'mock_token');
    axios.get.mockResolvedValueOnce({ data: { is_admin: false } });
    axios.get.mockResolvedValueOnce({ data: { username: 'maha' } });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(await screen.findByText(/maha/i)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders fallback profile icon with first letter of username', async () => {
    localStorage.setItem('access_token', 'mock_token');
    axios.get.mockResolvedValueOnce({ data: { is_admin: false } });
    axios.get.mockResolvedValueOnce({ data: { username: 'Mahi' } });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(await screen.findByText('M')).toBeInTheDocument(); // fallback avatar
  });

  test('renders profile image if profile_picture_url exists', async () => {
    localStorage.setItem('access_token', 'mock_token');
    axios.get.mockResolvedValueOnce({ data: { is_admin: false } });
    axios.get.mockResolvedValueOnce({
      data: {
        username: 'maha',
        profile_picture_url: '/media/user/profile.jpg',
      },
    });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const image = await screen.findByAltText('Profile');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('http://127.0.0.1:8000/media/user/profile.jpg');
  });

  test('shows admin links when user is admin', async () => {
    localStorage.setItem('access_token', 'mock_token');
    axios.get.mockResolvedValueOnce({ data: { is_admin: true } });
    axios.get.mockResolvedValueOnce({ data: { username: 'admin' } });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(await screen.findByText('Admin: Clubs')).toBeInTheDocument();
    expect(await screen.findByText('Admin: Events')).toBeInTheDocument();
  });

  test('falls back to localStorage role if admin API call fails', async () => {
    localStorage.setItem('access_token', 'mock_token');
    localStorage.setItem('user_role', 'admin');

    axios.get.mockRejectedValueOnce(new Error('API error')); // check-admin
    axios.get.mockResolvedValueOnce({ data: { username: 'maha' } }); // profile

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(await screen.findByText('Admin: Clubs')).toBeInTheDocument();
    expect(await screen.findByText('Admin: Events')).toBeInTheDocument();
  });
});

