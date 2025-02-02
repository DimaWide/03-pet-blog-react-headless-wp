// src/pages/Home.js

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BlogList from '../components/BlogList';
import Pagination from '../components/Pagination';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // State for total pages
    const [loading, setLoading] = useState(true); // State for loading

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        //  setSearchTerm(''); // Reset search when selecting a category
        setPage(1); // Reset to the first page
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        //  setSelectedCategory(null); // Reset category on search
        setPage(1); // Reset to the first page
    };

    if (loading) {
       <div className='cmp-loader'> <div class="data-loader"></div></div>;
    }

    return (
        <div className='cmp-2-home'>
            <div className="cmp-container wcl-container">
                <div className="cmp2-row">
                    <div className="cmp2-col">
                        <Sidebar onCategoryChange={handleCategoryChange} onSearch={handleSearch} />
                    </div>

                    <div className="cmp2-col">
                        <main style={{ flex: 1 }}>
                            <BlogList
                                selectedCategory={selectedCategory}
                                searchTerm={searchTerm}
                                page={page}
                                setPage={setPage}
                                setTotalPages={setTotalPages} // Pass setTotalPages function to BlogList
                                setLoading={setLoading} // Передаем функцию для управления загрузкой
                            />

                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
