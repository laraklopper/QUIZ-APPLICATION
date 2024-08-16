// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';// Import the Container component from react-bootstrap
//Pages
import Login from './pages/Login';// Import Login page component
import Registration from './pages/Registration';// Import Registration page component
import Page1 from './pages/Page1';// Import Page1 component
import Page2 from './pages/Page2';// Import Page2 component
import Page3 from './pages/Page3';// Import Page3 component
import Page4 from './pages/Page4';// Import Page4 component

//App function component
export default function App() {
  //=======STATE VARIABLES===============
  //User variables
  const [users, setUsers] = useState([]); // State to store an array of the list of users
  const [currentUser, setCurrentUser] = useState(null);// State to store the currently logged-in user's details.
  const [userData, setUserData] = useState({ // State to manage user data 
    username: '', // Username entered by the user during login
    email: '', // Email of the user 
    dateOfBirth: '', // User's date of birth
    admin: '', // Admin status
    password: '', // Password entered by the user during login
  });
  const [newUserData, setNewUserData] = useState({// State to manage new user data for registration
    newUsername: '', // Username for a new user during registration
    newEmail: '', // Email for a new user during registration
    newDateOfBirth: '', // Date of birth for a new user during registration
    newAdmin: false, // Admin status for the new user (false by default)
    newPassword: '' // Password for a new user during registration
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]); //State to store the quizList
  const [questions, setQuestions] = useState([])// State to store the list of quizzes
  const [quiz, setQuiz] = useState(null);// State to store quiz questions
  const [quizName, setQuizName] = useState('');// State to store the selected quiz
  const [currentQuestion, setCurrentQuestion] = useState({ // State to store the current question details
    questionText: '', // The text of the current question
    correctAnswer: '', // The correct answer for the current question
    options: ['', '', ''] // The available options for the current question
  });
  // Event and UI-related states
  const [error, setError] = useState(null); // State to store error messages to display to the user
  const [loggedIn, setLoggedIn] = useState(false); // State to track whether the user is logged in

  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
        if (!token || !loggedIn) return;// If no token or not logged in, exit the function

      // Send a GET request to the server to fetch users
         const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',//HTTP request method
           mode: 'cors',//Set the mode to cors, allowing cross-origin requests
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
            'Authorization': `Bearer ${token}`,// Include the token in the Authorization header
          }
        });

        //Response handling
        // Conditional rendering to check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch users');//Throw an error message if the GET request is unsuccessful
        }

        const fetchedUsers = await response.json();//Parse the response data
        setUsers(fetchedUsers); // Update the users state with the fetched data
      } 
      catch (error) {
        console.error('Error fetching users', error.message);// Set error message in the error state
        setError('Error fetching users');//Log an error message in the console for debugging purposes
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {// Define an async function to fetch the current user details
      try {
        const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
        if (!token) return;// If no token is found, exit the function

        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
            'Authorization': `Bearer ${token}`,// Include the token in the Authorization header
          }
        });

        //Response handling 
        // Conditional rendering to check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if the GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json();//Parse the JSON response
        setCurrentUser(fetchedCurrentUser);  // Update the currentUser state with the fetched data
      } 
      catch (error) {
        console.error('Error fetching current user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching current user');// Set the error state to display an error message
      }
    };

    if (loggedIn) {// If the user is logged in, fetch users and the current user details
      fetchUsers();
      fetchCurrentUser();
    }
  }, [loggedIn]);
 // Dependency array: re-run the effect when `loggedIn` changes

  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {//Define an async function to fetch all quizzes
    try {
      const token = localStorage.getItem('token');// Retrieve the authentication token from localStorage
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
          'Authorization': `Bearer ${token}`,// Include the token in the Authorization header
        }
      });

      //Response handling
      // Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');//Throw an error message if the GET is unsuccessful
      }
      const quizData = await response.json();//Parse the response data

      // Conditional rendering to check if quiz data is available
      if (quizData && quizData.quizList) {
        setQuizList(quizData.quizList); // Update the quizList state with the fetched quizzes
        // console.log(quizData);
      }
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);//Log the fetched data in the console for debugging purpose
      setError('Error fetching quizzes');// Set error message in the error state
    }
  },[]);
  // The useCallback hook ensures that the function is not recreated on every render
    
