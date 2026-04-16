// Author - Jayla Craddock 
// Date - 4/15/26
// Description - The purpose of this page is to display the homepage
// after successful login. Shows personalized greeting and user information.
// Also provides navigation to messaging features.

// For user story #3 - A user logs in using an email address and password created during registration. 
// Session is maintained via HTTP-only secure cookie automatically handled by browser

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Decorations.css';

// Arrow function for homepage component
const Homepage = () => {
    // useNavigate hook: allows programmatic navigation to different routes
    const navigate = useNavigate();
    
    // useState hook: stores user data fetched from backend
    // Initial state is null - will be set after successful validation
    const [user, setUser] = useState(null);
    
    // useState hook: tracks loading state while validating session
    const [isLoading, setIsLoading] = useState(true);
    
    // useState hook: stores any error messages from session validation
    const [errors, setErrors] = useState([]);

    // useEffect hook: runs when component loads
    // Validates user's session by making request to protected /me endpoint
    // This ensures user is actually authenticated before showing homepage
    useEffect(() => {
        // Arrow function validateSession: asynchronous function to check if user is logged in
        const validateSession = async () => {
            try {
                // Check localStorage first for quick validation
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                const userData = localStorage.getItem('user');

                if (!isLoggedIn || !userData) {
                    // If localStorage doesn't show logged in, redirect to login
                    navigate('/login');
                    return;
                }

                // Also validate with backend to ensure session cookie is still valid
                // 'await' pauses until fetch Promise resolves
                // fetch() makes GET request to protected /me endpoint
                const response = await fetch(
                    'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/me',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include', // CRITICAL: include session_id cookie in request
                                               // Browser automatically sends the cookie stored during login
                    }
                );

                // Parse JSON response from backend
                const data = await response.json();

                // Conditional: check if request was successful
                if (response.ok && response.status === 200) {
                    // 200 = HTTP status code for "OK" - session is valid
                    // Backend confirms user identity and returns user object
                    setUser(JSON.parse(userData));
                } else if (response.status === 401) {
                    // 401 = HTTP status code for "Unauthorized"
                    // Session cookie is missing, invalid, or expired
                    setErrors(['Session expired. Please log in again.']);
                    // Clear localStorage and redirect to login
                    localStorage.removeItem('user');
                    localStorage.removeItem('isLoggedIn');
                    navigate('/login');
                } else {
                    // Handle any other error status codes
                    setErrors(['Unable to validate session. Please log in again.']);
                    navigate('/login');
                }
            } catch (error) {
                // Catch block executes if fetch throws error (network error, etc.)
                console.error('Error validating session:', error);
                
                // Even if validation fails, load user from localStorage if available
                const userData = localStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                } else {
                    setErrors(['Network error. Please check your connection.']);
                    navigate('/login');
                }
            } finally {
                // Finally block executes regardless of success or error
                // Turn off loading state
                setIsLoading(false);
            }
        };

        // Call the validateSession arrow function
        validateSession();
    }, [navigate]);

    // Arrow function handleLogout: clears session and returns user to login
    const handleLogout = async () => {
        try {
            // Optional: Call backend logout endpoint if it exists
            // This invalidates the session on backend side as well
            await fetch(
                'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/logout',
                {
                    method: 'POST',
                    credentials: 'include', // Send session cookie to backend
                }
            );
        } catch (error) {
            // If logout endpoint doesn't exist or fails, just clear frontend session
            console.error('Error during logout:', error);
        }

        // Clear localStorage on frontend
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        // Navigate to login page using useNavigate hook
        navigate('/login');
    };

    // Arrow function handleViewUsers: navigates to user list for messaging
    const handleViewUsers = () => {
        navigate('/users');
    };

    // Conditional rendering: show loading message while validating session
    if (isLoading) {
        return <div><p>Loading...</p></div>;
    }

    // Conditional rendering: show errors if any occurred during validation
    if (errors.length > 0) {
        return (
            <div>
                <h1>Error</h1>
                <div role="alert" style={{ color: 'red' }}>
                    <ul>
                        {/* .map() array method: iterate through errors array */}
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    // Conditional rendering: if user is not set, redirect to login
    // This shouldn't happen if useEffect works correctly, but safety check
    if (!user) {
        navigate('/login');
        return <div>Redirecting...</div>;
    }

    // Return JSX: what the user sees on the homepage
    return (
        <div>
            {/* Personalized greeting in top right corner */}
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <h2>Hello, {user.name}!</h2>
            </div>

            {/* Main homepage content */}
            <div style={{ marginTop: '60px' }}>
                <h1>Welcome to your homepage</h1>
                
                {/* Display user email */}
                <p><strong>Email:</strong> {user.email}</p>

                {/* Button to navigate to user list and messaging feature */}
                <button 
                    onClick={handleViewUsers}
                    style={{ marginTop: '10px', marginRight: '10px', padding: '10px 20px' }}
                >
                    View Users & Send Messages
                </button>

                {/* Logout button - clears session and returns to login */}
                <button 
                    onClick={handleLogout}
                    style={{ marginTop: '10px', padding: '10px 20px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Homepage;