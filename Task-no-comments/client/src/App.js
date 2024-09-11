// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
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
const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    username: '',        
    email: '',           
    dateOfBirth: '',     
    admin: '',           
    password: '',        
  });
  //Quiz variables
    const [quizList, setQuizList] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [quizName, setQuizName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState({
      questionText: '',
      correctAnswer: '',
      options: ['', '', ''],
    });
    const [userScores, setUserScores] = useState({
      result: '',
      date: '',
      attemptNumber: ''
    });
  // const [scores, setScores] =useState([]);
  // Event and UI-related states
  const [error, setError] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false); 
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  // Hook to navigate between different routes
  const navigate = useNavigate()
  
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
 useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {
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
        const token = localStorage.getItem('token');
        if (!token) return;
        
        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',// Specify the content type 
            'Authorization': `Bearer ${token}`,// Attach JWT token 
          }
        });

        //Response handling
        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }

        // Parse the JSON data from the response body
        const fetchedCurrentUser = await response.json();
        setCurrentUser(fetchedCurrentUser);
      }
      catch (error) {
        console.error('Error fetching current user', error.message);
        setError('Error fetching current user');
      }
    };

    //Conditional rendering to check if the user is logged in
    if (loggedIn) {
      fetchUsers();// Call the FetchUsers function
      fetchCurrentUser();//Call the FetchCurrentUser function 
    }
  }, [loggedIn,  navigate]);
 
 
  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {//Define an async function to fetch quizzes
    try {
      
      const token = localStorage.getItem('token');
      
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type
          'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
        }
      });
      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const quizData = await response.json();

      if (quizData && Array.isArray(quizData.quizList)) {
        setQuizList(quizData.quizList);// Update the quizList state 
      } else {
        throw new Error('Invalid quiz data');
      }
    
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes');
    }
  },[])

 

//===========EVENT LISTENERS============================
 // Function to handle user logout
  /* useCallback hook is to handle user logout, 
  memoized to avoid unnecessary re-renders*/
  const logout = useCallback (() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn'); 
    /* Update local state to reflect that the
    user is no longer logged in*/
    setLoggedIn(false);
    setError(''); 
    setUserData({ username: '', password: '' });
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
