// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import { BrowserRouter, Route, Routes } from 'react-router-dom';// React Router components for routing
//Bootstrap
import Container from 'react-bootstrap/Container'; // Import the Container component from react-bootstrap
//Pages
import Login from './pages/Login';
import Registration from './pages/Registration';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';

//App function component
export default function App() {
  //=======STATE VARIABLES===============
  //User variables
  const [users, setUsers] = useState([]);// State to store fetched users
  const [currentUser, setCurrentUser] = useState(null);// State to store current user
  const [userData, setUserData] = useState({// State to manage user login data
    username: '',
    email: '',
    dateOfBirth: '',
    admin: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({// State to manage new user registration data
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]); // State to store fetched quizzes
  //Event variables
  const [error, setError] = useState(null);// State to manage error messages
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);// Boolean variable used to track if the user is logged in

  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token');// Retrieve token from localStorage
                // Conditional rendering if token or login status is missing
        if (!token || !loggedIn) return;

        const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',//HTTP request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
            'Authorization': `Bearer ${token}`,//Add the Authorization header containing the JWT token
          }
        });
        
      // Condtitional rendering to check if the response indicates success (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch users');//Throw an error message if GET request is unsuccessful
        }

        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users', error.message);
        setError('Error fetching users');
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {//Define an async function to fetch current user 
      try {
        const token = localStorage.getItem('token');// Retrieve token from localStorage
        if (!token) return;

        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',//HTTP request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
            'Authorization': `Bearer ${token}`,//Add the Authorization header containing the JWT token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json();
        setCurrentUser(fetchedCurrentUser);
      } catch (error) {
        console.error('Error fetching current user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching current user');
      }
    };

    if (loggedIn) {
      fetchUsers();
      fetchCurrentUser();
    }
  }, [loggedIn]);// Dependency array ensures this effect runs when loggedIn state changes

  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = async () => {//Define an async function to fetch quizzes
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/quiz/fetchQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
          'Authorization': `Bearer ${token}`,
        }
      });
      // Condtitional rendering to check if if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const quizData = await response.json();
      setQuizList(quizData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quizzes');
    }
  };

  //---------POST---------------------------
  //Function to submit Login
  const submitLogin = async (e) => {//Define an async function to submit login
    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password
        })
      });

      // Condtitional rendering to check if the response indicates success (status code 200-299)
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
        throw new Error('Username or password are incorrect');// Throw an error if the POST request is unsuccessful
      }
    } catch (error) {
      setError(`Login Failed: ${error.message}`);
      console.log(`Login Failed: ${error.message}`);//Log an error message in the console for debugging purposes
      setLoggedIn(false);
    }
  };

  //Function to register a new user
  const addUser = async () => {//Define an async function to add a new user
    try {
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
        },
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword
        })
      });

    // Condtitional rendering to check if if the response indicates success (status code 200-299)
      if (response.ok) {
        setNewUserData({
          // Convert newUserData into JSON string and send it as the request body
          newUsername: '',
          newEmail: '',
          newDateOfBirth: '',
          newAdmin: false,
          newPassword: ''
        });
        alert('New User successfully registered');// Show success message to the user

      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding user');
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  };
//===========EVENT LISTENERS============================

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
    setError('');
    setUserData({ username: '', password: '' });
  };

  //===========JSX RENDERING=============================

  return (
    <>
      <BrowserRouter>
        <Container>
          <Routes>
            {loggedIn ? (
              <>
                <Route path='/' element={
                  <Page1
                    logout={logout}
                    error={error}
                    currentUser={currentUser}
                  />}
                />
                <Route path='/page2' element={
                  <Page2
                    logout={logout}
                    fetchQuizzes={fetchQuizzes}
                    quizList={quizList}
                  />}
                />
                <Route path='/page3' element={
                  <Page3
                    // fetchQuizzes={fetchQuizzes}
                    quizList={quizList}
                    logout={logout}
                    setError={setError}
                    setQuizList={setQuizList}
                    fetchQuizzes={fetchQuizzes}
                  />}
                />
                <Route path='/page4' element={
                  <Page4
                    setError={setError}
                    logout={logout}
                    currentUser={currentUser}
                    setUsers={setUsers}
                    setLoggedIn={setLoggedIn}
                    users={users}
                  />}
                />
              </>
            ) : (
              <>
                <Route exact path='/' element={
                  <Login
                    submitLogin={submitLogin}
                    userData={userData}
                    setUserData={setUserData}
                  />}
                />
                <Route path='/reg' element={
                  <Registration
                    addUser={addUser}
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                  />}
                />
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  );
}
