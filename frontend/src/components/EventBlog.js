import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    rating: 5,
    eventId: ''
  });
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/mastodonhub/events/');
        const data = await response.json();
        setEvents(data);
        
        const blogsResponse = await fetch('http://127.0.0.1:8000/api/mastodonhub/blogs/');
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {  // Removed async
    e.preventDefault();
    console.log('Form submitted');  // Debug log
    
    // Show alert immediately
    alert('Review Successfully Posted!');
    
    // Navigate to dashboard
    console.log('Navigating to dashboard');  // Debug log
    navigate('/Dashboard');
  };

  return (
    <div>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit} style={{ backgroundColor: 'rgb(207, 185, 145)' }}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title" style={{ color: 'black' }}>Write a Review</h3>
            
            <div className="form-group mt-3">
              <label style={{ color: 'black' }}>Select Event</label>
              <select 
                className="form-control"
                value={newBlog.eventId}
                onChange={(e) => setNewBlog({...newBlog, eventId: e.target.value})}
                required
              >
                <option value="">Art Exhibition: Modern Masters</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.Title}</option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label style={{ color: 'black' }}>Title</label>
              <input 
                type="text"
                className="form-control"
                placeholder="Enter review title"
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label style={{ color: 'black' }}>Your Review</label>
              <textarea 
                className="form-control"
                rows="4"
                placeholder="Share your experience..."
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label style={{ color: 'black' }}>Rating (1-5 stars)</label>
              <input 
                type="number"
                min="1"
                max="5"
                className="form-control"
                value={newBlog.rating}
                onChange={(e) => setNewBlog({...newBlog, rating: parseInt(e.target.value)})}
                required
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button 
                type="submit" 
                className="btn" 
                style={{ backgroundColor: 'black', color: 'white' }}
                onClick={() => console.log('Button clicked')}  // Debug log
              >
                Post Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventBlog;