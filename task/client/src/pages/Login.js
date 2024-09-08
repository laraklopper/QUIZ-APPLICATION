// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/login.css'; // Import CSS stylesheet for login page styling
//Components
import MainHeader from '../components/MainHeader';//Import MainHeader function component
import PageFooter from '../components/PageFooter';//Import PageFooter function component
import LoginForm from '../components/LoginForm'; //Import LoginForm function component

//Login function component
export default function Login(//Export default Login function component
    {//PROPS PASSED FROM PARENT COMPONENT
        userData, 
        setUserData,
        setError,
        setLoggedIn
    }) {
      //=========STATE VARIABLES===============
  const [showPassword, setShowPassword] = useState(false);// Boolean to control the visibility of the password field

      //=============REQUESTS==================
      //-------------POST------------------------------
      //Function to submitLogin
  const submitLogin = async () => {//Define an async function for userLogin
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the request body is JSON
        },
        body: JSON.stringify({// Convert userData object to JSON string for the request body
          username: userData.username,
          password: userData.password
        })
      });

          /* Conditional rendering to check if the response is successful 
      (status code in the range 200-299)*/
      if (response.ok) {
        const data = await response.json();// Parse the JSON response from the server
        // Store user details and token in localStorage
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
