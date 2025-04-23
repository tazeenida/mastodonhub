import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ClubsModal from './clubsModal';  // Fixed capitalization
import ClubsFilter from './clubsFilter';
import '../styles.css';
import clubsBanner from '../images/clubsBanner.jpg';

const backendUrl = 'http://127.0.0.1:8000';

function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeItem, setActiveItem] = useState({});
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchClubs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${backendUrl}/api/mastodonhub/clubs/`);
                setClubs(response.data);
                setFilteredClubs(response.data);
            } catch (error) {
                setError(error);
                console.error('Error fetching clubs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const handleFilterChange = (selectedCategory, searchTerm) => {
        let filtered = clubs;

        console.log('Selected Category:', selectedCategory);  // Debugging
        console.log('Search Term:', searchTerm);  // Debugging

        // Filter by category
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter((club) => club.Category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm && searchTerm.trim() !== '') {
            filtered = filtered.filter((club) =>
                club.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        console.log('Filtered Clubs:', filtered);  // Debugging
        setFilteredClubs(filtered);
    };

    const handleClubsClick = (club) => {
        console.log('Opening modal for', club);  // Debugging
        setActiveItem(club);
        setModal(true);
    };

    return (
        <main>
            <section id="Banner">
                <img src={clubsBanner} alt="Header" width="100%" height="400px" />
                <div className="Clubs-Banner">Discover exciting Clubs with MastodonHub</div>
            </section>
            <section id="FeaturedClubs" className="featured-events-section">
                <section>
                    <ClubsFilter onFilterChange={handleFilterChange} />
                </section>
                <section className="filtered-results" style={{ margin: '20px' }}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <div id="Clubs-container">
                            {filteredClubs.map((club) => (
                                <div key={club.id} className="Events-item" onClick={() => handleClubsClick(club)}>
                                    <div>
                                        <img
                                            className="event-images"
                                            src={club.ImageUrl || 'path/to/fallback/image.jpg'}
                                            alt={club.Title || 'Club Image'}
                                            style={{ width: '200px', height: '200px' }}
                                            onError={(e) => { e.target.src = 'path/to/fallback/image.jpg'; }}
                                        />
                                        <div className="event-title">{club.Title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </section>
            {console.log('Modal State:', modal)}  {/* Debugging */}
            <ClubsModal isOpen={modal} toggle={() => setModal(false)} activeItem={activeItem} />
        </main>
    );
}

export default ClubsPage;