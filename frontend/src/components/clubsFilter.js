import React, { useState } from 'react';

function ClubsFilter({ onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        onFilterChange(category, searchTerm);
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        onFilterChange(selectedCategory, term);
    };

    return (
        <div style={{ margin: '20px', textAlign: 'center' }}>
            <div>
                <label htmlFor="categoryFilter">Filter by Category:</label>
                <select 
                    id="categoryFilter" 
                    onChange={handleCategoryChange} 
                    value={selectedCategory}
                    style={{ marginLeft: '10px', padding: '5px' }}
                >
                    <option value="All">All</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                </select>
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ padding: '5px', width: '300px' }}
                />
            </div>
        </div>
    );
}

export default ClubsFilter;