//===========EVENT LISTENERS============================

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('username'); // Remove the username from localStorage
    localStorage.removeItem('loggedIn'); // Remove the loggedIn status from localStorage
    setLoggedIn(false); // Set the loggedIn state to false
    setError(''); // Clear any errors
    setUserData({ username: '', password: '' }); // Reset the userData state
  };


  //===========JSX RENDERING=============================

  return (
    <>
      <BrowserRouter>
      {/* App Container */}
        <Container>
          <Routes>
            {loggedIn ? (
              <>
                {/* Route for Page1: HOME */}
                <Route  path='/' element={
                    <Page1
                      logout={logout} // Pass the logout function to handle user logout
                      error={error} // Pass error messages to display on the home page
                      currentUser={currentUser} // Pass the current user details to the home page
                    />
                  }
                />
                {/* Route for Page2: GAME */}
                <Route
                  path='/page2'
                  element={
                    <Page2
                      logout={logout} // Pass the logout function to handle user logout
                      fetchQuizzes={fetchQuizzes} // Pass the function to fetch quizzes
                      setError={setError} // Pass the function to set error messages
                      quizList={quizList} // Pass the list of quizzes to display
                      quiz={quiz} // Pass the currently selected quiz
                      setQuizName={setQuizName} // Pass the function to set the quiz name
                      setQuiz={setQuiz} // Pass the function to set the selected quiz
                      setQuizList={setQuizList} // Pass the function to update the quiz list
                      currentQuestion={currentQuestion} // Pass the current question details
                      setCurrentQuestion={setCurrentQuestion} // Pass the function to set the current question
                      questions={questions} // Pass the list of questions for the selected quiz
                      setQuestions={setQuestions} // Pass the function to set the list of questions
                    />
                  }
                />
                {/* Route for Page3: Add Questions */}
                <Route path='/page3' element={
                    <Page3
                      quizName={quizName} // Pass the name of the quiz to which questions are being added
                      setQuizName={setQuizName} // Pass the function to set the quiz name
                      quizList={quizList} // Pass the list of available quizzes
                      loggedIn={loggedIn} // Pass the login status
                      logout={logout} // Pass the logout function
                      setError={setError} // Pass the function to set error messages
                      setQuizList={setQuizList} // Pass the function to update the quiz list
                      fetchQuizzes={fetchQuizzes} // Pass the function to fetch quizzes
                      error={error} // Pass the current error message
                      currentUser={currentUser} // Pass the current user details
                      setCurrentUser={setCurrentUser} // Pass the function to set the current user
                      currentQuestion={currentQuestion} // Pass the current question details
                      setCurrentQuestion={setCurrentQuestion} // Pass the function to set the current question
                      userData={userData} // Pass the user data (for login)
                      questions={questions} // Pass the list of questions for the selected quiz
                      setQuestions={setQuestions} // Pass the function to set the list of questions
                      setUserData={setUserData} // Pass the function to update user data
                    />
                  }
                />
                {/* Route for Page4: User Account*/}
                <Route path='/page4' element={
                    <Page4
                      setError={setError} // Pass the function to set error messages
                      logout={logout} // Pass the logout function
                      currentUser={currentUser} // Pass the current user details
                      setUsers={setUsers} // Pass the function to update the users list
                      setLoggedIn={setLoggedIn} // Pass the function to update the login status
                      users={users} // Pass the list of all users
                    />
                  }
                />
              </>
            ) : (
              <>
                {/* Route for Login */}
                <Route exact path='/' element={
                    <Login
                      userData={userData} // Pass the user data for login
                      setUserData={setUserData} // Pass the function to update user data
                      setLoggedIn={setLoggedIn} // Pass the function to update the login status
                      setError={setError} // Pass the function to set error messages
                    />
                  }
                />
                {/* Route for Registration */}
                <Route
                  path='/reg'
                  element={
                    <Registration
                      newUserData={newUserData} // Pass the data for registering a new user
                      setNewUserData={setNewUserData} // Pass the function to update new user data
                      setError={setError} // Pass the function to set error messages
                    />
                  }
                />
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  );
}
