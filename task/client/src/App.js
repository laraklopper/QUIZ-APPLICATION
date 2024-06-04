import React, { useState } from 'react';// Import the React module to use React functionalities
import '../src/App.css';//Import CSS styling sheets
import Container from 'react-bootstrap/Container';// Import Container component from 'react-bootstrap'
import Page1 from './pages/Page1';// Import Page1 (HOME) component
import Page2 from './pages/Page2';// Import Page2 (GAME) component
import Page3 from './pages/Page3';// Import Page3 (ADD QUESTIONS) component
import Page4 from './pages/Page4';// Import Page4  (USER ACCOUNT) component
import LoginPage from './pages/LoginPage';// Import Login component
import RegistrationPage from './pages/RegistrationPage';// Import Registration component

//App function component
export default function App() {//Export default App function component
  //======STATE VARIABLES========
  //User variables
  const [users, setUsers] = useState('')
  const [userData, setUserData] = useState({
    username: ' ',
    email: ' ',
    dateOfBirth: ' ',
    isAdmin: ' ',
    password: ' ',
  })
  const [newUserData, setNewUserData] = useState({// State to store new user data during registration
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false, // Default value for admin
    newPassword: ''
  });
  //Event variables
   const [error, setError] = useState(null)
  //State to manage user login
  const [loggedIn, setLoggedIn] = useState(false)

  //================REQUESTS============================
   //------------POST----------------
  //Function to submit login
   const submitLogin = async (userData) => {//Define an async function to submitLogin
    e.prevent.default()
    try {
      // Send a POST request to the server for user login
      const response = await fetch ('http://localhost:3001/users/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          
        })
      })
      const data = await response.json();
      if (response.ok) {
       
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', true);

        setLoggedIn(true);
        setUserData({ username: ' ', email: '', password: ' ' })
        console.log(data);
      
      } 
      else {
        throw new Error('Username or password incorrect')        
      }
    } 
    catch (error) {
      setError(`Login Failed ${error.message}`);
      console.log(`Login Failed ${error.message}`);
      setLoggedIn(false);
    }
  };

  //Function to add a new User
const addUser = async (e) => {//Define an async function to add a new user
    console.log('Register new user');
    e.preventDefault();
    try {
      //Send a POST request to the register endpoint
      const response = ('http://localhost:3001/users/register', {
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
          password: newUserData.newPassword
        })
      })

      const data = await response.json();

      if (response.ok) {
        alert('User Successfully Registered')
        //console.log('User successfully registered');
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
        throw new Error('Error adding new user');
        setError(data.message);
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`); 
    }
  }
  
  //================JSX RENDERING================

  return (
    <>
      <Routes>
        {loggedIn ? (
          <Container className='appContainer'>
          <Route key='/' path= '/' element={<Page1 heading="HOME"/>}/>
          <Route key='/page2' path='/page2' element={<Page2 heading="GAME"/>}/>
          <Route key='/page3' path='/page3' element={<Page3 heading="ADD QUESTIONS"/>}/>
          <Route key='/page4' path='/page4' element={<Page4 heading="USER ACCOUNT"/>}/>
          </Container>
        ):(
          <Container className='appContainer'>
          <Route key="/" exact path='/' element={
          <LoginPage 
          mainHeading="LOGIN"
            submitLogin={submitLogin}
              userData={userData}
                setUserData={setUserData}
            />} />
          <Route key="/reg" path='/reg' element={<RegistrationPage mainHeading="REGISTER"/>}/>
          </Container>
        )}
      </Routes>
    </>
  )
}
