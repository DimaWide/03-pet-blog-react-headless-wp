import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Создаем Context
export const UserContext = createContext();

// Провайдер для передачи пользователя
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCurrentUser(response.data);
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    setCurrentUser(null);
                }
            }
            setLoading(false);
        };


        fetchCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
