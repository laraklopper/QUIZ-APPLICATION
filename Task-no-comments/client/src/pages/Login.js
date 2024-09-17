// Import necessary modules and packages
import React, { useState } from 'react';
import '../CSS/login.css'; 
//Components
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import LoginForm from '../components/LoginForm'; 

//Login function component
export default function Login(
    {//PROPS PASSED FROM PARENT COMPONENT
        userData, 
        setUserData,
        setError,
        setLoggedIn
    }) {
      //=========STATE VARIABLES===============
  const [showPassword, setShowPassword] = useState(false);

      //=============REQUESTS==================
      //-------------POST------------------------------
      //Function to submitLogin
   const submitLogin = async () => {//Define an async function to submitLogin
    try {
         const token = localStorage.getItem('token');
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

        //Response handling
      if (response.ok) {
        const data = await response.json();
        // Store user details and token in localStorage
        localStorage.setItem('username', userData.username);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        setError(null);
        // Clear user data from state
        setUserData({
          username: '',
          password: '',
        });
      } 
      else {
        throw new Error('Username or password are incorrect');
      }
    } catch (error) {
      // Handle errors during the login process
      setError(`Login Failed: ${error.message}`);
      console.error(`Login Failed: ${error.message}`);
      setLoggedIn(false);
      alert('LOGIN FAILED');// Notify user of failure
    }
  };
 
 
 
    //======JSX RENDERING=========

return (
    <>
    {/* Main Header Component */}
    <MainHeader mainHeading='LOGIN'/>
    {/* Section1 */}
    <section className='section1'>
        {/* Login Form */}
        <LoginForm 
        userData={userData} 
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        submitLogin={submitLogin}
        setUserData={setUserData}
        />
    </section>
    {/* Footer */}
    <PageFooter/>
    </>
  )
}
