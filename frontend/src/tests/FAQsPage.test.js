import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQsPage from '../components/FAQsPage';

describe('FAQsPage Component', () => {
  test('renders the FAQ page with correct title', () => {
    render(<FAQsPage />);
    expect(screen.getByText("FAQ's")).toBeInTheDocument();
  });

  test('renders all 5 FAQ questions', () => {
    render(<FAQsPage />);
    
    expect(screen.getByText("What is MastodonHub?")).toBeInTheDocument();
    expect(screen.getByText("How do I create an account?")).toBeInTheDocument();
    expect(screen.getByText("How do I join a club?")).toBeInTheDocument();
    expect(screen.getByText("Can I create my own event?")).toBeInTheDocument();
    expect(screen.getByText("How do I contact support?")).toBeInTheDocument();
  });

  test('FAQ answers are initially not in the document', () => {
    render(<FAQsPage />);
    
    // Using queryByText because we expect these elements not to exist
    expect(screen.queryByText("MastodonHub is a platform for discovering and managing events and clubs.")).not.toBeInTheDocument();
    expect(screen.queryByText("To create an account, click on the 'Sign Up' button")).not.toBeInTheDocument();
  });

  test('clicking on a question expands to show the answer', () => {
    render(<FAQsPage />);
    
    // Click on the first FAQ question
    fireEvent.click(screen.getByText("What is MastodonHub?"));
    
    // The answer should now be visible
    expect(screen.getByText(/MastodonHub is a platform for discovering and managing events and clubs/)).toBeInTheDocument();
  });

  test('clicking an expanded question collapses it', () => {
    render(<FAQsPage />);
    
    // Click to expand
    fireEvent.click(screen.getByText("What is MastodonHub?"));
    
    // Verify it expanded
    expect(screen.getByText(/MastodonHub is a platform for discovering and managing events and clubs/)).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(screen.getByText("What is MastodonHub?"));
    
    // Verify it's no longer in the document (not just invisible)
    expect(screen.queryByText(/MastodonHub is a platform for discovering and managing events and clubs/)).not.toBeInTheDocument();
  });

  test('only one FAQ can be expanded at a time', () => {
    render(<FAQsPage />);
    
    // Expand the first FAQ
    fireEvent.click(screen.getByText("What is MastodonHub?"));
    expect(screen.getByText(/MastodonHub is a platform for discovering and managing events and clubs/)).toBeInTheDocument();
    
    // Expand another FAQ
    fireEvent.click(screen.getByText("How do I create an account?"));
    
    // First FAQ should be collapsed (not in the document)
    expect(screen.queryByText(/MastodonHub is a platform for discovering and managing events and clubs/)).not.toBeInTheDocument();
    
    // Second FAQ should be expanded
    expect(screen.getByText(/To create an account, click on the 'Sign Up' button/)).toBeInTheDocument();
  });

  test('renders contact support section', () => {
    render(<FAQsPage />);
    
    expect(screen.getByText("Can't find what you're looking for?")).toBeInTheDocument();
    
    const contactLink = screen.getByText("Contact Support");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.tagName).toBe('A');
    expect(contactLink).toHaveAttribute('href', '/contactSupport');
  });

  test('expand/collapse buttons show correct +/- symbols', () => {
    render(<FAQsPage />);
    
    // Get all buttons (should be 5, one for each FAQ)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
    
    // Initially all buttons should show "+"
    buttons.forEach(button => {
      expect(button).toHaveTextContent('+');
    });
    
    // Click the first button
    fireEvent.click(buttons[0]);
    
    // First button should now show "-"
    expect(buttons[0]).toHaveTextContent('-');
    
    // Other buttons should still show "+"
    for (let i = 1; i < buttons.length; i++) {
      expect(buttons[i]).toHaveTextContent('+');
    }
  });
});