// Author - Jayla Craddock
// Date - 4/15/26
// Description - Popup window for composing and sending text messages
// to individual users. Message includes author name, timestamp, and emoji support

// User Story #8 - A user posts a text message to an individual user by 
// right-clicking a user's name and selecting "Post" from a popup menu.
// The user fills in a text field and clicks Send button.

import React, { useState, useEffect } from 'react';
import './Decorations.css';

const MessagePopup = ({ selectedUser, onClose }) => {
  // useState hook: stores message content typed by user
  // Initial state is empty string
  const [messageContent, setMessageContent] = useState('');
  
  // useState hook: stores any validation or submission errors
  const [errors, setErrors] = useState([]);
  
  // useState hook: tracks loading state while sending message
  const [isLoading, setIsLoading] = useState(false);
  
  // useState hook: stores success message after sending
  const [successMessage, setSuccessMessage] = useState('');
  
  // useState hook: stores list of sent messages for display
  // Uses localStorage to persist message history even after popup closes
  const [sentMessages, setSentMessages] = useState([]);
  
  // Get current logged-in user from localStorage
  // Contains: id, name, email from login
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // useEffect hook: runs when component mounts and selectedUser changes
  // Loads saved message history from localStorage for this specific user conversation
  useEffect(() => {
    // Create unique key for this conversation based on sender and receiver IDs
    // Ensures each user pair has their own message history
    const conversationKey = `messages_${currentUser.id}_${selectedUser.id}`;
    
    // Retrieve saved messages from localStorage
    // localStorage stores data as JSON string, so we parse it back to array
    const savedMessages = localStorage.getItem(conversationKey);
    
    if (savedMessages) {
      // Parse JSON string back to array and set as state
      setSentMessages(JSON.parse(savedMessages));
    }
  }, [selectedUser, currentUser.id]);

  // Arrow function handleMessageChange: executes when user types in message field
  // e = event object from input element
  const handleMessageChange = (e) => {
    const { value } = e.target;
    // Update messageContent state with new value
    setMessageContent(value);
    // Clear any previous errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Arrow function handleSendMessage: asynchronous function to process message
  // Uses mock data for testing while backend CORS is being fixed
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    
    const newErrors = [];

    // Validation: check if message is empty
    if (!messageContent.trim()) {
      newErrors.push('Message cannot be empty');
    }

    // Validation: check if message is too long (max 500 characters)
    if (messageContent.length > 500) {
      newErrors.push('Message cannot exceed 500 characters');
    }

    // If validation errors exist, display them and return early
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      // Create message object with all required data for User Story #8
      // Includes: sender_id, receiver_id, content, timestamp, sender_name
      const messageData = {
        sender_id: currentUser.id,
        sender_name: currentUser.name, // Author's name included per requirements
        receiver_id: selectedUser.id,
        receiver_name: selectedUser.name,
        content: messageContent, // Text message with optional emoji
        timestamp: new Date().toISOString(), // ISO 8601 format: "2026-04-06T21:00:00"
      };

      // Simulate API delay to feel more realistic
      // 'await' pauses execution for 800 milliseconds
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock/test data response - simulates successful backend response
      // In real scenario, this would be: const data = await response.json();
      const mockResponse = {
        type: 'success',
        message: 'Message sent',
        value: messageData,
      };

      // Check if mock response indicates success
      // Simulates: if (response.ok && response.status === 200)
      if (mockResponse.type === 'success') {
        // Success: message was sent
        setSuccessMessage(`Message sent to ${selectedUser.name}!`);
        
        // Add message to sentMessages array to display in conversation history
        // Allows user to see what they just sent
        const updatedMessages = [...sentMessages, messageData];
        setSentMessages(updatedMessages);
        
        // Create unique key for this conversation
        const conversationKey = `messages_${currentUser.id}_${selectedUser.id}`;
        
        // Save updated messages to localStorage so they persist after popup closes
        // JSON.stringify() converts array to JSON string for storage
        localStorage.setItem(conversationKey, JSON.stringify(updatedMessages));
        
        // Clear message field after successful send
        setMessageContent('');
        setErrors([]);
        
        // DO NOT auto-close - let user keep popup open to see message history
        // User must click Cancel to close (removed setTimeout and onClose call)
      } else {
        // Mock error response
        setErrors(['Failed to send message. Please try again.']);
      }
    } catch (error) {
      // Catch block executes if any error occurs
      console.error('Error sending message:', error);
      setErrors(['Network error. Could not send message.']);
    } finally {
      // Finally block executes regardless of success or error
      // Turn off loading state
      setIsLoading(false);
    }
  };

  // Return JSX: modal popup with message composition form
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      {/* Modal popup container */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h2>Send Message to {selectedUser.name}</h2>

        {/* Conditional rendering: display errors if any occurred */}
        {errors.length > 0 && (
          <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
            <ul>
              {/* .map() array method: create list item for each error */}
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Conditional rendering: display success message */}
        {successMessage && (
          <div role="alert" style={{ color: 'green', marginBottom: '10px' }}>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Display message history if messages have been sent */}
        {sentMessages.length > 0 && (
          <div 
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              maxHeight: '250px',
              overflowY: 'auto',
              border: '1px solid #ddd',
            }}
          >
            <h4>Conversation History:</h4>
            {/* .map() array method: iterate through sent messages */}
            {sentMessages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#e3f2fd',
                  padding: '10px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              >
                {/* Display author name (current user) */}
                <strong>{msg.sender_name}:</strong> {msg.content}
                <br />
                {/* Display date and time of message */}
                <small style={{ color: '#666' }}>
                  {new Date(msg.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* Message composition form */}
        <form onSubmit={handleSendMessage}>
          {/* Label and textarea for message content */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="messageContent" style={{ display: 'block', marginBottom: '5px' }}>
              Message (supports emoji 😄):
            </label>
            <textarea
              id="messageContent"
              value={messageContent}
              onChange={handleMessageChange}
              placeholder="Type your message here..."
              disabled={isLoading}
              maxLength="500"
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
              }}
            />
            <small>{messageContent.length}/500 characters</small>
          </div>

          {/* Button container for Send and Cancel buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            {/* Send button - shows loading text while processing */}
            {/* Ternary operator: condition ? trueValue : falseValue */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>

            {/* Cancel button - closes popup without sending */}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagePopup;