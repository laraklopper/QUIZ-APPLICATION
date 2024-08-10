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
  const submitLogin = async () => {
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

      //Response handling
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', userData.username);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token);
        setLoggedIn(true);
        setError(null);
        setUserData({
          username: '',
          password: '',
        });
      } else {
        throw new Error('Username or password are incorrect');
      }
    } catch (error) {
      setError(`Login Failed: ${error.message}`);
      console.log(`Login Failed: ${error.message}`);
      setLoggedIn(false);
      alert('LOGIN FAILED');
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
