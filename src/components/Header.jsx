import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null); // Сохраняем данные пользователя
    const navigate = useNavigate();

    // Проверка авторизации при монтировании компонента
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);

            // Получаем данные пользователя через API
            axios
                .get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setUserInfo({
                        name: response.data.name, // Имя пользователя
                        avatar: response.data.avatar_urls?.['96'], // Аватарка 96x96
                    });
                })
                .catch((err) => {
                    console.error('Error fetching user data:', err);
                    setIsAuthenticated(false);
                });
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        // Удаляем токены из localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        
        setIsAuthenticated(false);
        setUserInfo(null);

        // Перенаправление на главную страницу
        navigate('/');
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
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="hover:text-blue-300">Login</Link>
                            <Link to="/register" className="hover:text-blue-300">Register</Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                                       <button
                                onClick={handleLogout}
                                className="data-logout hover:text-blue-300 text-sm"
                            >
                                Logout
                            </button>
                            
                            {/* Аватар пользователя */}
                            {userInfo?.avatar && (
                                <img
                                    src={userInfo.avatar}
                                    alt={`${userInfo.name}'s avatar`}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                />
                            )}
                            {/* Имя пользователя */}
                            <span className="text-white font-medium">{userInfo?.name}</span>
                            {/* Кнопка выхода */}
                 
                        </div>
                    )}
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
                <nav className="data-menu-btn mod-mobile md:hidden bg-blue-700 py-4">
                    <ul className="flex flex-col space-y-2 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-300 transition duration-300">
                                Home
                            </Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/login" className="hover:text-blue-300 transition duration-300">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="hover:text-blue-300 transition duration-300">
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="text-center">
                                {/* Аватар и имя в мобильном меню */}
                                {userInfo?.avatar && (
                                    <img
                                        src={userInfo.avatar}
                                        alt={`${userInfo.name}'s avatar`}
                                        className="w-10 h-10 rounded-full mx-auto mb-2"
                                    />
                                )}
                                <span className="text-white font-medium">{userInfo?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-blue-300 text-sm mt-2"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
