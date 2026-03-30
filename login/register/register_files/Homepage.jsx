// Author - Jayla Craddock 
// Date - 3/30/26
// Description - The purpose of this page is to allow 
// users to access the homepage.

//For user story #3 - A user logs in using an email address and password created during registration. 

//Currently not able to have the login feature
// fully function as I need to wait for the next iteration for the backend to fix the CORS policy block
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Using useEffect hook to see if the user is logged in as well as a if statement whether or not to let them through to the homepage
    useEffect(() =>{
        //Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');

        if(!isLoggedIn || !userData) {
            //Redirect to login if not logged in
            navigate('/login');
            return;
        }

        //Parse and set user data
        setUser(JSON.parse(userData));
     }, [navigate]);

     const handleLogout = () => {
        //clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        //navigate to login
        navigate('/login');
     };

     if (!user) {
        return <div>Loading...</div>;
     }

     //What the user sees on the homepage
     return (
        <div>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <h2>Hello, {user.name}!</h2>
            </div>

            <div style={{ marginTop: '60px' }}>
                <h1>Welcome to your homepage</h1>
                <p><strong>Email:</strong> {user.email}</p>

                <button onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 20px' }}>Logout</button>
            </div>
        </div>
     );

};

export default Homepage;