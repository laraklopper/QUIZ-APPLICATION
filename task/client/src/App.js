// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css'l//Import CSS stylesheet
//Bootstrap
import Container from 'react-bootstrap/Container';
//React-Router components
import {BrowserRouter, Routes, Route } from 'react-router-dom'; // React Router components for routing
//Pages
import Page1 from './Pages/Page1';//Import Page1 (HOME) component
import Login from './Pages/Login';//Import LoginPage component
import Registration from './Pages/Registration'; //Import RegistrationPage component

//App Function Components
export default function App() {
  //=========STATE VARIABLES============
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
  // Quiz variables
  const [quizList, setQuizList] = useState([])
  //Event variables
  const [error, setError] = useState(null);
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);;

  //==========USE EFFECT HOOK TO FETCH ALL USERS==================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() =>{
    //Function to fetch all users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token || ! loggedIn) {
          return; 
        }
        //Send a GET request to the /users/findUsers endpoint
        const response = await fetch (`http://localhost:3001/users/findUsers`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        //Response handling
        if (!response.ok) {
          throw new Error ('Failed to fetch user data');
        } 

        const fetchedData = await response.json();
        setUsers(fetchedData);
      } 
      catch (error) {
        console.error('Error fetching user', error.message);
        setError('Error fetching user');
      }
    }
      //Function to fetch a currentUser
 const fetchCurrentUser = async () => {
    // console.log('Fetch current user');
    try {
      const token = localStorage.getItem('token');
      if (!token || !loggedIn) return

      const response = await fetch ('http://localhost:3001/users/userId', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
          const fetchedUser = await response.json();
          setUserData(fetchedUser);
          return fetchedUser;
    } catch (error) {
          console.error('Error fetching user details:', error.message);
          setError('Error fetching user details:', error.message)
    }
  }

  },[loggedIn]);

  //==========REQUESTS===============
  //--------GET-------------
  

  
  //Function to fetch Quizzes
  const fetchQuizzes = async () => {//Define an async function to fetch quizzes from the database
    console.log('Fetch quiz');
    try {
      const token = localStorage.getItem('token');
      //Send a GET request to the /users/fetchQuiz endpoint
      const response = await fetch('http://localhost:3001/users/fetchQuiz', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      //Response handling
      if (response.ok) {
        const quizData = await response.json();// Parse JSON response
        setQuizList(quizData);
        console.log(quizData);
      } else {
        throw new Error('Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes:', error);
    }
  }
  //---------POST---------------
  //Function to submitLogin
  const submitLogin = async (e) => {//Define an async function to submit user login
    e.preventDefault();
    try {
      // Send a POST request to the server for user login
      const response = await fetch('http://localhost:3001/users/login',{
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({// Convert user login data to JSON string
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      })

      //Response handling
      if (response.ok) {
        const data = await response.json();//Parse the response data as JSON
        localStorage.setItem('username', userData.username)
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('token', data.token)/* Store the authentication token received 
        from the server in the localStorage under the key 'token'*/

        setLoggedIn(true);//Update the loggedIn state to true

        setError(null);
        setUserData({//Clear the UserData input
          username: ' ',
          email: ' ',
          password: ' ',
        })

        console.log('User logged In');
        console.log(data);
      } else {
        throw new Error('Username or password are incorrect')
      }
    } catch (error) {
      setError(`Login Failed ${error.message}`);
      console.log(`Login Failed ${error.message}`);
      setLoggedIn(false);
  }
  }
    //Function to add a new user
  const addUser = async (e) => {//Define an async function to add a new user
    console.log('register new user');
    e.preventDefault();
    try {
      //Send a POST request to the register endpoint
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

      //Response handling
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
      } 
      else {
        throw new Error ('Error adding user');
      }

    } catch (error) {
      setError(`Error adding new user: ${error.message}`); 
      console.error(`Error adding new user: ${error.message}`);  
    }
  }
  //========EVENT LISTENERS==========

   /*Function to set the loggedOut status to false
  stating that the user is logged in*/
   const appLogin = () => {
     let token = localStorage.getItem('token');
     if (token) {
       setLoggedOut(false);
     }
   }

    //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedin')
    setLoggedIn(false)
    setError('');
    setUserData({ username: '', password: '' });
  }

  //=========JSX RENDERING=============
  return (
        <>
      <BrowserRouter>
        <Container className='appContainer'>
          <Routes>
            {loggedIn ? (
              <Route path='/home' element={<Page1 logout={logout} />} />
              <Route path='/page2' element={ <Page2 logout={logout} fetchQuizzes={fetchQuizzes}/>}/>
              <Route path='/page3' element={<Page3  fetchQuizzes={fetchQuizzes} quizList={quizList} logout={logout}/>}/>
               <Route path='/page4' element={ <Page4 setError={setError} logout={logout} currentUser={currentUser} setUsers={setUsers} setLoggedIn={setLoggedIn} />}/>
            ) : (
              <>
                <Route path='/' element={ <Login submitLogin={submitLogin} userData={userData}setUserData={setUserData}/>} />
                <Route path='/reg' element={ <Registration addUser={addUser} newUserData={newUserData} setNewUserData={setNewUserData}/>}/>
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </> 
  )
  }
