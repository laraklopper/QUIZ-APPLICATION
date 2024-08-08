// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';//Import CSS stylesheet
// React Router components
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]); 
  const [questions, setQuestions] = useState([])
  const [quiz, setQuiz] = useState(null);
  const [quizName, setQuizName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(
    { questionText: '', correctAnswer: '', options: ['', '', ''] })
  //Event variables
  const [error, setError] = useState(null);
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);

  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !loggedIn) return;

        //Send a GET request to the server 
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
        const token = localStorage.getItem('token');
        if (!token) return;

        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        //Response handling 
        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }

        const fetchedCurrentUser = await response.json();
        setCurrentUser(fetchedCurrentUser);
      } 
      catch (error) {
        console.error('Error fetching current user', error.message);
        setError('Error fetching current user');
      }
    };

    if (loggedIn) {
      fetchUsers();
      fetchCurrentUser();
    }
  }, [loggedIn]);

  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {//=>useCallback to stop infinite loop
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
      const quizData = await response.json();

      if (quizData && quizData.quizList) {
        setQuizList(quizData.quizList);
        // console.log(quizData);
      }

      
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes');
    }
  },[]);
    
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
      {/* App Container */}
        <Container>
          <Routes>
            {loggedIn ? (
              <>
                <Route path='/' element={
                  //Page1: HOME
                  <Page1
                    logout={logout}
                    error={error}
                    currentUser={currentUser}
                  />}
                />
                <Route path='/page2' element={
                  //Page2: GAME
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
                  />}
                />
                <Route path='/page3' element={
                  //Page3: Add Questions
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
                  //Login
                  <Login
                    userData={userData}
                    setUserData={setUserData}
                    setLoggedIn={setLoggedIn}
                    setError={setError}

                  />}
                />
                <Route path='/reg' element={
                  //Registration
                  <Registration
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    setError={setError}
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
