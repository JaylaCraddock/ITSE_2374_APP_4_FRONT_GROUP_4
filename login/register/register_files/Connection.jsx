// Used for connecting everything as well as 
// storing the routes for the pages in this document

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import './Decorations.css';
import RegistrationScreen from './RegisterScreen.jsx'
import LoginScreen from './LoginScreen.jsx'
import EmailConfirm from './EmailConfirmation.jsx'
import Homepage from './Homepage.jsx'
import UserList from './UserList.jsx'

// import "tailwindcss";

//private route components to protect homepage
const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return isLoggedIn ? element: <Navigate to='/login' replace />;
};



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Creating a path for the user to be to 
    switch from User Registration to Login. 
    As well as for the login page to switch to the 
    registration. */}
    <Router>
      <Routes>

        <Route path='/' element={<Navigate to='/register' replace />} />

        <Route path='/register' element={<RegistrationScreen />} />

        <Route path='/login' element={<LoginScreen />} />
      
        <Route path='/verify-email' element={<EmailConfirm />} />

        <Route path='/homepage' element={<PrivateRoute element={<Homepage />} />} />

        <Route path='/users' element={<PrivateRoute element={<UserList />} 
        />} />
       
      </Routes>
    </Router>
  </StrictMode>,
)
