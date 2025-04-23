import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import Logout from '../components/Logout';

// Mock axios
jest.mock('axios');

// Mock window.location
const mockLocation = new URL('http://localhost');
delete window.location;
window.location = { href: mockLocation.href };

describe('Logout Component', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.location.href = mockLocation.href;
  });

  // Test successful logout
  test('successfully logs out user', async () => {
    // Mock successful axios response
    axios.post.mockResolvedValueOnce({});

    render(<Logout />);

    // Check if loading message is displayed
    expect(screen.getByText('Logging out...')).toBeInTheDocument();

    await waitFor(() => {
      // Verify axios was called with correct parameters
      expect(axios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/logout/',
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      // Verify localStorage was cleared
      expect(localStorage.length).toBe(0);

      // Verify redirect to login page
      expect(window.location.href).toBe('/login');
    });
  });

  // Test failed logout
  test('handles logout failure', async () => {
    // Mock failed axios response
    const errorMessage = 'Network Error';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    // Mock console.error and window.alert
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Logout />);

    await waitFor(() => {
      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));

      // Verify alert was shown
      expect(alertSpy).toHaveBeenCalledWith('Logout failed. Please try again.');

      // Verify localStorage wasn't cleared
      expect(localStorage.length).toBe(0);

      // Verify no redirect occurred
      expect(window.location.href).toBe(mockLocation.href);
    });

    // Clean up spies
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  // Test component cleanup
  test('performs cleanup on unmount', async () => {
    const { unmount } = render(<Logout />);
    
    unmount();

    // Add any cleanup assertions if you add cleanup functionality to your component
  });

  // Test localStorage interaction
  test('clears all items from localStorage', async () => {
    // Set some items in localStorage
    localStorage.setItem('testItem1', 'value1');
    localStorage.setItem('testItem2', 'value2');
    expect(localStorage.length).toBe(2);

    // Mock successful axios response
    axios.post.mockResolvedValueOnce({});

    render(<Logout />);

    await waitFor(() => {
      // Verify all items were cleared
      expect(localStorage.length).toBe(0);
    });
  });

  // Test HTTP headers
  test('sends correct headers with logout request', async () => {
    axios.post.mockResolvedValueOnce({});

    render(<Logout />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json"
          }
        })
      );
    });
  });
});