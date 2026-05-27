// Author - Jayla Craddock 
// Date - 3/30/26
// Description - The purpose of this page is to take users to the status of their confirmation from the 
// link for their registration.


//This is for user story #2 - An email notification is sent on registration. A user confirms the registration by clicking on a link in the email.

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Decorations.css';

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
    <div className="ec-page">
      <h1 className="ec-title">Email Verification</h1>

      {verificationStatus === 'verifying' && (
        <div className="ec-card ec-card--neutral" role="status" aria-live="polite">
          <p className="ec-text">Verifying your email... Please wait.</p>
          <div className="ec-spinner" aria-hidden="true"></div>
        </div>
      )}

      {verificationStatus === 'success' && (
        <div className="ec-card ec-card--success" role="alert">
          <h2 className="ec-heading">✓ {message}</h2>
          <p className="ec-text">Your email has been confirmed. You can now log in to your account.</p>
          <div className="ec-actions">
            <button className="ec-btn ec-btn--primary" onClick={handleGoToLogin}>
              Go to Login
            </button>
          </div>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="ec-card ec-card--error" role="alert">
          <h2 className="ec-heading">✗ {message}</h2>

          {errorDetails.length > 0 && (
            <ul className="ec-list">
              {errorDetails.map((error, index) => (
                <li className="ec-listItem" key={index}>
                  {error}
                </li>
              ))}
            </ul>
          )}

          <p className="ec-text">Please try registering again or contact support if the problem persists.</p>

          <div className="ec-actions">
            <button className="ec-btn ec-btn--ghost" onClick={handleBackToRegister}>
              Back to Registration
            </button>
            <button className="ec-btn ec-btn--primary" onClick={handleGoToLogin}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailConfirm;

