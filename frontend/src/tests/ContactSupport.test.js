import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactSupport from '../components/ContactSupport';
import emailjs from 'emailjs-com';

// Mock the emailjs library
jest.mock('emailjs-com', () => ({
  send: jest.fn()
}));

// First create an updated version of the component with title attributes
const UpdatedContactSupport = () => {
  const ContactComponent = ContactSupport();
  
  // Replace the input elements with ones that have title attributes
  const updatedComponent = React.cloneElement(ContactComponent, {}, 
    React.Children.map(ContactComponent.props.children, child => {
      if (child.type === 'form') {
        return React.cloneElement(child, {}, 
          React.Children.map(child.props.children, formChild => {
            if (formChild.type === 'input' && formChild.props.name === 'name') {
              return React.cloneElement(formChild, { title: 'Name Input' });
            } else if (formChild.type === 'input' && formChild.props.name === 'email') {
              return React.cloneElement(formChild, { title: 'Email Input' });
            } else if (formChild.type === 'input' && formChild.props.name === 'subject') {
              return React.cloneElement(formChild, { title: 'Subject Input' });
            } else if (formChild.type === 'textarea') {
              return React.cloneElement(formChild, { title: 'Message Input' });
            }
            return formChild;
          })
        );
      }
      return child;
    })
  );
  
  return updatedComponent;
};

describe('ContactSupport Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(<UpdatedContactSupport />);
    
    // Check if all form elements are rendered
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByTitle('Name Input')).toBeInTheDocument();
    expect(screen.getByTitle('Email Input')).toBeInTheDocument();
    expect(screen.getByTitle('Subject Input')).toBeInTheDocument();
    expect(screen.getByTitle('Message Input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  test('updates form fields when user types', () => {
    render(<UpdatedContactSupport />);
    
    // Get form fields by title
    const nameInput = screen.getByTitle('Name Input');
    const emailInput = screen.getByTitle('Email Input');
    const subjectInput = screen.getByTitle('Subject Input');
    const messageInput = screen.getByTitle('Message Input');
    
    // Simulate user typing
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Check if values are updated correctly
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('This is a test message');
  });

  test('displays success toast and clears form on successful submission', async () => {
    // Mock successful response
    emailjs.send.mockResolvedValueOnce({ status: 200 });
    
    render(<UpdatedContactSupport />);
    
    // Fill out the form using getByTitle
    const nameInput = screen.getByTitle('Name Input');
    const emailInput = screen.getByTitle('Email Input');
    const subjectInput = screen.getByTitle('Subject Input');
    const messageInput = screen.getByTitle('Message Input');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Check button state changes during submission
    expect(submitButton).toHaveTextContent('Sending...');
    expect(submitButton).toBeDisabled();
    
    // Verify emailjs was called with correct parameters
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_p2ufb6v',
      'template_an5swcd',
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      },
      'XEnmDteQGfgktRQm3'
    );
    
    // Wait for success toast to appear
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
    
    // Check if form is reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });
    
    // Check button returns to normal state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Send Message');
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('displays error toast on failed submission', async () => {
    // Mock failed response
    emailjs.send.mockRejectedValueOnce(new Error('Failed to send'));
    
    render(<UpdatedContactSupport />);
    
    // Fill out the form using getByTitle
    const nameInput = screen.getByTitle('Name Input');
    const emailInput = screen.getByTitle('Email Input');
    const subjectInput = screen.getByTitle('Subject Input');
    const messageInput = screen.getByTitle('Message Input');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Wait for error toast to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to send the message. Please try again later.')).toBeInTheDocument();
    });
    
    // Check button returns to normal state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Send Message');
      expect(submitButton).not.toBeDisabled();
    });
    
    // Form values should remain (not cleared) on error
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('This is a test message');
  });

  test('properly sends form data on submission', () => {
    // We need to fully mock the form submission to avoid validation issues
    emailjs.send.mockResolvedValueOnce({ status: 200 });
    
    render(<UpdatedContactSupport />);
    
    // Get form inputs by title
    const nameInput = screen.getByTitle('Name Input');
    const emailInput = screen.getByTitle('Email Input');
    const subjectInput = screen.getByTitle('Subject Input');
    const messageInput = screen.getByTitle('Message Input');
    
    // Fill form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Check if emailjs.send was called with correct data
    expect(emailjs.send).toHaveBeenCalledWith(
      'service_p2ufb6v',
      'template_an5swcd',
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      },
      'XEnmDteQGfgktRQm3'
    );
  });

  test('toast message disappears after timeout', async () => {
    // Mock the implementation of setTimeout
    jest.useFakeTimers();
    
    // Mock successful response
    emailjs.send.mockResolvedValueOnce({ status: 200 });
    
    render(<UpdatedContactSupport />);
    
    // Fill out the form using getByTitle
    const nameInput = screen.getByTitle('Name Input');
    const emailInput = screen.getByTitle('Email Input');
    const subjectInput = screen.getByTitle('Subject Input');
    const messageInput = screen.getByTitle('Message Input');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitButton);
    
    // Resolve the promise
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
    
    // Fast-forward time to trigger the toast timeout
    jest.advanceTimersByTime(4000);
    
    // Check that toast message is removed
    await waitFor(() => {
      expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
    });
    
    // Restore timers
    jest.useRealTimers();
  });
});