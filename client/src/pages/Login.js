// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import config from '../config';//Import configuration variables
//CSS stylesheets
import '../CSS/login.css'; // Import login css stylesheet
//Components
import MainHeader from '../components/MainHeader';//Import the MainHeader function component
import PageFooter from '../components/PageFooter';//Import the PageFooter function component
import LoginForm from '../components/LoginForm';//Import LoginForm function component

//Login function component
export default function Login(//Export the default Login function component
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
  const submitLogin = async () => {//Define an async function to submit user login
    try {
      const token = localStorage.getItem('token');// Retrieve token from localStorage 
      
      //Send a POST request to the server
      const response = await fetch(`${config.API_BASE_URL}/users/login`
        /*http://localhost:3001/users/login */, {
        method: 'POST',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify({// Convert user login data to JSON string
          username: userData.username,// Username from input field
          password: userData.password// Password from input field
        })
      });

      // Condtitional rendering to check if if the response indicates success (status code 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the response data as JSON
        // Store the username, login status, and token in localStorage 
        localStorage.setItem('username', userData.username);// Store the user's username in the localStorage under the key 'username'
        /* Store the login status of the user in the localStorage
        under the key 'loggedIn' Setting it to true if the user is logged in*/
        localStorage.setItem('loggedIn', true); 
        localStorage.setItem('token', data.token);/* Store the authentication token received 
        from the server in the localStorage under the key 'token'*/
        
        setLoggedIn(true);//Update the loggedIn state to true
        setError(null);// Clear any previous errors
        // Clear user data from state
        setUserData({
          username: '',
          password: '',
        });
      } else {
        throw new Error('Username or password are incorrect');//Throw an error message if the POST request is unsuccessful
      }
    } catch (error) {
      // Handle errors during the login process
      setError(`Login Failed: ${error.message}`);// Set error state with error message
      console.log(`Login Failed: ${error.message}`);//Log an error message in the console for debugging purposes
      setLoggedIn(false);// Set the login state to false
      alert('LOGIN FAILED');// Display an alert indicating the failure
    }
  };
 
 
    //======JSX RENDERING=========

  return (
    <>
    <div>
    {/* Header */}
      {/* Render the MainHeader 
      with 'LOGIN' as the heading */}
    <MainHeader mainHeading='LOGIN'/>
    {/* Section1: LoginForm */}
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
      </div>
    </>
  )
}
