// Import necessary modules and packages
// Import the React module to use React functionalities
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
// React Router components
import {  Route, Routes, useNavigate } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';
//Pages
import Login from './pages/Login';//LOGIN
import Registration from './pages/Registration';//REGISTRATION
import Page1 from './pages/Page1';//HOME
import Page2 from './pages/Page2';//GAME
import Page3 from './pages/Page3';//ADD QUESTIONS
import Page4 from './pages/Page4';//USER ACCOUNT

//App function component
export default function App() {//Export default App function component
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
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  //Score variables
  const [userScores, setUserScores] = useState({ 
    result: '',
    date: '',
    attemptNumber: ''
  });
  const [scores, setScores] =useState([]);
  // Event and UI-related states
  const [error, setError] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false);
  

  //===========Navigation======================
  // Hook to navigate between different routes
  const navigate = useNavigate()
  
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) return;

      // Send a GET request to the server to fetch users
         const response = await fetch('http://localhost:3001/users/findUsers', {
           method: 'GET',//HTTP request method
           mode: 'cors',
           headers: {
             'Content-Type': 'application/json',// Specify the Content-Type
             'Authorization': `Bearer ${token}`,// Attach JWT token 
          }
        });

        //Response handling
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const fetchedUsers = await response.json();// Parse the JSON data from the response body
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
        
        const token = localStorage.getItem('token');
        if (!token) return;

        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',//HTTP request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type
            'Authorization': `Bearer ${token}`,// Attach JWT token 
          }
        });
     
      //Response handling
        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }
       // Parse and set the current user's details
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
      /* Call the FetchUsers function to 
      fetch the list of users*/
      fetchUsers();
      /*Call the FetchCurrentUser function to fetch the 
      current user's details*/
      fetchCurrentUser();
    }
  }, [loggedIn,  navigate]);
 
  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {  
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem('token');
      
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type 
          'Authorization': `Bearer ${token}`,// Attach JWT token 
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
        // Update the quizList state with the fetched quiz data
        setQuizList(quizData.quizList);
      } else {    
        throw new Error('Invalid quiz data');// Throw error if the data format is incorrect
      }    
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quizzes');// Set the error state to display the error in the UI
    }
  },[setQuizList, setError]);

  //Function to fetch scores list from database
const fetchScores= useCallback(async () => {
  try {
    //Retrieve the JWT token from LocalStorage
    const token = localStorage.getItem('token');
    //Retrieve the username from localStorage
    const username = localStorage.getItem('username')
    
    //send GET request to server to find scores
    const response = await fetch(`http://localhost:3001/scores/findScores/${username}`, {
      method: 'GET',//HTTP request method
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json', //Specify the Content-Type 
        'Authorization': `bearer ${token}`,//Attatch the token
      }
    })
    
    //Response handling
    // if (response.status === 401) throw new Error('Unauthorized access. Please log in.');
     if (!response.ok) {
      throw new Error('Unable to fetch user scores');
     }

     const quizScores = await response.json();//Parse JSON response

    if (quizScores && quizScores.userScores && Array.isArray(quizScores.userScores)) {
      setUserScores(quizScores.userScores); // Update state with fetched scores
    }
    else {     
      throw new Error('Invalid data type');
    }

  } catch (error) {
    console.error('Error fetching userScores', error.message);
    setError(`Error fetching userScores: ${error.message}`);
  }
},[setUserScores, setError]);
//===========EVENT LISTENERS============================
  // Function to handle user logout
  const logout = useCallback (() => {
    //Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');  
    setLoggedIn(false);
    setError(''); 
    setUserData(
      { 
        username: '', 
        password: '' 
      });//Reset the userData
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
                   scores={scores}
                    setScores={setScores}
                    logout={logout} 
                    loggedIn={loggedIn}
                    quizName={quizName}
                    error={error} 
                    currentUser={currentUser} 
                    setError={setError}
                    userScores={userScores}
                    setUserScores={setUserScores}
                    selectedQuiz={selectedQuiz}
                    setSelectedQuiz={setSelectedQuiz}
                    fetchScores={fetchScores}
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
