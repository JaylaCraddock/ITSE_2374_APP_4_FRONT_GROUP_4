import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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