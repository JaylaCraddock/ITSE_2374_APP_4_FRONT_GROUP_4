// Author - Jayla Craddock 
// Date - 3/30/26
// Description - The purpose of this page is to allow 
// users to login with their email and password after
// successfully registering and confirming their account

//For user story #3 - A user logs in using an email address and password created during registration. 

//Currently not able to have the login feature
// fully function as I need to wait for the next iteration
// for the backend to fix the CORS policy

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Arrow function for login screen
const LoginScreen = () => {
    const navigate = useNavigate();
    //  Add this useEffect block
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // If they are already logged in, send them straight to the homepage
            navigate('/homepage');
        }
    }, [navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    // Send back error messages
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    if (!formData.email) {
        newErrors.push('Email is required');
    }
    if (!formData.password) {
        newErrors.push('Password is required');
    }

    if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
    }

    setIsLoading(true);

// Will soon have Jose's backend to fix CORS policy 
// to allow front-end to send a request to the backend
  try {
        const response = await fetch(
            'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
               
                body: JSON.stringify(formData),
            }
        );
        
        const data = await response.json();

        if (response.ok && response.status === 200) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Navigate to homepage
            navigate('/homepage');
        } else if (response.status === 400) {
            setErrors(data.errors || ['Login failed']);
        } else if (response.status === 401) {
            setErrors(['Invalid email or password']);
        } else {
            setErrors(['An error occurred. Please try again later.']);
        }
    } catch (error) {
        console.error('Error during request:', error);
        
        // Check if the error is likely a CORS/Network issue
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            setErrors([
                'Unable to connect to the server due to a CORS policy restriction. This will be resolved in the next backend release.'
            ]);
        } else {
            setErrors(['An unexpected network error occurred. Please try again.']);
        }
    } finally {
        setIsLoading(false);
    }
};

    const handleGoToRegister = () => {
        navigate('/register');
    };

    // What the user sees on the page
    return (
        <div>
            <h1>User Login</h1>

            {errors.length > 0 && (
                <div role="alert">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p>Don't have an account?</p>
            <button type="button" onClick={handleGoToRegister}>
                Go to Register
            </button>
        </div>
    );
};

export default LoginScreen;
