import React, { useEffect, useState } from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';

//Page1 function component
export default function Page1({logout, setUserData, setError, loggedIn, error, users}) {
  const [userData, setUserDataLocal] =useState({
    username: '',
    email: '',
    dateOfBirth: '',
    admin: '',
  })
  //=======REQUESTS==========
  //---------------GET REQUEST---------------------
  //Function to fetch a single user
  const fetchUser = async (userId) => {
    console.log('Fetch single user');
    try {
      const token = localStorage.getItem('token');
      if (!token || !loggedIn) return;

      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'GET',//Request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const fetchedUser = await response.json();
      setUserData(fetchedUser);
      setUserDataLocal(fetchedUser)
      return fetchedUser;
      // console.log(fetchedUser);
    }
    catch (error) {
      console.error('Error fetching user details:', error.message);
      setError('Error fetching user details:', error.message)
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('username');
    if (userId) {
      fetchUser(userId)
    }
  },);

  return (
    <>
    <Header heading='HOME'/>
    <section>
        <Row>
          <Col xs={6} md={4}>
          {/* Display a welcome message with the users username */}
          {error ? (
            <p id='errorMessage'>{error}</p>
          ):(
                <h2 className = 'h2'>WELCOME:{userData.username}</h2>
          )}
            
          </Col>
          <Col xs={12} md={8}>
          </Col>
        </Row>
    </section>
    <footer className='footer'>
        <Row>
          <Col xs={12} md={8}>
          </Col>          
            <LogoutBtn logout={logout}/>
        </Row>
    </footer>
    </>
  )
}
