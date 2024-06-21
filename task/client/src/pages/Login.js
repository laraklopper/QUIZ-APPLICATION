// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
import '../CSS/login.css';//Import CSS File
//Components
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import LoginForm from '../components/LoginForm';

//Login function component
export default function Login(//Export default Login function component
  {//PROPS PASSED FROM PARENT COMPONENT
    submitLogin, 
    userData, 
    setUserData
  }
) {

  //======EVENT LISTENER===============
 // Event listener for handling user login data changes
    const handleUserLogin = (event) => {
      const { name, value } = event.target;
      // Update userData state with new values
      setUserData((prevState) => (
        { ...prevState, [name]: value }
      ));
    };

    // Event listener to handle user Login
    const handleLogin = (e) => {
        e.preventDefault()
        console.log('logging In');
        submitLogin();
    }
  //=========JSX RENDERING==============

  return (
    <>
    {/* Header */}
    <MainHeader mainHeading='LOGIN'/>
    {/* Section1 */}
    <section className='section1'>
        {/* Login Form */}
        <LoginForm 
        handleUserLogin={handleUserLogin} 
        userData={userData} 
        handleLogin={handleLogin}/>
    </section>
    {/* Footer */}
    <PageFooter/>
    </>
  )
}
