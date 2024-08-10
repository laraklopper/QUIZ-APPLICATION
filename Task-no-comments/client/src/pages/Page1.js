// Import necessary modules and packages
import React from 'react';
import '../CSS/Page1.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header'
import Footer from '../components/Footer';

//Page1 function component
export default function Page1(
  { //PROPS PASSED FROM PARENT COMPONENT 
    logout,
     error, 
     currentUser
    }
  ) {
 
//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database

//========JSX RENDERING================

  return (
    <>
    {/* HEADER */}
    <Header heading='HOME'/>
    {/* Section1 */}
    <section id='page1Section1'>
      {/* Welcome message */}
      <Row className='welcomeRow'>
        <Col xs={6}>
        {/* Display an error message if user is not found */}
        {error ? (
          <p className='errorMessage'>{error}</p>

        ):(
          <div id='welcomeMsg'>
            <label id='welcomeLabel'>
              <h2 id='welcomeHeading'>WELCOME:</h2>
              <h3 id='username'>{currentUser?.username}</h3>
            </label>
          </div>
        )}
        </Col>
          <Col xs={6} id='instructions'>
            <h2 id='instructionsHeading'>HOW TO PLAY:</h2>
            {/* Explain how the application works */}
            <ul id='instructText'>
              <li className='instruction'>
                Select a quiz from the list</li>
              <li className='instruction'>
                Select the optional timer option</li>
              <li className='instruction'>
                Each quiz consists of 5 multiple choice questions</li>
              <li className='instruction'>
                Users are not authorised to play quiz they created</li>
            </ul>
          </Col>
      </Row>
    </section>
    {/* Section2 */}
    <section className='section2'>
      <Row>
        {/* Past Scores */}
        <Col>
        <h2 className='h2'>PAST SCORES</h2>
        </Col>
      </Row>
        <Row>
          <Col xs={6} md={4}>
          {/* Button to view past scores */}
            <Button 
              variant="primary" 
              type='button' 
              id='pastScoresBtn'>
                VIEW PAST SCORES
              </Button>
          </Col>
          <Col xs={12} md={8}>
          </Col>
        </Row>
    </section>
    {/* Footer */}
    <Footer logout={logout}/>
    </>
  )
}
