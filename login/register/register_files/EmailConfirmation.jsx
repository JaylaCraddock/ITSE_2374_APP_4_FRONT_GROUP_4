// Author - Jayla Craddock 
// Date - 3/30/26
// Description - The purpose of this page is to take users to the status of their confirmation from the 
// link for their registration.


//This is for user story #2 - An email notification is sent on registration. A user confirms the registration by clicking on a link in the email.

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

//Arrow function for email confirmation
const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);

  // Get the token from the URL query parameter
  // Example: /verify-email?token=VlVcmrDCWMD-3V2j0XwjNyeirQdPUZeD5FZMUoO28C0
  const token = searchParams.get('token');

  useEffect(() => {
    // Verify the email when component loads
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    // If no token, show error
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token missing, invalid, expired, or already used');
      setErrorDetails(['No verification token provided']);
      return;
    }

    try {
      // Send token to backend for verification
      // Using Jose's backend endpoint
      const response = await fetch(
        'https://itse-2374-app-4-back-s4gw.onrender.com/api/confirm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        }
      );

      const data = await response.json();

      if (response.ok && response.status === 200) {
        // Success - email verified
        setVerificationStatus('success');
        setMessage(`Email verified successfully! Welcome, ${data.user.name}!`);
        setErrorDetails([]);
      } else if (response.status === 400) {
        // Token missing, invalid, expired, or already used
        setVerificationStatus('error');
        setMessage('Token missing, invalid, expired, or already used');
        setErrorDetails(data.errors || ['Verification failed']);
      } else if (response.status === 500) {
        // Database error
        setVerificationStatus('error');
        setMessage('Database error');
        setErrorDetails(['A server error occurred. Please try again later.']);
      } else {
        // Other errors
        setVerificationStatus('error');
        setMessage('An error occurred during verification');
        setErrorDetails(data.errors || ['Unknown error']);
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      setVerificationStatus('error');
      setMessage('Network error');
      setErrorDetails(['Please check your connection and try again.']);
    }
  };

  // Handle navigation back to registration
  const handleBackToRegister = () => {
    navigate('/register');
  };

  // Handle navigation to login
  const handleGoToLogin = () => {
    navigate('/login');
  };

  //What the user sees after clicking on the link
  return (
    <div>
      <h1>Email Verification</h1>

      {verificationStatus === 'verifying' && (
        <div>
          <p>Verifying your email... Please wait.</p>
        </div>
      )}

      {verificationStatus === 'success' && (
        <div role="alert" style={{ color: 'green', border: '1px solid green', padding: '10px' }}>
          <h2>✓ {message}</h2>
          <p>Your email has been confirmed. You can now log in to your account.</p>
          <button onClick={handleGoToLogin}>Go to Login</button>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div role="alert" style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
          <h2>✗ {message}</h2>
          {errorDetails.length > 0 && (
            <ul>
              {errorDetails.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          <p>Please try registering again or contact support if the problem persists.</p>
          <button onClick={handleBackToRegister}>Back to Registration</button>
          <button onClick={handleGoToLogin}>Go to Login</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirm;

