// Import necessary modules and packages
import React, { useState } from 'react';
import '../CSS/registration.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import RegistrationForm from '../components/RegistrationForm';

//Registration Function Component
export default function Registration(//Export the default Registration component
  {//PROPS PASSED FROM PARENT COMPONENT
    setError
  }
  ) {
    //===============STATE VARIABLES=================
  // State to manage new user data
  const [newUserData, setNewUserData] = useState({
    newUsername: '',
    newEmail: '',
    newDateOfBirth: '',
    newAdmin: false,
    newPassword: '',
  });
  //==========REQUESTS========================
  //------------POST------------------------
     //Function to register a new user  
  const addUser = async () => {//Define an async function to register a new user
    try {
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/users/register', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type as JSON
        },
        // Convert newUserData object to JSON string for the request body
        body: JSON.stringify({
          username: newUserData.newUsername,
          email: newUserData.newEmail,
          dateOfBirth: newUserData.newDateOfBirth,
          admin: newUserData.newAdmin,
          password: newUserData.newPassword
        })
      });
      
      //Response handling
      if (response.ok) {
        // Clear new user data from state
        setNewUserData({
          newUsername: '',
          newEmail: '',
          newDateOfBirth: '',
          newAdmin: false,
          newPassword: ''
        });
        alert('New User successfully registered')
      } else {
        // Handle errors if response is not successful
        const errorData = await response.json();

        throw new Error(errorData.message || 'Error adding user');
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`);
    }
  };
  };
   
  //========JSX RENDERING=================

  return (
   <>
   {/* Header */}
   <MainHeader mainHeading='REGISTRATION'/>
   {/* Section1/ */}
   <section className='section1'>
        <Row className='regisRow'>
          <Col>
            <h3 className='h3'>ENTER REGISTRATION DETAILS</h3>
          </Col>
        </Row>
        {/* Regisrtration Form */}
    <RegistrationForm
    newUserData={newUserData}
    addUser={addUser}
    setNewUserData={setNewUserData}
    />
        
   </section>
   <section className='section2'>
        <Row>
          <Col xs={12} md={8}>
            <ul className='rulesList'>
              <li className='rule'>
                <h3 id='regisRequire'>REGISTRATION REQUIREMENTS:</h3>
                </li>
              <li className='rule'>
                THE USERNAME DOES NOT HAVE TO BE THE USERS REAL NAME
              </li>
              <li className='rule'>
                USERNAME AND PASSWORD MUST BE UNIQUE
              </li>
              <li className='rule'>
                PASSWORDS MUST BE AT LEAST 8 CHARACTERS
              </li>
              <li className='rule'>
                USERS MAY ONLY ON INITIAL REGISTRATION REGISTER AS AN
                ADMIN USER
              </li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
          </Col>
        </Row>
   </section>
   {/* Footer */}
   <PageFooter/>
   </>
  )
}
