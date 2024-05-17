import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Page1 from './pages/Page1'; // User account
import Page2 from './pages/Page2'; // User Bets
import Page3 from './pages/Page3'; // Sports Events
import Page4 from './pages/Page4'; // Users
import Registration from './pages/Registration'; // Registration page
import Login from './pages/Login'; // Login page

//App function component
export default function App() {
  //=======STATE VARIABLES=================
  //User variables
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    dateOfBirth : '',
    countryOfResidence: '',
    admin: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newCountryOfResidence: '', 
    newAdmin: false, // Default value
    newPassword: ''
  });
  const [users, setUsers] = useState([])
  //Event variables
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  //=========================================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) {
          return; // Exit the function if the token or login status is missing
        }
        const response = await fetch(`http://localhost:3001/users/findUsers`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const fetchedData = await response.json();
        console.log(fetchedData); 
      } 
      catch (error) {
        console.error('Error fetching user:', error.message);
        setError(`Error fetching users ${error.message}`)
      }
    };
    fetchUsers()
  }, [loggedIn])

  
  //==============REQUESTS===========================
  //function to submit login
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('username', userData.username);
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', true);
        setLoggedIn(true); 
        setUserData({ username: '', password: '' });
      } else {
        throw new Error('Username or password are incorrect');
      }
    } catch (error) {
      console.error(`Login Failed ${error.message}`);
      setError(`Login Failed ${error.message}`);
      setLoggedIn(false);
    }
  };

  const addUser = async (e) => {
    console.log('register new user');
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          countryOfResidence: newUserData.newCountryOfResidence,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword
        }),
      })
      if (response.ok) {
        console.log('User successfully registered');
        setNewUserData(
          { 
          newUsername: '', 
          newEmail: '', 
          newDateOfBirth: '', 
          newCountryOfResidence: '', 
          newPassword: '' });
      }
      else {
        throw new Error('Error adding new user');
      }
    } catch (error) {
      console.error(`Error adding new user: ${error.message}`);
    }
  }

  //=============EVENT VARIABLES===============
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false)
    ;
  }


  //===============JSX RENDERING================

  return (
    <>
      <Container className='appContainer'>
        <Routes>
          {loggedIn ? (
            <>
                  <Route path="/" element={
                  <Page1 
                  heading="USER ACCOUNT"  
                  error={error} 
                  handleLogout={handleLogout} 
                  setUsers={setUsers} 
                  loggedIn={loggedIn}
                  userData={userData}
                  />} />
                  <Route path="/page2" element={<Page2 heading="USER BETS" />} />
                  <Route path="/page3" element={<Page3 heading="SPORT EVENTS"/>} />
                    <Route path="/page4" element={
                    <Page4 
                    heading="USERS"
                    users={users}
                    setUsers={setUsers}
                    setError={setError}
                    error={error}
                     />} />
            </>
          ) : (
            <>
              <Route exact path="/" element={<Login 
              userData={userData} 
              setUserData={setUserData} 
              submitLogin={submitLogin} />} />
              <Route path="/reg" element={<Registration 
               newUserData={newUserData}
               setNewUserData={setNewUserData}
               addUser={addUser}
               />} />
            </>
          )}
        </Routes>
      </Container>
    
   </>
  );
}
