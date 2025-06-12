// client/my-app/src/pages/RegisterPage.js
import axios from 'axios'; // To make API calls
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect the user

const RegisterPage = () => {
    // --- State Management ---
    // We use useState to store what the user types into the form fields.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // The 'navigate' function lets us programmatically redirect the user.
    const navigate = useNavigate();

    // --- Form Submission Handler ---
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents the default form submission (full page refresh)
        setError(''); // Clear previous errors
        setMessage(''); // Clear previous messages

        try {
            // 1. Make the API call to our backend's /register endpoint
            const response = await axios.post('http://localhost:5001/api/users/register', {
                username,
                password,
            });

            // 2. Handle the successful response
            setMessage(response.data.message); // Show success message from the API

            // After a short delay, redirect to the login page
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            // 3. Handle errors (e.g., user already exists)
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {/* Display success or error messages to the user */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegisterPage;