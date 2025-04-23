import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClubsFilter from '../components/ClubsFilter';

describe('ClubsFilter Component', () => {
  it('renders correctly with hardcoded categories', () => {
    render(<ClubsFilter onFilterChange={jest.fn()} />);

    // Ensure the dropdown contains the correct options
    const options = screen.getAllByRole('option').map((o) => o.textContent);
    expect(options).toContain('All');
    expect(options).toContain('Sports');
    expect(options).toContain('Academic');
    expect(options).toContain('Cultural');
  });

  it('calls onFilterChange with correct category when selection changes', () => {
    const mockOnFilterChange = jest.fn();
    render(<ClubsFilter onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Filter by Category:/i), {
      target: { value: 'Sports' }
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith('Sports', '');

    fireEvent.change(screen.getByLabelText(/Filter by Category:/i), {
      target: { value: 'Academic' }
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith('Academic', '');
  });

  it('calls onFilterChange with "All" when reset', () => {
    const mockOnFilterChange = jest.fn();
    render(<ClubsFilter onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Filter by Category:/i), {
      target: { value: 'All' }
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith('All', '');
  });

  it('handles search input change', () => {
    const mockOnFilterChange = jest.fn();
    render(<ClubsFilter onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByPlaceholderText('Search clubs...'), {
      target: { value: 'Coding' }
    });

    expect(mockOnFilterChange).toHaveBeenCalledWith('All', 'Coding');
  });
});
