// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import { BrowserRouter, Route, Routes } from 'react-router-dom';// React Router components for routing
//Bootstrap
import Container from 'react-bootstrap/Container'; // Import the Container component from react-bootstrap
//Pages
import Login from './pages/Login';// Import the Login component {mainHeading='REGISTRATION'}
import Registration from './pages/Registration';// Import the Registration Page {mainHeading='REGISTRATION'}
import Page1 from './pages/Page1';// Import the Page1 component {heading='HOME'}
import Page2 from './pages/Page2';// Import the Page2 component {heading='GAME'}
import Page3 from './pages/Page3';// Import the Page3 component {heading='ADD QUIZ'}
import Page4 from './pages/Page4';// Import the Page4 component {heading='USER ACCOUNT'}

//App function component
export default function App() {//Export default App function component
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
    // const [quiz, setQuiz] = useState(null)
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
        //Send a POST request to the /findUsers endpoint
        const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
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

        //Send a GET request to the server to fetch the current user
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
            'Authorization': `Bearer ${token}`,//Add the Authorization header containing the JWT token
          }
        });
        
      // Conditional rendering to check if the response indicates success (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json();//Parse the response data
        setCurrentUser(fetchedCurrentUser);// Update currentUser state
      } catch (error) {
        console.error('Error fetching current user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching current user');// Set error message in the error state
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
      const token = localStorage.getItem('token');//Retrieve the token from local storage
      const response = await fetch('http://localhost:3001/quiz/fetchQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
          'Authorization': `Bearer ${token}`,
        }
      });
      // Condtitional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const quizData = await response.json();//Parse the response data
      setQuizList(quizData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quizzes');
    }
  };

  
/*
    // Function to fetch a single quiz by ID
 const fetchQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch (`http://localhost:3001/quiz/${quizId}`,{
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const quizData = await response.json();
      console.log(quizData);


    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Error fetching quiz');
    }
  }
  */
  
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
    } 
    catch (error) {
      setError(`Login Failed: ${error.message}`);// Set error state with error message
      console.log(`Login Failed: ${error.message}`);//Log an error message in the console for debugging purposes
      setLoggedIn(false);
      alert('Login Failed')
    }
  };

  //Function to register a new user
  const addUser = async () => {//Define an async function to add a new user
    try {
      //Send a POST request to the register endpoint
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
    localStorage.removeItem('token');// Remove token from local storage
    localStorage.removeItem('username');// Remove username from local storage
    localStorage.removeItem('loggedIn'); // Remove login status from local storage
    setLoggedIn(false);// Update loggedIn state
    setError(''); // Clear error state
    setUserData({ username: '', password: '' });// Clear userData state
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
