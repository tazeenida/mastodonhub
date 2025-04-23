import React, { useState } from 'react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  
  const helpArticles = [
    {
      id: 'getting-started',
      title: 'Getting Started with MastodonHub',
      content: 'Learn how to create your account, set up your profile, and start discovering clubs and events at Purdue University Fort Wayne.',
      fullContent: `
        <h2>Getting Started with MastodonHub</h2>
        
        <h3>Creating Your Account</h3>
        <p>To create your MastodonHub account and start exploring PFW clubs and events:</p>
        <ol>
          <li>Click on the "Sign Up" button in the navigation bar</li>
          <li>Use your Purdue email address (@pfw.edu) to register</li>
          <li>Enter Username, email, and password.</li>
          <li>Once successful, you will be redirected to the login page</li>
        </ol>
        
        <h3>Setting Up Your Profile</h3>
        <p>To Customize your profile:</p>
        <ul>
          <li>Add your profile picture by choosing the image and clicking on Update Profile Picture</li>
          <li>Click on Edit Profile to enter your First Name and Last Name</li>
          <li>Enter Security Question Details for password reset</li>
        </ul>
        
        <h3>Navigating the Dashboard</h3>
        <p>Your dashboard is your hub for everything happening at PFW:</p>
        <ul>
          <li>View upcoming events</li>
          <li>See recommended clubs based on your interests</li>
          <li>Check the latest announcements from clubs</li>
          <li>Add Events to your calendar!</li>
        </ul>
      `
    },
    {
      id: 'find-clubs',
      title: 'Finding and Joining Clubs',
      content: 'Discover how to search for clubs at PFW, view detailed information, and join the ones that interest you.',
      fullContent: `
        <h2>Finding and Joining Clubs</h2>
        
        <h3>Searching for Clubs</h3>
        <p>MastodonHub makes it easy to find clubs that match your interests:</p>
        <ol>
          <li>Navigate to the "Clubs" section from the main menu</li>
          <li>Use filters to narrow down by category (Academic, Cultural, Sports, etc.)</li>
          <li>Search by keywords related to your interests</li>
        </ol>
        
        <h3>Club Information Pages</h3>
        <p>Each club has a detailed page with important information:</p>
        <ul>
          <li>Club description and mission statement</li>
          <li>Meeting times and locations</li>
          <li>Current leadership and contact information</li>
          <li>Upcoming events hosted by the club</li>
          <li>Photos from past activities and events</li>
        </ul>
      `
    },
    {
      id: 'discover-events',
      title: 'Discovering Campus Events',
      content: 'Learn how to find upcoming events at Purdue Fort Wayne, add them to your calendar, and receive reminders.',
      fullContent: `
        <h2>Discovering Campus Events</h2>
        
        <h3>Browsing Events</h3>
        <p>Find events happening around PFW campus:</p>
        <ol>
          <li>Go to the "Events" section from the main navigation</li>
          <li>Filter events by category such as Music, Sports, Art, Workshops...</li>
        </ol>
        
        <h3>Event Details</h3>
        <p>Each event listing provides comprehensive information:</p>
        <ul>
          <li>Event name, date, time, and location</li>
          <li>Description and purpose of the event</li>
          <li>Hosting club or organization</li>
          <li>Registration requirements (if any)</li>
          <li>Cost information (most campus events are free for students)</li>
        </ul>
        
        <h3>Saving and Managing Events</h3>
        <p>Keep track of events you're interested in:</p>
        <ul>
          <li>Click "Add Event" to save it to your account</li>
          <li>Make sure to refresh the page to see your saved events below!!!</li>
          <li>Add events to your device calendar with one click</li>
        </ul>
      `
    },
    {
      id: 'tech-support',
      title: 'Technical Support',
      content: 'Get help with technical issues related to your MastodonHub account or using the platform.',
      fullContent: `
        <h2>Technical Support</h2>
        
        <h3>Common Issues</h3>
        <p>Solutions for frequently encountered problems:</p>
        <ul>
          <li>Login issues: Try resetting your password or clearing browser cache</li>
          <li>Event not showing on calendar: Make sure you've saved the event</li>
        </ul>
        
        <h3>Contacting Support</h3>
        <p>Get additional help if needed:</p>
        <ul>
          <li>Email support@mastodonhub.pfw.edu</li>
          <li>Submit a help ticket through the "Contact Support" link</li>
          <li>Visit the IT Services Help Desk in Kettler Hall, Room G21</li>
          <li>Call the support line at (260) 481-6030</li>
        </ul>
        
        <h3>Feedback and Suggestions</h3>
        <p>Help improve MastodonHub:</p>
        <ul>
          <li>Submit feature requests or suggestions through the Suggestion form</li>
          <li>Report bugs or issues using the Contact Support link</li>
          <li>Submit a Request through the Request Form Link to influence future updates</li>
          <li>Join the MastodonHub Student Advisory Group</li>
        </ul>
      `
    },
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      content: 'Find answers to common questions about using MastodonHub to discover and engage with clubs and events at PFW.',
    }
  ];
  
  const [filteredArticles, setFilteredArticles] = useState(helpArticles);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const results = helpArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) || 
      article.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredArticles(results);
  };

  const handleArticleClick = (id) => {
    // Special handling for FAQ
    if (id === 'faqs') {
      // Redirect to FAQ page
      window.location.href = '/faq';
    } else {
      // Normal behavior for other articles
      setActiveArticle(id);
    }
  };

  const handleBackToList = () => {
    setActiveArticle(null);
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: 'black', color: 'white' }}>
      {/* Help Center Title */}
      <h1 style={{ textAlign: 'center', fontSize: '40px', color: 'rgb(207, 185, 145)', marginBottom: '20px' }}>
        MastodonHub Help Center
      </h1>

      {/* Back button when viewing an article */}
      {activeArticle && (
        <div style={{ maxWidth: '1000px', margin: '0 auto 20px' }}>
          <button 
            onClick={handleBackToList}
            style={{
              padding: '10px 15px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Back to Help Articles
          </button>
        </div>
      )}

      {/* Search Bar - Only show when not viewing an article */}
      {!activeArticle && (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for help articles..."
            style={{
                padding: '10px',
                width: '100%',
                maxWidth: '600px',
                fontSize: '16px',
                border: '1px solid #444',
                borderRadius: '5px',
                backgroundColor: '#222',
                color: 'white'
              }}
            />
          </div>
        )}
  
        {/* Main Content */}
        <div style={{ maxWidth: '1000px', margin: '20px auto' }}>
          {/* Article List View */}
          {!activeArticle && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', justifyItems: 'center' }}>
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <div 
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    style={{
                      padding: '20px',
                      backgroundColor: '#222',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      border: '1px solid #444',
                      ':hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <h3 style={{ color: 'rgb(207, 185, 145)', marginTop: 0 }}>{article.title}</h3>
                    <p style={{ color: '#ccc' }}>{article.content}</p>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p>No articles found matching "{searchQuery}". Try another search term.</p>
                </div>
              )}
            </div>
          )}
  
          {/* Article Detail View */}
          {activeArticle && (
            <div style={{ 
              backgroundColor: '#222', 
              padding: '30px', 
              borderRadius: '8px',
              border: '1px solid #444'
            }}>
              {helpArticles.find(article => article.id === activeArticle) && (
                <div dangerouslySetInnerHTML={{ 
                  __html: helpArticles.find(article => article.id === activeArticle).fullContent 
                }} />
              )}
            </div>
          )}
        </div>
  
        <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #444', paddingTop: '20px' }}>
          <p>Can't find what you're looking for? <a href="/contactSupport" style={{ color: 'rgb(207, 185, 145)' }}>Contact Support</a></p>
        </div>
      </div>
    );
  };
  
  export default HelpCenter;
  