import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';

jest.mock('axios');

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  test('should handle successful login', async () => {
    const mockData = {
      access: 'fake-access-token',
      refresh: 'fake-refresh-token'
    };
    axios.post.mockResolvedValueOnce({ data: mockData });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe(mockData.access);
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/token/', // Corrected API URL
      expect.objectContaining({
        username: 'testuser',
        password: 'password123'
      }),
      expect.any(Object) // Any additional axios request config
    );
  });

  test('should handle login failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Login failed'));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter Username'), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });
});
