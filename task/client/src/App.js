// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import {  Route, Routes, useNavigate } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';
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
  const [users, setUsers] = useState([]);//State to store the list of users
  const [currentUser, setCurrentUser] = useState(null);//State to store the user currently loggedIn
  const [userData, setUserData] = useState({//State to store userData for login
    username: '',        // Username entered in the login form
    email: '',           // Email entered in the login form
    dateOfBirth: '',     // Date of birth entered in the login form
    admin: '',           // Admin status, if applicable
    password: '',        // Password entered in the login form
  });
  const [newUserData, setNewUserData] = useState({// State to manage the registration form data
    newUsername: '',     // Username entered in the registration form
    newEmail: '',        // Email entered in the registration form
    newDateOfBirth: '',  // Date of birth entered in the registration form
    newAdmin: false,     // Admin status (false by default)
    newPassword: '',     // Password entered in the registration form
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]);//State to sto the list of all the quizzes
  const [questions, setQuestions] = useState([]);//State to store the list of questions in the quiz
  const [quiz, setQuiz] = useState(null);//State to store the currently selectedQuiz
  const [quizName, setQuizName] = useState('');//State to store the QuizName
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  });
   const [userScores, setUserScores] = useState({// State to store the current user's quiz scores
    result: '',
    date: '',//date format
    attemptNumber: ''//number format
  });
  // Event and UI-related states
  const [error, setError] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false); 

  const navigate = useNavigate()
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {//Define an async function fetch all users
      try {
        const token = localStorage.getItem('token');// Retrieve JWT token from localStorage for authentication
        if (!token || !loggedIn) return;// If no token is found, exit the function

      // Send a GET request to the server to fetch users
         const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',
           mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        //Response handling
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        //Parse the response data
        const fetchedUsers = await response.json();
        setUsers(fetchedUsers); 
      } 
      catch (error) {
        console.error('Error fetching users', error.message);
        setError('Error fetching users');
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');// Retrieve JWT token from localStorage for authentication
        if (!token) return;// If no token is found, exit the function
        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin resource sharing mode
          headers: {
           'Content-Type': 'application/json',// Specify the content type of the request
            'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
          }
        });

         /* Conditional rendering to check if the response
               is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if the GET request is unsuccessful
        }

         const fetchedCurrentUser = await response.json();    // Parse and set the current user's details
        setCurrentUser(fetchedCurrentUser);// Update state with fetched user details
      }
      catch (error) {
        console.error('Error fetching current user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching current user');// Set the error state and an error messsage
      }
    };
//Conditional rendering to check if the user is logged in
    if (loggedIn) {
      fetchUsers();// Call the FetchUsers function to fetch the list of users
      fetchCurrentUser();//Call the FetchCurrentUser function to fetch the current user's details
    }
  }, [loggedIn,  navigate/*, fetchUsers, fetchCurrentUser*/);
// Dependency array:
  // - `loggedIn`: The effect will run whenever the `loggedIn` state changes.
  // - `navigate`: The effect will also run if the `navigate` function changes (though it's usually stable).
  // - Including `fetchUsers` and `fetchCurrentUser` ensures that the effect re-runs if these functions change.
  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const quizData = await response.json();//Parse the response data
      
      if (quizData && Array.isArray(quizData.quizList)) {
        setQuizList(quizData.quizList)
      } else {
        throw new Error('Invalid quiz data')
      }
      // if (quizData && quizData.quizList) {
      //   // Update the quizList state with the fetched quizzes
      //   setQuizList(quizData.quizList); 
      //   // console.log(quizData);
      // }
  
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes');
    }
  },[]);
  /* The useCallback hook ensures that the function is not 
  recreated on every render*/
    
//===========EVENT LISTENERS============================
  // Function to handle user logout
  /* useCallback hook is to handle user logout, 
  memoized to avoid unnecessary re-renders*/
  const logout = useCallback (() => {
    // Remove JWT token from localStorage to clear authentication
    localStorage.removeItem('token');
    localStorage.removeItem('username');// Remove username from localStorage
    localStorage.removeItem('loggedIn');  // Remove logged-in status from localStorage
    // Update local state to reflect that the user is no longer logged in
    setLoggedIn(false);
    setError(''); // Clear any existing error messages
    setUserData({ username: '', password: '' });//Reset the userData
    //Use the navigate function to redirect the user to the home page after logging out
    navigate('/');
  }, [navigate]);

  //===========JSX RENDERING=============================

  return (
    <>
      {/* App Container */}
        <Container>
          <Routes>
    {/* Routes available if user is logged */}
            {loggedIn ? (
              <>
                {/* Route for Page1: HOME */}
                <Route path='/' element={
                  <Page1
                    logout={logout} 
                    error={error} 
                    currentUser={currentUser} 
                  />
                }
                />
                {/* Route for Page2: GAME */}
                <Route
                  path='/page2'
                  element={
                    <Page2
                      logout={logout}
                      fetchQuizzes={fetchQuizzes}
                      setError={setError}
                      quizList={quizList}
                      quiz={quiz}
                      setQuizName={setQuizName}
                      setQuiz={setQuiz}
                      setQuizList={setQuizList}
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}
                      questions={questions}
                      setQuestions={setQuestions}
                      currentUser={currentUser}
                    />
                  }
                />
                {/* Route for Page3: Add Questions */}
                <Route path='/page3' element={
                  <Page3
                  quizName={quizName}
                  setQuizName={setQuizName}
                  quizList={quizList}
                  loggedIn={loggedIn}
                  logout={logout}
                  setError={setError}
                  setQuizList={setQuizList}
                  fetchQuizzes={fetchQuizzes}
                  error={error}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  currentQuestion={currentQuestion}
                  setCurrentQuestion={setCurrentQuestion}
                  userData={userData}
                  questions={questions}
                  setQuestions={setQuestions}
                  setUserData={setUserData}
                  />
                }
                />
                {/* Route for Page4: User Account*/}
                <Route path='/page4' element={
                  <Page4
                    setError={setError} 
                    logout={logout}
                    currentUser={currentUser} 
                    setUsers={setUsers} 
                    setLoggedIn={setLoggedIn}
                    users={users} 
                  />
                }
                />
              </>
            ) : (
              <>
             {/* Routes available when the user is not logged in */}
                {/* Route for Login */}
                <Route exact path='/' element={
                  <Login
                    userData={userData} 
                    setUserData={setUserData} 
                    setLoggedIn={setLoggedIn} 
                    setError={setError} 
                  />
                }
                />
                {/* Route for Registration */}
                <Route
                  path='/reg'
                  element={
                    <Registration
                      newUserData={newUserData} 
                      setNewUserData={setNewUserData} 
                      setError={setError} 
                    />
                  }
                />
              </>
            )}
          </Routes>         
        </Container>
    </>
  );
}
