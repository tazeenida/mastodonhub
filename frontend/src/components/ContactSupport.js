import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Send email using EmailJS
    emailjs
      .send('service_p2ufb6v', 'template_an5swcd', formData, 'XEnmDteQGfgktRQm3')
      .then(
        (response) => {
          setToast({
            message: 'Message sent successfully!',
            type: 'success'
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setToast({ message: '', type: '' }), 4000);
          setIsSubmitting(false);
        },
        (error) => {
          setToast({
            message: 'Failed to send the message. Please try again later.',
            type: 'error'
          });
          setTimeout(() => setToast({ message: '', type: '' }), 4000);
          setIsSubmitting(false);
        }
      );
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      {/* Larger Title at the top */}
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        marginTop: '30px',
        fontSize: '36px',
        fontWeight: 'bold'
      }}>
        Contact Support
      </h1>

      {/* Toast Notification */}
      {toast.message && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: toast.type === 'success' ? 'green' : 'red',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            zIndex: '1000',
            transition: 'opacity 0.5s ease',
          }}
        >
          {toast.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%',
          padding: '25px',
          borderRadius: '8px',
          backgroundColor: '#333',
          border: '2px solid rgb(207, 185, 145)',
          boxSizing: 'border-box'
        }}
      >
        <label style={{ marginBottom: '8px' }}>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '5px',
            width: '100%',  // Adjusted to account for padding
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            boxSizing: 'border-box'
          }}
          required
        />

        <label style={{ marginBottom: '8px' }}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '5px',
            width: '100%',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            boxSizing: 'border-box'
          }}
          required
        />
        
        <label style={{ marginBottom: '8px' }}>Subject:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          style={{
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '5px',
            width: '100%',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            boxSizing: 'border-box'
          }}
          required
        />

        <label style={{ marginBottom: '8px' }}>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '5px',
            width: 'calc(100% - 5px)',
            height: '150px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgb(207, 185, 145)',
            borderRadius: '5px',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            color: 'black',
            fontSize: '16px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactSupport;