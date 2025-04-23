import React from 'react';
import '../styles.css';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const SupportTeam = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Customer Support Lead",
      description: "With over 8 years of experience in customer support, Sarah ensures your issues are resolved promptly and efficiently.",
      image: "/Woman1.jpg" // Replace with your actual image path
    },
    {
      name: "David Chen",
      role: "Community Manager",
      description: "David oversees our community guidelines and helps maintain a positive experience for all MastodonHub users.",
      image: "/Man1.jpg" // Replace with your actual image path
    },
    {
      name: "Emma Wilson",
      role: "Event Support Coordinator",
      description: "Emma specializes in helping event organizers make the most of our platform features for successful events.",
      image: "/Woman2.jpg" // Replace with your actual image path
    },
    {
        name: "Alex Rivera",
        role: "Technical Support Specialist",
        description: "Alex is our technical guru who can help you navigate through any technical challenges you might face with our platform.",
        image: "/Man2.jpg" // Replace with your actual image path
    },
  ];

  return (
    <div className="support-team-container" style={{ backgroundColor: 'black', color: 'white', padding: '40px 20px' }}>
      <div className="support-team-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '40px', 
          fontWeight: 'bold', 
          color: 'white',
          marginBottom: '20px' 
        }}>
          Experienced & Professional Team
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#aaa', 
          maxWidth: '800px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          You can rely on our amazing support team and customer services to ensure 
          you have a great experience with MastodonHub without any doubt and in no time.
        </p>
      </div>

      <div className="support-team-members" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member" style={{ 
            width: '250px',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div className="team-member-image" style={{ 
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 20px',
              border: '5px solid rgb(207, 185, 145)'
            }}>
              <img 
                src={member.image} 
                alt={member.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              {member.name}
            </h3>
            
            <p style={{ 
              fontSize: '16px', 
              color: 'rgb(207, 185, 145)',
              marginBottom: '15px'
            }}>
              {member.role}
            </p>
            
            <p style={{ 
              fontSize: '14px', 
              color: '#aaa',
              lineHeight: '1.5',
              marginBottom: '20px'
            }}>
              {member.description}
            </p>
            
            <div className="social-icons" style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}>
              <a href="#" style={{ color: '#aaa' }}>
                <Facebook size={20} />
              </a>
              <a href="#" style={{ color: '#aaa' }}>
                <Twitter size={20} />
              </a>
              <a href="#" style={{ color: '#aaa' }}>
                <Instagram size={20} />
              </a>
              <a href="#" style={{ color: '#aaa' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="support-team-contact" style={{ 
        textAlign: 'center',
        marginTop: '30px',
        padding: '30px 0',
        borderTop: '1px solid rgb(207, 185, 145)'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          color: 'rgb(207, 185, 145)'
        }}>
          Need Help? Contact Our Support Team
        </h2>
        
        <p style={{ 
          fontSize: '16px', 
          color: '#aaa',
          maxWidth: '600px',
          margin: '0 auto 20px'
        }}>
          Our team is available 24/7 to assist you with any questions or issues you may have.
        </p>
        
        <Link 
          to="/contactSupport" 
          style={{
            display: 'inline-block',
            padding: '10px 30px',
            backgroundColor: 'rgb(207, 185, 145)',
            color: 'black',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default SupportTeam;