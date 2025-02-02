// src/pages/Home.js

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import BlogList from '../components/BlogList'; // Import BlogList component

const Home = () => {
    // State to track the selected category in the sidebar
    const [selectedCategory, setSelectedCategory] = useState(null);

    // State to track the current search term
    const [searchTerm, setSearchTerm] = useState('');

    // State to track the current page number
    const [page, setPage] = useState(1);

    // State to track the total number of pages for pagination
    const [totalPages, setTotalPages] = useState(0);

    // State to track the loading state
    const [loading, setLoading] = useState(true);

    // Function to handle category selection from the Sidebar
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        // Reset search term when a new category is selected (uncomment if desired)
        setPage(1); // Reset to the first page when category changes
    };

    // Function to handle search input changes
    const handleSearch = (term) => {
        setSearchTerm(term);
        // Reset category when search term is changed (uncomment if desired)
        setPage(1); // Reset to the first page on search
    };

    // If data is loading, show a loader animation
    if (loading) {
        <div className='cmp-loader'> <div className="data-loader"></div></div>;
    }

    return (
        <div className='cmp-2-home'>
            <div className="cmp-container wcl-container">
                <div className="cmp2-row">
                    {/* Sidebar component for category selection and search */}
                    <div className="cmp2-col">
                        <Sidebar onCategoryChange={handleCategoryChange} onSearch={handleSearch} />
                    </div>

                    <div className="cmp2-col">
                        <main style={{ flex: 1 }}>
                            {/* BlogList component to display the blogs */}
                            <BlogList
                                selectedCategory={selectedCategory}
                                searchTerm={searchTerm}
                                page={page}
                                setPage={setPage} // Function to update the current page
                                setTotalPages={setTotalPages} // Function to update the total pages
                                setLoading={setLoading} // Function to update loading state
                            />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
