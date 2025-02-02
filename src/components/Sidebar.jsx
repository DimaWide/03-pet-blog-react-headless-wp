import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// Fetch categories from the API
const fetchCategories = async () => {
    const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/categories');
    return response.data;
};

const Sidebar = ({ onCategoryChange, onSearch }) => {
    // useQuery hook for fetching categories
    const { data: categories, isLoading, error } = useQuery('categories', fetchCategories);

    // State management
    const [activeCategory, setActiveCategory] = useState(null); // Currently selected category
    const [searchTerm, setSearchTerm] = useState(''); // Search term
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1200); // Determines if the view is mobile
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Determines if the category dropdown is open

    // Handle window resize to toggle mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle category click, toggle active category
    const handleCategoryClick = (categoryId) => {
        const newCategoryId = categoryId === activeCategory ? null : categoryId;
        setActiveCategory(newCategoryId); // Set the active category
        onCategoryChange(newCategoryId, searchTerm); // Call the passed function to update the category in the parent
        setIsDropdownOpen(false); // Close the dropdown after selecting a category
    };

    // Toggle the dropdown for mobile view
    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // Update search term
        onSearch(value, activeCategory); // Call the passed function to update search results in the parent
    };

    // Get the name of the selected category
    const selectedCategoryName = categories?.find((cat) => cat.id === activeCategory)?.name;

    return (
        <aside className="cmp-7-sidebar w-full md:w-64 p-5 bg-gray-100 rounded-lg shadow-md">
            {/* Category Section */}
            <h2 className="data-title text-2xl font-semibold text-gray-700 mb-4">Categories</h2>
            {isLoading ? (
                <div className="text-gray-500 text-center py-4">Loading categories...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-4">Error loading categories</div>
            ) : isMobileView ? (
                // Mobile View: Dropdown for categories
                <div className="data-cats relative">
                    <div
                        className={`data-cats-main cursor-pointer w-full p-3 border border-gray-300 bg-white flex justify-between items-center ${isDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
                        onClick={handleDropdownToggle}
                    >
                        <span>{selectedCategoryName || 'All categories'}</span>
                        {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {isDropdownOpen && (
                        <ul className="absolute w-full mt-0 p-3 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-md z-10">
                            <li
                                onClick={() => handleCategoryClick(null)}
                                className={`px-3 py-2 cursor-pointer  transition-colors ${activeCategory === null ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                            >
                                All categories
                            </li>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`px-3 py-2 cursor-pointer  transition-colors ${activeCategory === category.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                // Desktop View: List of categories
                <ul className="space-y-2">
                    <li
                        onClick={() => handleCategoryClick(null)}
                        className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${activeCategory === null
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:text-blue-500 hover:bg-gray-200'}`}
                    >
                        <span className="flex-1">All categories</span>
                        {activeCategory === null && <span className="text-white ml-2">✔</span>}
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${activeCategory === category.id
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:text-blue-500 hover:bg-gray-200'}`}
                        >
                            <span className="flex-1">{category.name}</span>
                            {activeCategory === category.id && <span className="text-white ml-2">✔</span>}
                        </li>
                    ))}
                </ul>
            )}

            <hr className="my-4 border-gray-300" />

            {/* Search Section */}
            <h2 className="data-title text-2xl font-semibold text-gray-700 mt-4 mb-4">Search</h2>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </aside>
    );
};

export default Sidebar;
