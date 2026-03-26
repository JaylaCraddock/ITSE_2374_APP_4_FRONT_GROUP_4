//FOR USER STORY #3 - A user logs in using an email address and password created during registration. 


import { useNavigate } from "react-router-dom";


//Add a way to where user can switch from login screen to registration screen with button

const LoginScreen = () => {
    const navigate = useNavigate();

    const handleGoToRegister = () => {
        navigate('/register');
    };
    
    return (
        
        <div>
        <h1>User Login</h1>
        <div>

    <form>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
         />
      
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input type="password"
        id="password"
        name="password"
        placeholder="Enter your password"
         />
      
      </div>
    </form>

    </div>
    <p>Don't have an account? Click on Register</p>
    <button type="submit">Login</button>
        <button onClick={handleGoToRegister}>Go to Register</button></div>
    );
};

export default LoginScreen;