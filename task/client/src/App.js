// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css'l//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';
//React-Router components
import {BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router components for routing
//Pages
import Page1 from './Pages/Page1';//Import Page1 (HOME) component
import Login from './Pages/Login';//Import LoginPage component
import Registration from './Pages/Registration'; //Import RegistrationPage component

//App Function Components
export default function App() {
  //=========STATE VARIABLES============
  //user variables
  const [users, setUsers] = useState([]);//State to store list of users
  const [userData, setUserData] = useState({//State to store userData
    username: '',
    email: '',
    dateOfBirth: '',
    admin: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({//State variable used to store Data about newUsers
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  //Event variables
  const [error, setError] = useState(null);
    //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);;// Boolean variable used to track if the user is logged in
  const [loggedOut, setLoggedOut] = useState(true);// Boolean variable used to track whether the user is currently logged out.

  //==========USE EFFECT HOOK TO FETCH ALL USERS==================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() =>{
    //Function to fetch all users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token')//Retrieve token from localStorage
        // Conditional rendering if token or login status is missing
        if (!token || ! loggedIn) {
          return; // Exit if no token is found or user is not logged in
        }
        
        const response = await fetch (`http://localhost:3001/users/findUsers`, {
          method: 'GET',//Http method
          mode: 'cors',//
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error ('Failed to fetch user data');
        } 

        const fetchedData = await response.json()
        setUsers(fetchedData)
      } 
      catch (error) {
        console.error('Error fetching user', error.message);  
        setError('Error fetching user');
      }
    }
    fetchUsers()
  },[loggedIn]);

  //==========REQUESTS===============
  //---------POST---------------
  //Function to submitLogin
  const submitLogin = async (e) => {//Define an async function to submit user login
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/login',{
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      })

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', userData.username)
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token)

        setLoggedIn(true);

        setError(null);
        setUserData({
          username: ' ',
          email: ' ',
          password: ' ',
        })

        console.log('User logged In');
      } else {
        throw new Error('Username or password are incorrect')
      }
    } catch (error) {
      setError(`Login Failed ${error.message}`);
      console.log(`Login Failed ${error.message}`); //Log an error message in the console for debugging purposes
      loggedOut()
      // setLoggedIn(false);
  }
  }
    //Function to add a new user
  const addUser = async (e) => {
    console.log('register new user');
    e.preventDefault();
    try {
      const response = await fetch ('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword,
        })
      })

      if (response.ok) {
        console.log('user successfully registerd.');
        setNewUserData(
          {
            newUsername: '',
            newEmail: '',
            newDateOfBirth: '',
            newAdmin: false,
            newPassword: ''
          });
      } else {
        throw new Error ('Error adding user')
      }

    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`); 
    }
  }
  //========EVENT LISTENERS==========

   /*Function to set the loggedOut status to false
  stating that the user is logged in*/
   const appLogin = () => {
     let token = localStorage.getItem('token'); // Retrieve token from localStorage
     //Condtional rendering to check if the token exists
     if (token) {
       setLoggedOut(false);// Set loggedOut state to false, indicating the user is logged in
     }
   }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedin')
    setLoggedIn(false)
    setError('');
    setUserData({ username: '', password: '' });
    ;
  }

  //=========JSX RENDERING=============
  return (
        <>
      <BrowserRouter>
        <Container className='appContainer'>
          <Routes>
            {loggedIn ? (
              <Route path='/home' element={<Page1 logout={logout}/>} />
            ) : (
              <>
                <Route path='/' element={
                    <Login
                      submitLogin={submitLogin}
                      userData={userData}
                      setUserData={setUserData}
                    />
                  }
                />
                <Route path='/reg' element={
                    <Registration
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
                  }
                />
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
 
  )
  }
