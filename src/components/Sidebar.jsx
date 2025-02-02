import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'; // Импорт стрелок

const fetchCategories = async () => {
    const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/categories');
    return response.data;
};

const Sidebar = ({ onCategoryChange, onSearch }) => {
    const { data: categories, isLoading, error } = useQuery('categories', fetchCategories);

    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1200);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 1200);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCategoryClick = (categoryId) => {
        const newCategoryId = categoryId === activeCategory ? null : categoryId;
        setActiveCategory(newCategoryId);
        onCategoryChange(newCategoryId, searchTerm); // Передаем категорию и поисковый запрос
        setIsDropdownOpen(false); // Закрываем список при выборе
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value, activeCategory); // Передаем поисковый запрос и выбранную категорию
    };

    const selectedCategoryName = categories?.find((cat) => cat.id === activeCategory)?.name;

    return (
        <aside className="cmp-7-sidebar w-full md:w-64 p-5 bg-gray-100 rounded-lg shadow-md">
            <h2 className="data-title text-2xl font-semibold text-gray-700 mb-4">Категории</h2>
            {isLoading ? (
                <div className="text-gray-500 text-center py-4">Загрузка категорий...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-4">Ошибка при загрузке категорий</div>
            ) : isMobileView ? (
                // Кастомный селект для мобильных
                <div className="data-cats relative">
                    <div
                        className={`data-cats-main cursor-pointer w-full p-3 border border-gray-300 bg-white flex justify-between items-center ${isDropdownOpen ? 'rounded-t-lg' : 'rounded-lg'
                            }`}
                        onClick={handleDropdownToggle}
                    >
                        <span>{selectedCategoryName || 'Все категории'}</span>
                        {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </div>
                    {isDropdownOpen && (
                        <ul className="absolute w-full mt-0 p-3 bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-md z-10">
                            <li
                                onClick={() => handleCategoryClick(null)}
                                className={`px-3 py-2 cursor-pointer  transition-colors ${activeCategory === null ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                                    }`}
                            >
                                Все категории
                            </li>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`px-3 py-2 cursor-pointer  transition-colors ${activeCategory === category.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                // Список категорий для десктопной версии
                <ul className="space-y-2">
                    <li
                        onClick={() => handleCategoryClick(null)}
                        className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${activeCategory === null
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:text-blue-500 hover:bg-gray-200'
                            }`}
                    >
                        <span className="flex-1">Все категории</span>
                        {activeCategory === null && <span className="text-white ml-2">✔</span>}
                    </li>
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${activeCategory === category.id
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 hover:text-blue-500 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex-1">{category.name}</span>
                            {activeCategory === category.id && <span className="text-white ml-2">✔</span>}
                        </li>
                    ))}
                </ul>
            )}

            <hr className="my-4 border-gray-300" />

            <h2 className="data-title text-2xl font-semibold text-gray-700 mt-4 mb-4">Поиск</h2>
            <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </aside>
    );
};

export default Sidebar;
