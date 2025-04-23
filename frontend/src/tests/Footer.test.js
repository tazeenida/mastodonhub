import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for Link components
import Footer from '../components/Footer';


describe('Footer Component', () => {
  test('renders MastodonHub text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('MastodonHub')).toBeInTheDocument();
  });

  test('renders Description text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Your go-to event platform.')).toBeInTheDocument();
  });

  test('renders All Footer links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Support Team')).toBeInTheDocument();
    expect(screen.getByText('User Manual')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
  });

  test('footer links have correct href attributes', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Help Center')).toHaveAttribute('href', '/helpCenter');
    expect(screen.getByText('FAQs')).toHaveAttribute('href', '/faq');
    expect(screen.getByText('Support Team')).toHaveAttribute('href', '/supportTeam');
    expect(screen.getByText('User Manual')).toHaveAttribute('href', '/userManual');
    expect(screen.getByText('Contact Support')).toHaveAttribute('href', '/contactSupport');
  });
});
