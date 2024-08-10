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
      const [showPassword, setShowPassword] = useState(false);// State to toggle password visibility

      //=============REQUESTS==================
      //-------------POST------------------------------
      //Function to submitLogin
  const submitLogin = async () => {//Define an async function to submitLogin
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Enable CORS
        headers: {
          'Content-Type': 'application/json',//Specigy the Content-Type in request body
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

      //Response handling
      if (response.ok) {
        const data = await response.json();// Parse JSON response to get token
          // Store authentication data in localStorage
        localStorage.setItem('username', userData.username);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token);
          // Update state to reflect successful login
        setLoggedIn(true);
        setError(null);
          // Clear user data from state
        setUserData({
          username: '',
          password: '',
        });
      } else {
        throw new Error('Username or password are incorrect');//Throw an error message if the Username or password is incorrect
      }
    } catch (error) {
      setError(`Login Failed: ${error.message}`);//Set the Error state with and error message
      console.log(`Login Failed: ${error.message}`);//Log an error message in the console for debugging purpose
      setLoggedIn(false);//Set the logged in State to false
      alert('LOGIN FAILED');// Notify the user of failure
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
