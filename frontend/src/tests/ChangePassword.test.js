import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePassword from '../components/ChangePassword';
import axios from 'axios';

// Mock axios post request
jest.mock('axios');

describe('ChangePassword Component', () => {
  it('renders the ChangePassword form correctly', () => {
    render(<ChangePassword />);

    // Use getByPlaceholderText to query inputs
    expect(screen.getByPlaceholderText(/Enter current password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter new password/i)).toBeInTheDocument();
    
    // Specifically query the <h3> title for "Change Password"
    expect(screen.getByRole('heading', { name: /Change Password/i })).toBeInTheDocument();
  });

  it('displays a success message when password change is successful', async () => {
    // Mock a successful password change response
    axios.post.mockResolvedValue({ data: { message: 'Password changed successfully' } });

    render(<ChangePassword />);

    fireEvent.change(screen.getByPlaceholderText(/Enter current password/i), {
      target: { value: 'old-password' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter new password/i), {
      target: { value: 'new-password' },
    });

    // Use getByRole to query the button
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await waitFor(() => expect(screen.getByText(/Password changed successfully/i)).toBeInTheDocument());
  });

  it('displays an error message when password change fails', async () => {
    // Mock an error response
    axios.post.mockRejectedValue({ response: { data: { error: 'Password change failed' } } });

    render(<ChangePassword />);

    fireEvent.change(screen.getByPlaceholderText(/Enter current password/i), {
      target: { value: 'wrong-password' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter new password/i), {
      target: { value: 'new-password' },
    });

    // Use getByRole to query the button
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    await waitFor(() => expect(screen.getByText(/Password change failed/i)).toBeInTheDocument());
  });
});
