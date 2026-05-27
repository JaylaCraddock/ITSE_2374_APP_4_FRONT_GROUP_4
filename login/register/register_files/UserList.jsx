// Author - Jayla Craddock
// Date - 4/15/26
// Description - Displays a list of user accounts where users can right-click
// to post a message to an individual user

// User Story #8 - A user posts a text message to an individual user by 
// right-clicking a user's name in a list of user accounts and selecting 
// "Post" from a popup menu

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessagePopup from './MessagePopup.jsx';
import './Decorations.css';

const UserList = () => {
  // useNavigate hook: allows programmatic navigation to different routes
  const navigate = useNavigate();
  
  // useState hook to store list of users fetched from backend
  // Initial state is empty array
  const [users, setUsers] = useState([]);
  
  // useState hook to store loading state while fetching users
  const [isLoading, setIsLoading] = useState(true);
  
  // useState hook to store any errors that occur during API call
  const [errors, setErrors] = useState([]);
  
  // useState hook to track which user was right-clicked for messaging
  // null = no user selected, object = selected user data
  const [selectedUser, setSelectedUser] = useState(null);
  
  // useState hook to track position of context menu (right-click popup)
  // Used for positioning the popup menu at cursor location
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, visible: false });

  // useEffect hook: runs when component mounts (loads)
  // Fetches list of all users from backend API
  useEffect(() => {
    fetchUsers();
  }, []);

    // Arrow function fetchUsers: asynchronous function to retrieve users from backend
  // UPDATED: Tries real backend first, falls back to mock data if it fails
  const fetchUsers = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      // 'await' pauses execution until fetch Promise resolves
      // GET request to retrieve list of all users from Tristan's backend
      const response = await fetch(
        'https://itse-2374-app-4-back-dehe.onrender.com/api/users',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Parse JSON response from backend
      const data = await response.json();

      // Conditional checks response status
      if (response.ok && response.status === 200) {
        // 200 = HTTP status code for "OK" - successful GET request
        // Set users state with array of users from backend response
        setUsers(data.users || []);
        setErrors([]);
        // Console message showing backend is working
        console.log('✅ SUCCESS: Using REAL backend API for user list');
      } else {
        // If backend response is not OK, throw error to trigger catch block
        throw new Error('Backend returned non-200 status');
      }
    } catch (error) {
      // Catch block executes if fetch throws error or backend fails
      console.error('❌ ERROR: Real backend failed, falling back to mock data:', error);
      console.log('⚠️  WARNING: Using MOCK DATA instead of real backend API');
      
      // Fallback: Use mock data if backend fails
      // This allows testing to continue even if Tristan's backend is down
      const mockUsers = [
        { id: 1, name: 'Jane Doe', email: 'jane@email.com' },
        { id: 2, name: 'Michael Peterson', email: 'michael@email.com' },
        { id: 3, name: 'Lisa Henderson', email: 'lisa@email.com' },
        { id: 4, name: 'Robert Lin', email: 'robert@email.com' },
        { id: 5, name: 'Sarah Johnson', email: 'sarah@email.com' },
      ];
      
      setUsers(mockUsers);
      setErrors([]);
      console.log('📝 FALLBACK: Loaded', mockUsers.length, 'mock users');
    } finally {
      // Finally block executes regardless of success or error
      // Turn off loading state
      setIsLoading(false);
    }
  };

  // Arrow function handleContextMenu: executes when user right-clicks on user name
  // e = event object containing cursor position
  const handleContextMenu = (e, user) => {
    e.preventDefault(); // Prevent browser's default right-click menu
    
    // Set context menu visibility and position to cursor location
    // clientX and clientY are cursor coordinates relative to viewport
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
    
    // Store which user was right-clicked
    setSelectedUser(user);
  };

  // Arrow function handlePostMessage: called when user clicks "Post" in context menu
  const handlePostMessage = () => {
    // Context menu is visible, selectedUser is set
    // MessagePopup component will handle message composition
    // Just hide the context menu
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Arrow function handleClosePopup: called when message popup is closed
  const handleClosePopup = () => {
    // Clear selected user and hide context menu
    setSelectedUser(null);
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Arrow function handleBackToHomepage: navigates user back to homepage
  // Uses useNavigate hook to change route
  const handleBackToHomepage = () => {
    navigate('/homepage');
  };

  // Conditional rendering: show loading message while fetching users
  if (isLoading) {
    return <div><p>Loading users...</p></div>;
  }

  // Return JSX: list of users and optional message popup
  return (
    <div>
      <h1>Users</h1>

      {/* Conditional rendering: display errors if any occurred */}
      {errors.length > 0 && (
        <div role="alert" style={{ color: 'red' }}>
          <ul>
            {/* .map() array method: create list item for each error */}
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Unordered list of users */}
      <ul>
        {/* .map() array method: iterate through users array and render each user */}
        {users.map((user) => (
          <li
            key={user.id}
            onContextMenu={(e) => handleContextMenu(e, user)}
            style={{ cursor: 'pointer', padding: '10px', listStyle: 'none' }}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {/* Conditional rendering: show context menu only if visible */}
      {contextMenu.visible && selectedUser && (
        <div
          style={{
            position: 'absolute',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: '#303662',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {/* Button to trigger message posting */}
          <button
            onClick={handlePostMessage}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Post Message
          </button>
        </div>
      )}

      {/* Conditional rendering: show message popup when user selected */}
      {selectedUser && (
        <MessagePopup
          selectedUser={selectedUser}
          onClose={handleClosePopup}
        />
      )}

      {/* Close context menu when clicking elsewhere on page */}
      {contextMenu.visible && (
        <div
          onClick={() => setContextMenu({ ...contextMenu, visible: false })}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}

      {/* Back to Homepage button - positioned at bottom */}
      <div style={{ marginTop: '30px', padding: '20px 0', borderTop: '1px solid #ccc' }}>
        <button
          onClick={handleBackToHomepage}
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default UserList;