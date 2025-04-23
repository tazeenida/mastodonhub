import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClubModal from '../components/clubsModal';
import '@testing-library/jest-dom';

const mockClub = {
  Title: 'Chess Club',
  PresidentName: 'John Doe',
  TreasurerName: 'Jane Smith',
  AdvisorName: 'Dr. Brown',
  Email: 'chessclub@example.com'
};

describe('ClubModal Component', () => {
  it('renders correctly when open and displays club details', () => {
    render(<ClubModal activeItem={mockClub} isOpen={true} toggle={jest.fn()} />);

    expect(screen.getByText(mockClub.Title)).toBeInTheDocument();
    expect(screen.getByText(`President: ${mockClub.PresidentName}`)).toBeInTheDocument();
    expect(screen.getByText(`Treasurer: ${mockClub.TreasurerName}`)).toBeInTheDocument();
    expect(screen.getByText(`AdvisorName: ${mockClub.AdvisorName}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockClub.Email}`)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ClubModal activeItem={mockClub} isOpen={false} toggle={jest.fn()} />);
    
    expect(screen.queryByText(mockClub.Title)).not.toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    const mockToggle = jest.fn();
    render(<ClubModal activeItem={mockClub} isOpen={true} toggle={mockToggle} />);

    fireEvent.click(screen.getByText('Close'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
