import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const Register = () => {
    // State variables to store form input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle the registration form submission
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents page reload

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Send a POST request to the server to register a new user
            const response = await axios.post('http://dev.wp-blog/wp-json/wp/v2/users/register', {
                username,
                email,
                password,
            });

            // If registration is successful, redirect the user to the login page
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            // Handle errors if registration fails
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Error during registration', err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleRegister}
                sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
            >
                {/* Registration form title */}
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create an Account
                </Typography>

                {/* Display error messages if any */}
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

                {/* Email input field */}
                <TextField
                    label="Email"
                    variant="standard"
                    fullWidth
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                {/* Confirm password input field */}
                <TextField
                    label="Confirm Password"
                    variant="standard"
                    fullWidth
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                >
                    Register
                </Button>

                {/* Link to the login page for existing users */}
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account? <a href="/login">Login</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
