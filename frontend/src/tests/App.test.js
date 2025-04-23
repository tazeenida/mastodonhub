import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock axios to prevent import errors
jest.mock('axios');

// Mock components that use axios (optional, but makes testing easier)
jest.mock('../components/Navigation', () => () => <div>Navigation</div>);
jest.mock('../components/Footer', () => () => <div>Footer</div>);
jest.mock('../components/Dashboard', () => () => <div>Dashboard</div>);

describe('App Routing', () => {
  test('renders Navigation and Footer', () => {
    render(<App />); // No need to wrap in <BrowserRouter> if App already does that
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('renders Dashboard if logged in', () => {
    render(<App />); // Again, no need to wrap it here
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
