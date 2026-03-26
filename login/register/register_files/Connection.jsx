// Used for connecting everything as well as 
// storing the routes for the pages in this document

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import RegistrationScreen from './RegisterScreen.jsx'
import LoginScreen from './LoginScreen.jsx'
import EmailConfirm from './EmailConfirmation.jsx'


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
      </Routes>
    </Router>
  </StrictMode>,
)
