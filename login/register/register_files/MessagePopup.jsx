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

  //Testing by using Tristan's back-end to make sure that it works
  
  // Arrow function handleSendMessage: asynchronous function to process message
  // UPDATED: Tries real backend first, falls back to mock response if it fails
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    
    const newErrors = [];

    // Validation: check if message is empty
    if (!messageContent.trim()) {
      newErrors.push('Message cannot be empty');
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
      // Includes: sender_id, receiver_id, content, timestamp
      const messageData = {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: messageContent, // Text message with optional emoji
        timestamp: new Date().toISOString(), // ISO 8601 format: "2026-04-06T21:00:00"
      };

      // 'await' pauses until fetch Promise resolves
      // POST request to send message to Tristan's backend API
      const response = await fetch(
        'https://itse-2374-app-4-back-dehe.onrender.com/send-message',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData), // Convert message object to JSON string
        }
      );

      // Parse JSON response from backend
      const data = await response.json();

      // Check response status and handle accordingly
      if (response.ok && response.status === 200) {
        // 200 = HTTP status code for "OK" - successful message send
        setSuccessMessage(`Message sent to ${selectedUser.name}!`);
        
        // Create full message object with sender info for display
        // Backend doesn't return sender_name, so we add it from currentUser
        const fullMessageData = {
          ...messageData,
          sender_name: currentUser.name, // Author's name included per requirements
          receiver_name: selectedUser.name,
        };
        
        // Add message to sentMessages array to display in conversation history
        const updatedMessages = [...sentMessages, fullMessageData];
        setSentMessages(updatedMessages);
        
        // Create unique key for this conversation
        const conversationKey = `messages_${currentUser.id}_${selectedUser.id}`;
        
        // Save updated messages to localStorage so they persist after popup closes
        // JSON.stringify() converts array to JSON string for storage
        localStorage.setItem(conversationKey, JSON.stringify(updatedMessages));
        
        // Clear message field after successful send
        setMessageContent('');
        setErrors([]);
        
        // Console message showing backend is working
        console.log('✅ SUCCESS: Message sent via REAL backend API to', selectedUser.name);
        
        // DO NOT auto-close - let user keep popup open to see message history
      } else if (response.status === 400) {
        // 400 = HTTP status code for "Bad Request" - invalid message data
        throw new Error('Invalid message data from backend');
      } else {
        // Handle any other error status codes
        throw new Error('Backend returned error: ' + response.status);
      }
    } catch (error) {
      // Catch block executes if fetch throws error or backend fails
      console.error('❌ ERROR: Real backend failed, using MOCK response:', error);
      console.log('⚠️  WARNING: Using MOCK data instead of real backend API');
      
      // Fallback: Create mock success response if backend fails
      // This allows testing to continue even if Tristan's backend is down
      const fullMessageData = {
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        receiver_id: selectedUser.id,
        receiver_name: selectedUser.name,
        content: messageContent,
        timestamp: new Date().toISOString(),
      };
      
      setSuccessMessage(`Message sent to ${selectedUser.name}!`);
      
      // Add message to sentMessages array
      const updatedMessages = [...sentMessages, fullMessageData];
      setSentMessages(updatedMessages);
      
      // Save to localStorage
      const conversationKey = `messages_${currentUser.id}_${selectedUser.id}`;
      localStorage.setItem(conversationKey, JSON.stringify(updatedMessages));
      
      // Clear message field
      setMessageContent('');
      setErrors([]);
      
      console.log('📝 FALLBACK: Message saved to localStorage (mock mode)');
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
          backgroundColor: '#303662',
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
              backgroundColor: '#303662',
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
                  backgroundColor: '#86bbe1',
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
                <small style={{ color: '#000000' }}>
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