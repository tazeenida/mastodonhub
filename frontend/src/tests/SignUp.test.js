import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../components/SignUp';
import axios from 'axios';
import { act } from 'react';

jest.mock('axios');

beforeEach(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  delete window.location;
  window.location = { href: jest.fn() };
});

describe('SignUp Component', () => {
  test('renders sign-up form with inputs and button', () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles successful form submission', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securepassword' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText('Signup successful! Redirecting...')).toBeInTheDocument());
  });

  test('displays error message on failed signup', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Email already exists' } } });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'securepassword' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText('Email already exists')).toBeInTheDocument());
  });
});
