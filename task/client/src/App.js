// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import {  Route, Routes, useNavigate } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';// Import the Container component from react-bootstrap
//Pages
import Login from './pages/Login';//Import Login function component 
import Registration from './pages/Registration';//Import Registration component
import Page1 from './pages/Page1';//Import Page1 function component(HOME)
import Page2 from './pages/Page2';//Import Page2 function component(GAME)
import Page3 from './pages/Page3';//Import Page3 function component(ADD QUESTIONS)
import Page4 from './pages/Page4';//Import Page4 function component(USER ACCOUNT)

//App function component
export default function App() {//Export default App function component
  //=======STATE VARIABLES===============
  //User variables
  const [users, setUsers] = useState([]);//State used to store a list of all the users
  const [currentUser, setCurrentUser] = useState(null);//State to store the user currently loggedIn
  const [userData, setUserData] = useState({//State to store userData for login
    username: '',        // Username entered in the login form
    email: '',           // Email entered in the login form
    dateOfBirth: '',     // Date of birth entered in the login form
    admin: '',           // Admin status, if applicable
    password: '',        // Password entered in the login form
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]);//State to store the List of all quizzes
  const [questions, setQuestions] = useState([]);//List of questions in the quit
  const [quiz, setQuiz] = useState(null);//Currently selected quiz
  const [quizName, setQuizName] = useState(''); // Name of the quiz
  const [currentQuestion, setCurrentQuestion] = useState({// Current question being added
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  });
  //Score variables
  const [userScores, setUserScores] = useState({// State to store the current user's quiz scores
    result: '',
    date: '',
    attemptNumber: ''
  });
  // const [scores, setScores] =useState([]);// State to hold scores
  // Event and UI-related states
  const [error, setError] = useState(null); //Error message
  const [loggedIn, setLoggedIn] = useState(false); //Boolean to track whether or not the user is currently logged in
  const [selectedQuiz, setSelectedQuiz] = useState(null);// State to store the selected quiz
  // Hook to navigate between different routes
  const navigate = useNavigate()
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        // Retrieve JWT token from localStorage for authentication
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) return;// If no token is found, exit the function

      // Send a GET request to the server to fetch users
         const response = await fetch('http://localhost:3001/users/findUsers', {
           method: 'GET',//HTTP request methode
           mode: 'cors',//Enable Cross-Origin Resource Sharing 
           headers: {
             'Content-Type': 'application/json',// Specify the content type for the request
             'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
          }
        });

        //Conditional rendering to check if the response is not OK (status code not in the range 200-299) 
        if (!response.ok) {
          throw new Error('Failed to fetch users');//Throw an error message if the GET request is unsuccessful
        }

        // Parse the JSON data from the response body
        const fetchedUsers = await response.json();
        setUsers(fetchedUsers); 
      } 
      catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching users');//Set the error state with an error message
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {
      try {
        // Retrieve JWT token from localStorage for authentication
        const token = localStorage.getItem('token');
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

        // Parse the JSON data from the response body
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
  }, [loggedIn,  navigate]);
 
  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {//Define an async function to fetchQuizzes
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
      
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type
          'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
        }
      });

      /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');//Throw an error message if the GET request is unsuccessful
      }
      const quizData = await response.json();// Parse the JSON data from the response body

      //Conditional rendering to ensure the data is an array
      if (quizData && Array.isArray(quizData.quizList)) {
        setQuizList(quizData.quizList);// Update the quizList state with the fetched quiz data
      } else {
        throw new Error('Invalid quiz data');// Throw error if the data format is incorrect
      }    
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quizzes');// Set error state with error message
    }
  },[]);


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
    /*Use the navigate function to redirect the
    user to the login page after logging out*/
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
                    setError={setError}
                    userScores={userScores}
                    setUserScores={setUserScores}
                    selectedQuiz={selectedQuiz}
                    setSelectedQuiz={setSelectedQuiz}
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
                      quizName={quizName}
                      setQuizName={setQuizName}
                      setQuiz={setQuiz}
                      setQuizList={setQuizList}
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}
                      questions={questions}
                      setQuestions={setQuestions}
                      currentUser={currentUser}
                      setUserScores={setUserScores}
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
