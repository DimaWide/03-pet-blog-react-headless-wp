// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="cmp-4-header bg-blue-600 text-white shadow-md">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                {/* Логотип */}
                <div className="text-2xl font-bold">
                    <Link to="/">WP Blog</Link>
                </div>

                {/* Навигация для больших экранов */}
                <nav className="data-menu hidden md:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-blue-300">Home</Link>
                    <Link to="/login" className="hover:text-blue-300">Login</Link>
                    <Link to="/register" className="hover:text-blue-300">Register</Link>
                </nav>

                {/* Кнопка для мобильного меню */}
                <div className="data-menu-btn md:hidden">
                    <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                        {isMobileMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <nav className="data-menu-btn md:hidden bg-blue-700 py-4">
                    <ul className="flex flex-col space-y-2 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-300 transition duration-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-blue-300 transition duration-300">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-blue-300 transition duration-300">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-blue-300 transition duration-300">
                                Categories
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
