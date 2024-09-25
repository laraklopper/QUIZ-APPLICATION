// Import necessary modules and packages
// Import the React module to use React functionalities
import React, { useEffect } from 'react';
import '../CSS/Page1.css';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import FormSelect from 'react-bootstrap/FormSelect'; 
//Components
import Header from '../components/Header'; 
import Footer from '../components/Footer';
import Instructions from '../components/Instructions';

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
      /*Conditional rendering to check if the user is logged in*/
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
          <Col xs={6} className='welcomeCol'>
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
          <Col className="scoreDisplayCol">
            <h2 className="h2">PAST SCORES</h2>
          </Col>
        </Row>        
        {/* Past scores */}
        <Row className='scoreDisplayRow'>
          <Col className="scoreDisplayCol">
            <div id="pastScoresOutput">
              {/* Conditional rendering to check if the user has any scores */}
              {userScores.length > 0 ? (
                <div id='pastScoresDisplay'>
                  {/* Select dropdown for quiz selection */}
                  <FormSelect
                    title={selectedQuiz || 'SELECT'}
                    aria-label="Select a Quiz"
                    value={selectedQuiz || ''}//The value of the selected quiz
                    onChange={(e) => setSelectedQuiz(e.target.value)}// Handle quiz selection
                    id='scoreList'
                  >
                    {/* Default option */}
                    <option value=" " disabled>SELECT SCORES</option>
                    {/* Map through the user scores and display 
                    them in the select dropdown */}
                    {userScores.map((score, index) => (
                      <option key={score._id || index} value={score.name}>
                        {score.name}
                      </option>
                    ))}
                  </FormSelect>
                  {/* Display quizResults scores for the selected quiz */}
                  {selectedQuiz && quizResults.length > 0 ? (
                    quizResults.map((score, index) => (
                      <div key={score._id || index} id='scoreDisplay'>
                          <div className='pastScoreField'> 
                            {/* Quiz Name */}
                            <label className='scoreLabel'>QUIZ NAME:</label>
                            <p className='scoreText'>{score.name}</p>
                        </div>
                        <div className='pastScoreField'>
                          {/* Display Highest Score for selected quiz */}
                          <label className='scoreLabel'>SCORE:</label>
                          <p className='scoreText'>Score: {score.score}</p>
                        </div>
                        <div className='pastScoreField'>
                          {/* Date of highest score */}
                          <label className='scoreLabel'>DATE:</label>
                          <p className='scoreText'>{new Date(score.date).toLocaleDateString()}</p>
                        </div>
                        <div className='pastScoreField'>
                          {/* Total number of attempts for the quiz */}
                            <label className='scoreLabel'>TOTAL ATTEMPTS:</label> 
                            <p className='scoreText'>Total Attempts: {score.attempts}</p>
                          </div>
                      </div>
                    ))
                  ) : (
                    //Message if no scores are available for the specific quiz
                    selectedQuiz && <p className="scoreError">No scores for this quiz</p>
                  )}
                </div>
              ) : (
                // Message if no scores are found
                <p className="scoreError">NO SCORES AVAILABLE</p>
              )}
            </div>
          </Col>
        </Row>
      </section>
    {/* Footer Component*/}
    <Footer logout={logout}/>
    </>
  )
}
