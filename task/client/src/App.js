import React, { useEffect, useState } from 'react';
import './App.css'
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Page1 from './Pages/Page1';
import Login from './Pages/Login';
import Registration from './Pages/Registration';


export default function App() {
  //=========STATE VARIABLES============
  //user variables
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    admin: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  //Event variables
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  //==========USE EFFECT HOOK TO FETCH ALL USERS==================
  useEffect(() =>{
    //Function to fetch all users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token || ! loggedIn) {
          return
        }
        const response = await fetch (`http://localhost:3001/users/findUsers`, {
          method: 'GET',
          mode: 'cors',
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
  const submitLogin = async (e) => {
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
        localStorage.setItem('token', data)

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
      setLoggedIn(false);
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
              <Route path='/' element={<Page1 logout={logout}/>} />
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