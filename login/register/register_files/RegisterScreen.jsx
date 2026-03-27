
// ALSO MENTION USING JOSE'S BACKEND RENDER
// import { useState } from 'react'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


// This is the start of User Story #1 - where A new user registers with the web app by providing name,  email, and password. A name must be between 2 and 20 alpahnumeric characters. Email must have a valid email format. A password must be between 8 and 20 characters long and must contain at least one uppercase letter, one lowercase letter, and one number. 

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

//CHECKED
const [errors, setErrors] = useState([]);
const [successMessage, setSuccessMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);

//For switching from registration to login screen
const navigate = useNavigate();

useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
          navigate('/homepage');
      }
  }, [navigate]);


// Validation functions

//Describe as well how I use regex and what that is just
// in case the professor askes
//First is validating name and making sure that it is
// at least 2-20 letters long
const validateName = (name) => {
  //Regex allows letters and spaces
  // for users with 2 first names or want to include
  // last name
  const nameRegex = /^[a-zA-Z0\s]{2,20}$/;
  return nameRegex.test(name);

};

//Validation for email to make sure
// that user is using valid email address
// using @
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//Validation for password
//make sure password is within INSERT VALIDATION AMOUNT
const validatePassword = (password) => {
  if(password.length < 8 || password.length > 20) {
    return false;
  }
  //The part where password checks if it is valid
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUppercase && hasLowerCase && hasNumber;
};
//checked


//Client-side validation
//Actual form for register
const validateForm = () => {
  //Array for collecting 
  // multiple error messages
  const newErrors = [];

  if (!formData.name) {
    newErrors.push('Name is required');
  } else if (!validateName(formData.name)) {
    newErrors.push('name must be 2-20 alphanumeric characters');
  }

  //CHECKED
  if(!formData.email) {
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
    if(!/[a-z]/.test(formData.password)) {
      newErrors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(formData.password)) {
      newErrors.push('Password must contain at least one number');
    }
  }

  //Returns error messages from array? 
  //Def need to double check that
  setErrors(newErrors);
  return newErrors.length === 0;

};

//SECTION CHECKED COMPLETELY ABOVE

// Handle input changes
//Def need to write notes on what's happening here
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
  //Clear errors when user starts typing
  if (errors.length > 0) {
    setErrors([]);
  }
};

//Handle form submission
//using Jose's backend to render
// also prob need to write notes on what's happening here
const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage('');

  //Validate form
  if(!validateForm()){
    return;
  }

  setIsLoading(true);

 // Will soon have Jose's backend to fix CORS policy 
// to allow front-end to send a request to the backend
  try {
    const response = await fetch(
      // Use Jose's absolute URL so it triggers the CORS error
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

    if(response.ok && response.status === 201) {
      //Success message
      setSuccessMessage(
        `Welcome, ${data.user.name}! Registration successful. Please check your email
         to confirm your account.`
      );
      setFormData({
        name:'',
        email: '',
        password: '',
      });
      setErrors([]);
    } else if (response.status === 400) {
      //Validation error from backend
      setErrors(data.errors || ['Validation failed']);
    } else if (response.status === 409) {
      //Email already exists message
      setErrors(['This email is already registered. Please use a different email or try logging in.']);
    } else {
      // Other errors
      //Maybe specify later on?
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


//For switching to login
const handleGoToLogin = () => {
  navigate('/login')
};


//Display registration form
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
        <input type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        disabled={isLoading}
        maxLength="20"
         />
         <small>2-20 alphanumeric characters long can include spaces in name</small>
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input type="email"
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
        <input type="password"
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

      <button type='submit' disabled={isLoading}>
      {isLoading ? 'Registering...' : 'Register'}</button>
      
      {/* For switching to login screen */}
      <p>Already have an account?</p>
      <button type='button' onClick={handleGoToLogin}>Login</button>
    </form>

    </div>
  );

 
};

export default RegistrationScreen;



