import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import { Routes, Route } from 'react-router-dom';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
//App function component
export default function App() {
  //======STATE VARIABLES========
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
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState(null)

  //================================

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
          <Route key="/" exact path='/' element={<LoginPage mainHeading="LOGIN"/>} />
          <Route key="/reg" path='/reg' element={<RegistrationPage mainHeading="REGISTER"/>}/>
          </Container>
        )}
      </Routes>
    </>
  )
}
