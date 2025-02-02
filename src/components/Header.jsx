import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
    // State variables for mobile menu visibility, authentication status, and user info
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null); // Store user information (name and avatar)
    const navigate = useNavigate(); // Hook for navigation after logout

    // useEffect hook to check authentication status and fetch user data on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
        if (token) {
            setIsAuthenticated(true); // Set authentication status to true if token exists

            // Make an API call to get user data if the token is available
            axios
                .get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
                    headers: { Authorization: `Bearer ${token}` }, // Include the token in the authorization header
                })
                .then((response) => {
                    // On successful response, store user data
                    setUserInfo({
                        name: response.data.name, // Store user's name
                        avatar: response.data.avatar_urls?.['96'], // Store user's avatar (96px size)
                    });
                })
                .catch((err) => {
                    // If there is an error fetching user data, reset authentication state
                    console.error('Error fetching user data:', err);
                    setIsAuthenticated(false);
                });
        } else {
            setIsAuthenticated(false); // Reset if no token is found
        }
    }, []); // Empty dependency array ensures this runs only on component mount

    // Function to toggle the mobile menu's open/closed state
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Handle the logout functionality
    const handleLogout = () => {
        // Remove authentication tokens from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');

        // Reset the authentication state and user info
        setIsAuthenticated(false);
        setUserInfo(null);

        // Redirect the user to the homepage after logging out
        navigate('/');
    };

    return (
        <header className="cmp-4-header bg-blue-600 text-white shadow-md">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo section */}
                <div className="text-2xl font-bold">
                    <Link to="/">WP Blog</Link>
                </div>

                {/* Navigation for larger screens */}
                <nav className="data-menu hidden md:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-blue-300">Home</Link>
                    {/* Conditional rendering based on authentication status */}
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="hover:text-blue-300">Login</Link>
                            <Link to="/register" className="hover:text-blue-300">Register</Link>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            {/* Logout button */}
                            <button
                                onClick={handleLogout}
                                className="data-logout hover:text-blue-300 text-sm"
                            >
                                Logout
                            </button>

                            {/* User avatar */}
                            {userInfo?.avatar && (
                                <img
                                    src={userInfo.avatar}
                                    alt={`${userInfo.name}'s avatar`}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                />
                            )}
                            {/* Display user's name */}
                            <span className="text-white font-medium">{userInfo?.name}</span>
                        </div>
                    )}
                </nav>

                {/* Mobile menu toggle button */}
                <div className="data-menu-btn md:hidden">
                    <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                        {/* Toggle between open/close icons */}
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

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <nav className="data-menu-btn mod-mobile md:hidden bg-blue-700 py-4">
                    <ul className="flex flex-col space-y-2 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-300 transition duration-300">
                                Home
                            </Link>
                        </li>
                        {/* Conditional rendering for login/register/logout */}
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
                                {/* Display user avatar and name in mobile menu */}
                                {userInfo?.avatar && (
                                    <img
                                        src={userInfo.avatar}
                                        alt={`${userInfo.name}'s avatar`}
                                        className="w-10 h-10 rounded-full mx-auto mb-2"
                                    />
                                )}
                                <span className="text-white font-medium">{userInfo?.name}</span>
                                {/* Logout button */}
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
