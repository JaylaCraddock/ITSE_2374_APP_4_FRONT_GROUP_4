//FOR USER STORY #3 - A user logs in using an email address and password created during registration. 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
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

    try {
        const response = await fetch(
            'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Add this line
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
        console.error('Error during login:', error);
        setErrors(['Network error. Please check your connection and try again.']);
    } finally {
        setIsLoading(false);
    }
};

    const handleGoToRegister = () => {
        navigate('/register');
    };

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
