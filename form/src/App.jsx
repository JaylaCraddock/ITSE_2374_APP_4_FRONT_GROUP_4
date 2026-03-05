// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import React, { useState } from 'react';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z0-9]{2,20}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 20) {
      return false;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUppercase && hasLowercase && hasNumber;
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = [];

    if (!formData.name) {
      newErrors.push('Name is required');
    } else if (!validateName(formData.name)) {
      newErrors.push('Name must be 2-20 alphanumeric characters');
    }

    if (!formData.email) {
      newErrors.push('Email is required');
    } else if (!validateEmail(formData.email)) {
      newErrors.push('Email format is invalid');
    }

    if (!formData.password) {
      newErrors.push('Password is required');
    } else if (!validatePassword(formData.password)) {
      if (formData.password.length < 8 || formData.password.length > 20) {
        newErrors.push('Password must be between 8 and 20 characters long');
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.push('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.push('Password must contain at least one number');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        'https://itse-2374-app-4-back-s4gw.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && response.status === 201) {
        // Success
        setSuccessMessage(
          `Welcome, ${data.user.name}! Registration successful. Please check your email to confirm your account.`
        );
        setFormData({
          name: '',
          email: '',
          password: '',
        });
        setErrors([]);
      } else if (response.status === 400) {
        // Validation error from backend
        setErrors(data.errors || ['Validation failed']);
      } else if (response.status === 409) {
        // Email already exists
        setErrors(['This email is already registered. Please use a different email or try logging in.']);
      } else {
        // Other errors
        setErrors(['An error occurred. Please try again later.']);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors(['Network error. Please check your connection and try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>User Registration</h1>

      {successMessage && (
        <div role="alert">
          <p>{successMessage}</p>
        </div>
      )}

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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={isLoading}
            maxLength="20"
          />
          <small>2-20 alphanumeric characters</small>
        </div>

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
          <small>Must be a valid email format</small>
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
            maxLength="20"
          />
          <small>
            8-20 characters, must include uppercase, lowercase, and a number
          </small>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
