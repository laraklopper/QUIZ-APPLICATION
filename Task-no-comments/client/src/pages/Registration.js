// Import necessary modules and packages
import React from 'react';
import '../CSS/registration.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import MainHeader from '../components/MainHeader';
import PageFooter from '../components/PageFooter';
import RegistrationForm from '../components/RegistrationForm';

//Registration Function Component
export default function Registration(
  {//PROPS PASSED FROM PARENT COMPONENT
    newUserData, 
    setNewUserData,
    setError
  }
  ) {

  //==========REQUESTS========================
  //------------POST------------------------
     //Function to register a new user  
  const addUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/register', {
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
      });

      if (response.ok) {
        setNewUserData({
          newUsername: '',
          newEmail: '',
          newDateOfBirth: '',
          newAdmin: false,
          newPassword: ''
        });
        alert('New User successfully registered')
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding user');
      }
    } catch (error) {
      setError(`Error adding new user: ${error.message}`);
      console.error(`Error adding new user: ${error.message}`);
    }
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
