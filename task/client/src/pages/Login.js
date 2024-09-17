// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/login.css'; // Import CSS stylesheet for login page styling
//Components
import MainHeader from '../components/MainHeader';//Import the MainHeader function component
import PageFooter from '../components/PageFooter';//Import the PageFooter function component
import LoginForm from '../components/LoginForm';//Import LoginForm function component

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
  const submitLogin = async () => {
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

   
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', userData.username);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token);
        // Update local state to indicate the user is logged in
        setLoggedIn(true);
        setError(null);// Clear any previous errors
        // Clear user data from state
        setUserData({
          username: '',
          password: '',
        });
      } else {
        throw new Error('Username or password are incorrect');// Throw error message if the POST request is unsuccessful
      }
    } catch (error) {
      // Handle errors during the login process
      setError(`Login Failed: ${error.message}`);//Set the error State with an error message
      console.log(`Login Failed: ${error.message}`);//Log an error message in the console for debugging purposes
      setLoggedIn(false);// Ensure loggedIn state is set to false
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
