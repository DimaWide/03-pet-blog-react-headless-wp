import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context for the user
export const UserContext = createContext();

// Provider component for managing user state
export const UserProvider = ({ children }) => {
    // State for storing the current user's information
    const [currentUser, setCurrentUser] = useState(null);
    // State for tracking the loading state while fetching user data
    const [loading, setLoading] = useState(true);
    // State for handling errors when fetching user data
    const [error, setError] = useState(null);

    // useEffect hook to load the user data after the component mounts
    useEffect(() => {
        // Function to fetch the current user's information
        const fetchCurrentUser = async () => {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('authToken');

            // If the token exists, perform the request to get user data
            if (token) {
                try {
                    // Make an API request to fetch user data with the authorization token
                    const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
                        headers: {
                            Authorization: `Bearer ${token}`, // Pass the token in the request header
                        },
                    });

                    // Set the retrieved user data into the state
                    setCurrentUser(response.data);
                    // Clear any error if the request is successful
                    setError(null);
                } catch (error) {
                    // Handle errors during the request (e.g., invalid token)
                    console.error('Error fetching current user:', error);
                    // Set currentUser to null in case of an error
                    setCurrentUser(null);
                    // Set an error message
                    setError('Error fetching user data. Please log in again.');
                }
            } else {
                // If no token is found in localStorage, set an error
                setError('No token found. Please log in.');
            }

            // Set loading to false after fetching is done
            setLoading(false);
        };

        // Call the function to fetch the current user
        fetchCurrentUser();
    }, []); // Empty dependency array to make sure the effect runs only once when the component mounts

    // Return the context provider, wrapping the children components
    // Pass the currentUser, setCurrentUser, loading, and error states through context
    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, loading, error }}>
            {children} {/* All child components will have access to these values */}
        </UserContext.Provider>
    );
};
