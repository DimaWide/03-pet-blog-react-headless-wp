import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const Login = () => {
    // State for username, password, and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Hook for navigation after login
    const navigate = useNavigate();

    // Function to handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Sending login request to API
            const response = await axios.post('http://dev.wp-blog/wp-json/jwt-auth/v1/token', {
                username,
                password,
            });

            // Saving tokens to local storage for authentication
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refresh_token);

            // Redirecting to the home page after successful login
            navigate('/');
        } catch (err) {
            // Handling login error and displaying message
            setError('Login failed. Please check your credentials.');
            console.error('Error during login', err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
            >
                {/* Login form title */}
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Login
                </Typography>

                {/* Display error message if login fails */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Username input field */}
                <TextField
                    label="Username"
                    variant="standard"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Password input field */}
                <TextField
                    label="Password"
                    variant="standard"
                    fullWidth
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Submit button for login */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                >
                    Login
                </Button>

                {/* Registration link for new users */}
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account? <a href="/register">Register</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
