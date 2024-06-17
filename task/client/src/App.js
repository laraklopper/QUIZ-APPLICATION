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
  //user variables
  const [users, setUsers] = useState([]);//State to store list of users
  const [userData, setUserData] = useState({//State to store userData
    username: '',
    email: '',
    dateOfBirth: '',
    admin: '',
    password: '',
  });
  const [newUserData, setNewUserData] = useState({//State variable used to store Data about newUsers
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: ''
  });
  // Quiz variables
  const [quizList, setQuizList] = useState([])
  //Event variables
  const [error, setError] = useState(null);//State to handle errors during data fetching
    //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false);;// Boolean variable used to track if the user is logged in

  //==========USE EFFECT HOOK TO FETCH ALL USERS==================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() =>{
    //Function to fetch all users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token')//Retrieve token from localStorage
        // Conditional rendering if token or login status is missing
        if (!token || ! loggedIn) {
          return; // Exit if no token is found or user is not logged in
        }
        //Send a GET request to the /users/findUsers endpoint
        const response = await fetch (`http://localhost:3001/users/findUsers`, {
          method: 'GET',//HTTP request method
          mode: 'cors',//Set the mode to cors allowing Cross-Origin-Requests
          headers: {
            'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload 
            'Authorization': token,//Add the Authorization header containing the JWT token
          }
        });
        //Response handling
        // Conditional rendering if the response indicates success (status code 200-299)
        if (!response.ok) {
          throw new Error ('Failed to fetch user data');//Throw an error message if GET request is unsuccessful
        } 

        const fetchedData = await response.json()//parse the response data as JSON
        setUsers(fetchedData);//Log the fetchedData in the console for debugging purposes
      } 
      catch (error) {
        console.error('Error fetching user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching user');//Set an error message in the error state
      }
    }
    fetchUsers()
  },[loggedIn]);

  //==========REQUESTS===============
  //--------GET-------------
 /* const fetchUser = async (userId) => {
    console.log('Fetch single user');
    try {
      const token = localStorage.getItem('token');
      if (!token || !loggedIn) return

      const response = await fetch (`http://localhost:3001/users/${userId}`, {
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
  }*/

  
  //Function to fetch Quizzes
  const fetchQuizzes = async () => {//Define an async function to fetch quizzes from the database
    // console.log('Fetch quiz');
    try {
      const token = localStorage.getItem('token')//Retrieve the token from localStorage
      //Send a GET request to the /users/fetchQuiz endpoint
      const response = await fetch('http://localhost:3001/users/fetchQuiz', {
        method: 'GET',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
          'Authorization': `Bearer ${token}`,
        }
      })
      //Response handling
// Conditional rendering if the response indicates success (status code 200-299)

      if (response.ok) {
        const quizData = await response.json();// Parse JSON response
        setQuizList(quizData);
        // console.log(quizData);//Log a message in the console for debugging purposes
      } else {
        throw new Error('Failed to fetch quizzes')//Throw an error message stating theat the request is unsuccessful
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debuggging purposes
      setError('Error fetching quizzes:', error)//Set the error state with an error message
    }
  }
  //---------POST---------------
  //Function to submitLogin
  const submitLogin = async (e) => {//Define an async function to submit user login
    e.preventDefault();// Prevent the default form submission behavior
    try {
            // Send a POST request to the server for user login
      const response = await fetch('http://localhost:3001/users/login',{
        method: 'POST',//Http request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
        },
        body: JSON.stringify({// Convert user login data to JSON string
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      })
// Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        const data = await response.json();//Parse the response data as JSON
        localStorage.setItem('username', userData.username)// Store the user's username in the localStorage under the key 'username'
        localStorage.setItem('loggedIn', true);/* Store the login status of the user in the localStorage under the key 'loggedIn'
        Setting it to true indicates that the user is logged in*/
        localStorage.setItem('token', data.token)/* Store the authentication token received 
        from the server in the localStorage under the key 'token'*/

        setLoggedIn(true);//Update the loggedIn state to true

        setError(null);
        setUserData({//Clear the UserData input
          username: ' ',
          email: ' ',
          password: ' ',
        })

        console.log('User logged In');//Log a message in the console for debugging purposes
        console.log(data);//Log a message in the console for debugging purposes
      } else {
        throw new Error('Username or password are incorrect')
      }
    } catch (error) {
      setError(`Login Failed ${error.message}`);//Set the error state with an error message
      console.log(`Login Failed ${error.message}`); //Log an error message in the console for debugging purposes
      setLoggedIn(false);//Update the logged in State to false
  }
  }
    //Function to add a new user
  const addUser = async (e) => {//Define an async function to add a new user
    console.log('register new user');//Log a message in the console for debugging purposes
    e.preventDefault();//Prevent default form submission behaviour
    try {
      //Send a POST request to the register endpoint
      const response = await fetch ('http://localhost:3001/users/register', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors allowing cross-origin requests
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
// Condtitional rendering to check if if the response indicates success (status code 200-299)
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
      } else {
        throw new Error ('Error adding user')//Throw an error message indicating the request was unsuccessful
      }

    } catch (error) {
      setError(`Error adding new user: ${error.message}`); //Set the error state with an error message
      console.error(`Error adding new user: ${error.message}`);  //Log an error message in the console for debugging purposes
    }
  }
  //========EVENT LISTENERS==========

   /*Function to set the loggedOut status to false
  stating that the user is logged in*/
   const appLogin = () => {
     let token = localStorage.getItem('token'); // Retrieve token from localStorage
     //Condtional rendering to check if the token exists
     if (token) {
       setLoggedOut(false);// Set loggedOut state to false, indicating the user is logged in
     }
   }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedin')
    setLoggedIn(false)
    setError('');
    setUserData({ username: '', password: '' });
    ;
  }

  //=========JSX RENDERING=============
  return (
        <>
      <BrowserRouter>
        <Container className='appContainer'>
          <Routes>
            {loggedIn ? (
              <Route path='/home' element={<Page1 logout={logout}/>} />
            ) : (
              <>
                <Route path='/' element={
                    <Login
                      submitLogin={submitLogin}
                      userData={userData}
                      setUserData={setUserData}
                    />
                  }
                />
                <Route path='/reg' element={
                    <Registration
                      addUser={addUser}
                      newUserData={newUserData}
                      setNewUserData={setNewUserData}
                    />
                  }
                />
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
 
  )
  }
