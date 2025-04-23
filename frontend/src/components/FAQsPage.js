import React, { useState } from 'react';
import '../styles.css';

const FAQsPage = () => {
  // State to manage which FAQ item is expanded
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  // FAQ data
  const faqData = [
    {
      question: "What is MastodonHub?",
      answer: "MastodonHub is a platform for discovering and managing events and clubs. It allows users to explore various activities, join clubs, and participate in events that match their interests."
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the navigation bar. Fill in your details including name, email, and password, then submit the form. Once registered, you can log in and start using all features."
    },
    {
      question: "How do I join a club?",
      answer: "Browse through the clubs section on the dashboard or visit the dedicated Clubs page. When you find a club you're interested in, click on it and select the 'Join Club' button. You'll receive a confirmation once your request is processed."
    },
    {
      question: "Can I create my own event?",
      answer: "Yes! Once logged in, navigate to the Events section and click on 'Create Event'. Fill in the event details including title, description, date, time, and location. You can also upload an image for your event."
    },
    {
      question: "How do I contact support?",
      answer: "You can contact our support team through the 'Contact Support' link in the footer. Alternatively, you can visit the Help Center or submit a request through the Request Form."
    }
  ];

  return (
    <div className="faq-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'rgb(207, 185, 145)', 
        fontSize: '48px', 
        marginBottom: '40px',
        fontWeight: 'bold' 
      }}>
        FAQ's
      </h1>
      
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            className="faq-item" 
            style={{ 
              margin: '20px 0', 
              backgroundColor: 'white', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            <div 
              className="faq-question" 
              onClick={() => toggleFaq(index)}
              style={{ 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              <h3>{faq.question}</h3>
              <button 
                style={{ 
                  backgroundColor: expandedFaq === index ? '#e0be7e' : 'rgb(207, 185, 145)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                {expandedFaq === index ? '-' : '+'}
              </button>
            </div>
            
            {expandedFaq === index && (
              <div 
                className="faq-answer"
                style={{ 
                  padding: '0 20px 20px',
                  color: '#666',
                  borderTop: '1px solid #eee'
                }}
              >
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="faq-contact" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ color: 'white' }}>Can't find what you're looking for?</p>
        <a 
          href="/contactSupport" 
          style={{ 
            display: 'inline-block', 
            backgroundColor: 'rgb(207, 185, 145)', 
            color: 'black', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            textDecoration: 'none',
            marginTop: '10px',
            fontWeight: 'bold'
          }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQsPage;