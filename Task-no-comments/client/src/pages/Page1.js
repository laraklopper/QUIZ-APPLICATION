// Import necessary modules and packages
import React, { useState } from 'react';
import '../CSS/Page1.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import PastScores from '../components/PastScores';

//Page1 function component
export default function Page1(
  { //PROPS PASSED FROM PARENT COMPONENT 
    logout,
    error, 
    setError,
     currentUser
    }
  ) {
  //=======STATE VARIABLES==============
  const [scores, setScores] = useState([]);// State to hold scores
    
//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database
const fetchScores = async () => {
  try {
    const token =localStorage.getItem('token')
    const response = await fetch (`http://localhost:3001/findScores`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error('Unable to fetch user scores')
    }

    const quizScores = await response.json(); // Await response.json() to get data
    setScores(quizScores); // Update state with fetched scores
    
  } catch (error) {
    console.error('Error fetching userScores', error.message);
    setError('Error fetching userScores', error.message)    
  }
} 

//========JSX RENDERING================

  return (
    <>
    {/* HEADER */}
      {/* Render the Header component with a heading prop */}
    <Header heading='HOME'/>
    {/* Section1 */}
    <section id='page1Section1'>
      {/* Welcome message */}
      <Row className='welcomeRow'>
        <Col xs={6}>
        {/* Display an error message if user is not found */}
        {error ? (
              // Show the error message if there's an error
              <p className='errorMessage'>{error}</p>
        ):(
          <div id='welcomeMsg'>
            <label id='welcomeLabel'>
              <h2 id='welcomeHeading'>WELCOME:</h2>
                    {/* Display the current user's username */}
              <h3 id='username'>{currentUser?.username}</h3>
            </label>
          </div>
        )}
        </Col>
        {/* Instructions Section */}
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
    {/* Section2 - Displays a users past scores*/}
    <section className='section2'>
      <Row>
        {/* Past Scores */}
        <Col>
        <h2 className='h2'>PAST SCORES</h2>
        </Col>
      </Row>
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} className='scoreDisplayCol'>
          {/* PastScores component */}
            <PastScores fetchScores={fetchScores} scores={scores}/>
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
    </section>
    {/* Footer */}
    <Footer logout={logout}/>
    </>
  )
}
