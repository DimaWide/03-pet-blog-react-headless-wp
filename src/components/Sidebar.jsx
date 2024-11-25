import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchCategories = async () => {
  const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/categories');
  return response.data;
};

const Sidebar = ({ onCategoryChange, onSearch }) => {
  const { data: categories, isLoading, error } = useQuery('categories', fetchCategories);
  
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    const newCategoryId = categoryId === activeCategory ? null : categoryId;
    setActiveCategory(newCategoryId);
    onCategoryChange(newCategoryId);
  };

  const handleSearch = (searchTerm) => {
    onSearch(searchTerm);
  };

  return (
    <aside className="cmp-7-sidebar w-full md:w-64 p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Категории</h2>
      {isLoading ? (
        <div className="text-gray-500 text-center py-4">Загрузка категорий...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">Ошибка при загрузке категорий</div>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${
                activeCategory === category.id
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

      <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-4">Поиск</h2>
      <input
        type="text"
        placeholder="Поиск..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </aside>
  );
};

export default Sidebar;
