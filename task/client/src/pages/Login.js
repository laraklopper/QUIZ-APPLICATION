// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/login.css';// Import CSS file for styling
//Components
import MainHeader from '../components/MainHeader';// Import MainHeader component
import PageFooter from '../components/PageFooter';// Import PageFooter component
import LoginForm from '../components/LoginForm'; // Import LoginForm component

//Login function component
export default function Login(//Export default Login function component
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
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
        },
        body: JSON.stringify({// Convert user login data to JSON string
          username: userData.username,// Username from input field
          password: userData.password// Password from input field
        })
      });

      //Response handling
        // Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        const data = await response.json();// Parse JSON response to get token
          // Store authentication data in localStorage
        localStorage.setItem('username', userData.username);// Store the user's username in the localStorage under the key 'username'
          /* Store the login status of the user in the localStorage under the key 'loggedIn'
        Setting it to true indicates that the user is logged in*/
        localStorage.setItem('loggedIn', true);
          /* Store the authentication token received 
        from the server in the localStorage under the key 'token'*/
        localStorage.setItem('token', data.token);
          
        setLoggedIn(true);//Update the loggedIn state to true
        setError(null);//Clear any previous error messages          
        setUserData({username: '',password: '',});// Clear user data from state
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
    {/* Section1 - Contains the Login Form */}
    <section className='section1'>
        {/* Login Form Component*/}
        <LoginForm 
        userData={userData} // Pass user data to the LoginForm
        showPassword={showPassword}// Pass the state for password visibility
        setShowPassword={setShowPassword}// Pass function to toggle password visibility
        submitLogin={submitLogin}// Pass the submitLogin function to handle form submission
        setUserData={setUserData}// Pass function to update user data
        />
    </section>
    {/* Footer Component*/}
    <PageFooter/>
    </>
  )
}
