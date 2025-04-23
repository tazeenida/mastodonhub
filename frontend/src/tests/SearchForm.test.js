import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../components/SearchForm';
import { act } from 'react';


jest.mock('../components/MusicEvents', () => () => <div data-testid="music-events" />);
jest.mock('../components/ArtEvents', () => () => <div data-testid="art-events" />);
jest.mock('../components/WorkshopEvent', () => () => <div data-testid="workshop-events" />);
jest.mock('../components/SportsEvents', () => () => <div data-testid="sports-events" />);

describe('SearchForm Component', () => {
  test('renders form with category select and search button', () => {
    render(<SearchForm />);
    expect(screen.getByLabelText('Choose a category:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  test('displays MusicEvents when Music is selected and form is submitted', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText('Choose a category:'), { target: { value: 'Music' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByTestId('music-events')).toBeInTheDocument();
  });

  test('displays ArtEvents when Art is selected and form is submitted', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText('Choose a category:'), { target: { value: 'Art' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByTestId('art-events')).toBeInTheDocument();
  });

  test('displays WorkshopEvents when Workshops is selected and form is submitted', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText('Choose a category:'), { target: { value: 'Workshops' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByTestId('workshop-events')).toBeInTheDocument();
  });

  test('displays SportsEvents when Sports is selected and form is submitted', () => {
    render(<SearchForm />);
    fireEvent.change(screen.getByLabelText('Choose a category:'), { target: { value: 'Sports' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByTestId('sports-events')).toBeInTheDocument();
  });

  test('does not display any events when no category is selected', () => {
    render(<SearchForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.queryByTestId('music-events')).not.toBeInTheDocument();
    expect(screen.queryByTestId('art-events')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workshop-events')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sports-events')).not.toBeInTheDocument();
  });
});
