
// Author - Jayla Craddock 
// Date - 3/30/26
// Description - The purpose of this page is to allow 
// users to register with their name, email and password.

// This is the start of User Story #1 - where A new user registers with the web app by providing name,  email, and password. A name must be between 2 and 20 alpahnumeric characters. Email must have a valid email format. A password must be between 8 and 20 characters long and must contain at least one uppercase letter, one lowercase letter, and one number. 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import './Decorations.css';
import pawImg from "./images/paw.png";

//Arrow function creation for registration screen that includes
// name, email and password
const RegistrationScreen = () => {
  //useState hok stores the form input values (name, email and password)
  // to allow React to re-render when the form data changes
  // State is a mutable data structure that triggers re-renders when updated
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

//Setting the error, loading and success messages using useState hooks
const [errors, setErrors] = useState([]);
const [successMessage, setSuccessMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);

//Uses useNavigate and use Effect hook for switching from registration to login screen
const navigate = useNavigate();

useEffect(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
          navigate('/homepage');
      }
  }, [navigate]);


// Validation arrow functions

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
//make sure password is within insert validation amount
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

//Quick explanation of what regex is - 
// Regex or regular expression refers to using standard JavaScript RegExp objects that is used commonly to perform validation, search, filtering and data extraction.

//Client-side validation
//Actual form for register that uses if statements, functions and arrays
// to aid the creation of a new user registration
const validateForm = () => {
  //Array for collecting 
  // multiple error messages
  const newErrors = [];

  // If statement for validating name.
  if (!formData.name) {
    // Send error to user for them to see
    newErrors.push('Name is required');
  } else if (!validateName(formData.name)) {
    newErrors.push('name must be 2-20 alphanumeric characters');
  }

// If statement for validating email
  if(!formData.email) {
        // Send error to user for them to see
    newErrors.push('Email is required');
  } else if (!validateEmail(formData.email)) {
    newErrors.push('Email format is invalid');
  }

  // If statement for validating password
  if (!formData.password) {
        // Send error to user for them to see
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

  //Returns error messages from array 
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
  //Clear errors when user starts typing
  if (errors.length > 0) {
    setErrors([]);
  }
};

//Handle form submission using an arrow function
const handleSubmit = async (e) => {
  e.preventDefault();
  //Send message to user letting them know that their 
  // account has been successfully registered!
  setSuccessMessage('');

  //If statement for validating form submission
  if(!validateForm()){
    return;
  }

  setIsLoading(true);

 //Try and catch statements as soon I will have Jose's backend to fix CORS policy 
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

    //Message that contains the success message as well as the next
    // step. This is using Jose's backend for the messages to be displayed.
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
      // Other errors if the other error messages do not apply from above
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


//Arrow function for switching to login
const handleGoToLogin = () => {
  navigate('/login')
};


//Display registration form
// What the user will see on the website
return (
  <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-blue-500">User Registration</h1>

    
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

     {/* Image to add for logo */}
                <div>
                    <img src={pawImg} alt="Pawprint" className="mx-auto h-10 w-auto"
     />
                </div>
    

   <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="block ">Name:</label>
        <input type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        disabled={isLoading}
        maxLength="20"
           className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
         />
         <small>2-20 alphanumeric characters long can include spaces in name</small>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block ">Email:</label>
        <input type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        disabled={isLoading}
        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
         />
         <small>Must be a valid email format</small>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block ">Password:</label>
        <input type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        disabled={isLoading}
        maxLength="20"
        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-black/20 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
         />
         <small>
          8-20 characters, must include uppercase, lowercase, and a number
         </small>
      </div>

      <button type='submit' disabled={isLoading} className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
      {isLoading ? 'Registering...' : 'Register'}</button>
      
      {/* For switching to login screen */}
      <p className="font-semibold text-indigo-400 hover:text-indigo-300">Already have an account?</p>
      <button className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"  type='button' onClick={handleGoToLogin}>Login</button>
    </form>
</div>
    </div>
  );

 
};

export default RegistrationScreen;



