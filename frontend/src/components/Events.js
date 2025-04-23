import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import banner_event from '../images/banner (2).jpg';
import SearchForm from './SearchForm';
import YourEvents from './YourEvents';
import FeaturedEvents from './FeaturedEvents';
import axios from 'axios';

const Events = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsResponse = await fetch('http://127.0.0.1:8000/api/mastodonhub/blogs/');
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);
  
  return (
    <div>
      <section id="Banner">
        <img src={banner_event} alt="banner_event" width="100%" height="400px" />
      </section>
      <div className="Events-Banner">Discover exciting events with MastodonHub!</div>
      <FeaturedEvents/>
      <SearchForm/>
      <YourEvents/>

      {/* Event Reviews Section */}
      <section id="FeaturedEvents" className="featured-events-section">
        <header className="flex justify-between items-center">
          <h1 style={{ color: 'white' }}>Event Reviews</h1>
          <Link to="/blogs" className="clear-event" style={{color: 'black'}}>
            Write a Review
          </Link>
        </header>
        <div className="events-container">
          {blogs.map((blog) => (
            <div key={blog.id} className="event">
              <div className="event-title">{blog.title}</div>
              <div className="event-description">{blog.content}</div>
              <div className="event-date">Rating: {blog.rating}/5 ⭐</div>
              <div className="event-time">
                Posted: {new Date(blog.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;