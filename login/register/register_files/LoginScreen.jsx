// Author - Jayla Craddock 
// Date - 4/15/26
// Description - The purpose of this page is to allow 
// users to login with their email and password after
// successfully registering and confirming their account

// For user story #3 - A user logs in using an email address and password created during registration. 
// Backend now handles session management with secure HTTP-only cookies

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Decorations.css';
import pawImg from "./images/paw.png";

// Arrow function for login screen
const LoginScreen = () => {
    const navigate = useNavigate();
    
    // useEffect hook: runs when component loads
    // Checks if user is already logged in and redirects to homepage
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // If they are already logged in, send them straight to the homepage
            navigate('/homepage');
        }
    }, [navigate]);

    // useState hook: stores form input values (email and password)
    // State allows React to re-render when form data changes
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    // useState hook: stores validation error messages to display to user
    // errors is array that collects all error messages
    const [errors, setErrors] = useState([]);
    
    // useState hook: tracks loading state while asynchronous API request is in progress
    // isLoading is boolean flag to disable form inputs during API call
    const [isLoading, setIsLoading] = useState(false);

    // Arrow function handleChange: executes when user types in input fields
    // Updates formData state with new value and clears previous errors
    const handleChange = (e) => {
        // Destructuring: extract 'name' and 'value' from event target object
        const { name, value } = e.target;
        
        // Call setFormData with callback arrow function to update state
        // Functional state update pattern - takes previous state and returns new state
        setFormData((prevData) => ({
            ...prevData,        // Spread operator (...) copies all existing form data
            [name]: value,      // Bracket notation allows dynamic key assignment
        }));
        
        // Conditional: clear errors when user starts typing (they're correcting input)
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    // Arrow function handleSubmit: asynchronous function that processes form submission
    // 'async' keyword allows use of 'await' for asynchronous operations (API calls)
    // Validates form locally first, then sends credentials to backend API
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission page reload behavior
        
        // Initialize empty array to collect validation error messages
        const newErrors = [];

        // Conditional validation: check if email is empty
        if (!formData.email) {
            newErrors.push('Email is required');
        }
        
        // Conditional validation: check if password is empty
        if (!formData.password) {
            newErrors.push('Password is required');
        }

        // If validation errors exist, display them and return early
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return; // Early return - stops execution if validation fails
        }

        // Call setIsLoading(true) to show loading state while API request is in progress
        setIsLoading(true);

        try {
            // Try block executes code that might throw an error
            // 'await' keyword pauses execution until fetch Promise is resolved
            // fetch() method makes HTTP request to backend API endpoint
            const response = await fetch(
                'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/login',
                {
                    method: 'POST',              // HTTP POST method for authentication
                    headers: {
                        'Content-Type': 'application/json', // HTTP header: tells server we're sending JSON
                    },
                    credentials: 'include',      // CRITICAL: tells browser to include session cookie in request
                                                 // Browser automatically stores session_id cookie from response
                    body: JSON.stringify(formData), // JSON.stringify() converts object to JSON string
                }
            );
            
            // 'await' pauses until response Promise resolves
            // Parse JSON response from backend using .json() method
            const data = await response.json();

            // Conditional statement checks HTTP response status code
            if (response.ok && response.status === 200) {
                // 200 = HTTP status code for "OK" - successful login
                // Backend returns user object with id, name, email, confirmed status, created_at
                
                // Store user info in localStorage for frontend reference
                localStorage.setItem('user', JSON.stringify(data.user));
                // Set flag indicating user is logged in
                localStorage.setItem('isLoggedIn', 'true');
                
                // Note: Session cookie (session_id) is automatically stored by browser
                // No need to manually save it - browser will send it in all future requests
                // when credentials: 'include' is used in fetch options
                
                // Navigate to homepage using useNavigate hook
                navigate('/homepage');
            } else if (response.status === 400) {
                // 400 = HTTP status code for "Bad Request" - validation error or invalid credentials
                // Backend returns errors array with specific error messages
                setErrors(data.errors || ['Email or password is incorrect']);
            } else if (response.status === 500) {
                // 500 = HTTP status code for "Internal Server Error" - database error
                setErrors(['Server error. Please try again later.']);
            } else {
                // Fallback for any other error status codes
                setErrors(['An error occurred. Please try again later.']);
            }
        } catch (error) {
            // Catch block executes if try block throws error (network error, JSON parse error, etc.)
            console.error('Error during login:', error);
            
            // Conditional checks if error is specifically a network/CORS issue
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                setErrors([
                    'Unable to connect to the server. Please check your connection and try again.'
                ]);
            } else {
                setErrors(['Network error. Please check your connection and try again.']);
            }
        } finally {
            // Finally block executes regardless of success or error in try/catch
            // Guaranteed cleanup - turn off loading state
            setIsLoading(false);
        }
    };

    // Arrow function handleGoToRegister: navigates to registration page
    const handleGoToRegister = () => {
        navigate('/register');
    };

    // Return JSX: what the user sees on the login page
    return (

        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-blue-500">User Login</h1>

            {/* Conditional rendering: Display error list ONLY if errors array has items */}
            {/* Logical AND (&&) operator: if errors.length > 0 is true, render JSX after && */}
            {errors.length > 0 && (
                <div role="alert">
                    <ul>
                        {/* .map() array method: iterate through errors array and create JSX for each */}
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Image to add for logo */}
            <div>
                <img src={pawImg} alt="Pawprint" className="mx-auto h-10 w-auto"
 />
            </div>

            {/* Login form controlled by React state */}
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input field - controlled input */}
                <div className="space-y-1">
                    <label htmlFor="email" className="block ">Email:</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={isLoading} 
                       className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                </div>

    

                {/* Password input field - controlled input */}
                <div  className="space-y-1">
                    <label htmlFor="password" className="block ">Password:</label>
                    <input 
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                         className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                </div>

                {/* Login button - shows loading text while API request in progress */}
                {/* Ternary operator: condition ? trueValue : falseValue */}
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"  disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
 <p  className="font-semibold text-indigo-400 hover:text-indigo-300">Don't have an account?</p>
            <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"  type="button" onClick={handleGoToRegister}>
                Go to Register
            </button>

</div>

           
        </div>
    );
};

export default LoginScreen;