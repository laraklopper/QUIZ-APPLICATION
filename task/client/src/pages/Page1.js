// Import necessary modules and packages
import React, { useEffect } from 'react';// Import the React module to use React functionalities
import '../CSS/Page1.css';// Import the CSS file for the Page1 component's styling
//Bootstrap
import Row from 'react-bootstrap/Row'; // Bootstrap Row component for layout
import Col from 'react-bootstrap/Col'; // Bootstrap Col component for layout
import FormSelect from 'react-bootstrap/FormSelect'; // Bootstrap form select component
//Components
import Header from '../components/Header';//Import the Header function component
import Footer from '../components/Footer';//Import the Footer function component
import Instructions from '../components/Instructions';//Import Instructions function component

//Page1 function component
export default function Page1(//Export default Page1 function component
  { //PROPS PASSED FROM PARENT COMPONENT 
     logout,
    // scores,
    // setScores,
    loggedIn,
     currentUser,
     selectedQuiz,
     setSelectedQuiz,
     userScores = [],   
     fetchScores
    }
  ) {

  //==============USE EFFECT HOOK===============
// useEffect hook to fetch scores when the component mounts
    useEffect (() => {
      //Conditional rendering to check if the user is logged in
      if (loggedIn === true) {
        fetchScores()// Call the fetchScores function 
      }
      
    },[fetchScores, loggedIn])


  // Filter the results by the selected quiz name
  const quizResults = selectedQuiz
    // Filter the scores based on the selected quiz
    ? userScores.filter(score => score.name === selectedQuiz)  
    : [];//If no quiz is selected return an empty array
    
//========JSX RENDERING================

  return (
    <>
    {/* HEADER */}
      {/* Render the Header component with a heading prop */}
    <Header heading='HOME'/>
    {/* Section1: welcome message and instructions */}
      <section id="page1Section1">
        {/* Welcome message */}
        <Row className="welcomeRow">
          <Col xs={6}>
            <div id="welcomeMsg">
              <label id="welcomeLabel">
                <h2 id="welcomeHeading">WELCOME:</h2>
                {/* Display current user's username */}
                <h3 id="username">{currentUser?.username}</h3>
              </label>
            </div>
          </Col>
         {/* Instructions Section */}
          <Col xs={6} id="instructions">
            <Instructions/>         
          </Col>
        </Row>
      </section>
      {/* Section2 - Displays user's past scores */}
      <section className="section2">
        <Row className='scoreDisplayRow'>
          {/* Past Scores */}
          <Col>
            <h2 className="h2">PAST SCORES</h2>
          </Col>
        </Row>
        <Row className='scoreDisplayRow'>
          <Col xs={6} md={4} className='scoreDisplayCol'></Col>
          <Col xs={6} md={4} className="scoreDisplayCol">
            {/* PastScores */}
            <div id="pastScoresOutput">
              {/* Conditional rendering to check if there 
              are scores to display */}
              {userScores.length > 0 ? (
                <div className='userScores'>
                  {/* Dropdown for quiz selection */}
                  <Form.Select
                    title={selectedQuiz || 'SELECT'}
                    aria-label="Select"
                      id='scoreDisplay'
                      value={selectedQuiz || ''}
                    onChange={(e) => setSelectedQuiz(e.target.value)}
                  >
                    {/* Map through the user scores*/}
                    {userScores.map((scores, index)=> {
                        <option value>SELECT SCORES</option>            
                    })}
                    </Form.Select>                   
                  {/* Display quizResults scores for the selected quiz */}
                  {quizResults.length > 0 ? (
                    quizResults.map((score, index) => (
                      <div key={index}>
                        <p className='scoreText'>Quiz Name: {score.name}</p>
                        {/*Highest score*/}
                        <p className='scoreText'>Score: {score.score}</p>
                        {/*Date of highest score*/}
                        <p className='scoreText'>
                          Date: {new Date(score.date).toLocaleDateString()}</p>
                        {/*Total number of attempts*/}
                        <p className='scoreText'>Total Attempts: {score.attempts}</p>
                      </div>
                    ))
                  ) : (
                    // Message if no scores are available for a specific quiz
                    <p className="scoreError">No scores for this quiz</p>
                  )}
                </div>
              ) : (
                // If no scores are available, display a message
                <p className="scoreError">NO SCORES AVAILABLE</p>
              )}
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
      </section>
    {/* Footer Component*/}
    <Footer logout={logout}/>
    </>
  )
}
