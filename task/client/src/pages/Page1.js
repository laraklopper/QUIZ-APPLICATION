// Import necessary modules and packages
import React, { /*useEffect,*/useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page1.css'
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Dropdown from 'react-bootstrap/Dropdown'; // Bootstrap Dropdown for quiz selection
import DropdownButton from 'react-bootstrap/DropdownButton'; // Dropdown button for displaying quizzes
import Button from 'react-bootstrap/Button';  // Import the Button component from react-bootstrap
//Components
import Header from '../components/Header';//Import the Header function component
import Footer from '../components/Footer';//Import the Footer function component
// import PastScores from '../components/PastScores';

export default function Page1(
  { //PROPS PASSED FROM PARENT COMPONENT 
    logout,
    error, 
    setError,
    currentUser,
    selectedQuiz,
    setSelectedQuiz,
    userScores,
    setUserScores
    }
  ) {
  //=======STATE VARIABLES==============   
 const [scores, setScores] =useState([]);// State to hold past scores
 
//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database
  const fetchScores = async () => {//Define an async function to fetch userScores
  try {
    // Retrieve the JWT token from local storage
    const token =localStorage.getItem('token')
    //Send a GET request to the server to find scores
    const response = await fetch (`http://localhost:3001/scores/findScores`, {
      method: 'GET',// HTTP request method
      mode: 'cors',//Enable Cross-Origin resource sharing mode
      headers: {
        'Content-Type': 'application/json',// Specify the content type as JSON
        'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
      }
    })

    /* Conditional rendering to check if the response
           is not successful (status code is not in the range 200-299)*/
    if (!response.ok) {
      // Throw an error if GET request status is not OK(unsuccessful)
      throw new Error('Unable to fetch user scores');
    }

    const quizScores = await response.json(); // Parse the JSON data from the response
    // Conditional rendering to check if the response data is valid and contains an array of user scores
    if (quizScores && Array.isArray(quizScores.userScores)) {
      setUserScores(quizScores.userScores); // Update the state with the fetched scores
    } 
    else {
      throw new Error('Invalid data type')// Throw an error if the data format is incorrect
    }
    
  } catch (error) {
    console.error('Error fetching userScores', error.message);//Log an error message in the console for debugging purposes
    setError('Error fetching userScores', error.message); // Set the error message in the error state    
  }
} 

  // Filter the results by the selected quiz name
  const quizResults = selectedQuiz
    // If a quiz is selected, filter the userScores array to only include scores for the selected quiz
    ? userScores.filter(score => score.quizName === selectedQuiz) 
    : []; // If no quiz is selected, set quizResults to an empty array
//========JSX RENDERING================

  return (
    <>
    {/* HEADER */}
      {/* Render the Header component with a heading prop */}
    <Header heading='HOME'/>
    {/* Section1: welcome message and instructions */}
    <section id='page1Section1'>
      {/* Welcome message */}
      <Row className='welcomeRow'>
        <Col xs={6}>
          <div id='welcomeMsg'>
            <label id='welcomeLabel'>
              <h2 id='welcomeHeading'>WELCOME:</h2>
                    {/* Display the current user's username */}
              <h3 id='username'>{currentUser?.username}</h3>
            </label>
          </div>   
        </Col>
        {/* Instructions Section */}
          <Col xs={6} id='instructions'>
            <h2 id='instructionsHeading'>HOW TO PLAY:</h2>
            {/* Explain how the application works */}
            <ul id="instructText">
              <li className="instruction">Select a quiz from the list</li>
              <li className="instruction">Select the optional timer option</li>
              <li className="instruction">Each quiz consists of 5 multiple choice questions</li>
              <li className="instruction">Users are not authorized to play quizzes they created</li>
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
          <Col xs={6} md={4} className="scoreDisplayCol">
            {/* PastScores */}
            <div id="pastScoresOutput">
              {/* Button to trigger fetching past scores */}
              <Button variant="primary" type="button" onClick={fetchScores}>
                FETCH SCORES
              </Button>
              {/* Conditional rendering to check if there are scores to display */}
              {userScores.length > 0 ? (
                <div>
                  {/* Dropdown for quiz selection */}
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={selectedQuiz || 'Select a Quiz'}
                  >
                    {/* Map through the user scores and display them in the dropdown */}
                    {userScores.map((score, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => setSelectedQuiz(score.quizName)}
                      >
                        {score.quizName}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                  {/* Display quizResults scores for the selected quiz */}
                  {quizResults.length > 0 ? (
                    quizResults.map((score, index) => (
                      <div key={index}>
                        {/*Quiz name*/}
                        <p>Quiz Name: {score.quizName}</p>
                        {/*Highest score*/}
                        <p>Score: {score.score}</p>
                        {/*Date of highest score*/}
                        <p>Date: {new Date(score.date).toLocaleDateString()}</p>
                        {/*Total number of attempts*/}
                        <p>Total Attempts: {score.attempts}</p>
                      </div>
                    ))
                  ) : (
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
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
    </section>
    {/* Footer */}
    <Footer logout={logout}/>
    </>
  )
}
