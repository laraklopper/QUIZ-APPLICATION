// Import necessary modules and packages
import React, { useEffect, useCallback } from 'react';// Import the React module to use React functionalities
import '../CSS/Page1.css'//Import CSS stylesheet
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Dropdown from 'react-bootstrap/Dropdown';// Import the Dropdown component from react-bootstrap
import DropdownButton from 'react-bootstrap/DropdownButton';// Import the DropdownButton component from react-bootstrap
// import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from '../components/Header';//Import the Header function component
import Footer from '../components/Footer';//Import the Footer function component

//Page1 function component
export default function Page1(//Export default Page1 function component
  { //PROPS PASSED FROM PARENT COMPONENT 
    logout,
    setError,
     currentUser,
     selectedQuiz,
     setSelectedQuiz,
     userScores,
     setUserScores
    }
  ) {

//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database
const fetchScores = useCallback(async () => {//Define an async function to fetch userScores
  try {
    const token =localStorage.getItem('token'); //Retrieve the token from localStorage
    const username = localStorage.getItem('username');//Retrieve the username from localStorage
    //Send a GET request to the server to find scores
    const response = await fetch (`http://localhost:3001/scores/findScores/:${username}`, {
      method: 'GET',//HTTP request method
      mode: 'cors',//Enable Cors for cross-origin resourcing
      headers: {
        'Content-Type': 'application/json',// Specify the Content-Type 
        'Authorization': `Bearer ${token}`,// Authorization header 
      }
    })

    /* Conditional rendering to check if the response
       is not successful (status code is not in the range 200-299)*/
    if (!response.ok) {
      // Throw an error if GET request status is not OK(unsuccessful)
      throw new Error('Unable to fetch user scores');
    }

    const quizScores = await response.json(); // Parse the response JSON data

    // Conditional rendering to check if the fetched data is valid and an array
    if (quizScores && Array.isArray(quizScores.userScores)) {
      setUserScores(quizScores.userScores); // Update state with fetched scores
    } 
    else {
      throw new Error('Invalid data type');//Throw an error message if the data type is invalid
    }
    
  } catch (error) {
    console.error('Error fetching userScores', error.message);//Log an error message in the console for debugging purposes
    setError(`Error fetching userScores: ${error.message}`);  // Set the error state and an error messsage
  }
},[setUserScores, setError])

  // Filter the results by the selected quiz name
  const quizResults = selectedQuiz
    ? userScores.filter(score => score.quizName === selectedQuiz)  // Filter the scores based on the selected quiz
    : [];

  // useEffect hook to fetch scores when the component mounts
    useEffect (() => {
      fetchScores()// Call the fetchScores function 
    },[fetchScores])
    
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
            <h2 id="instructionsHeading">HOW TO PLAY:</h2>
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
      {/* Section2 - Displays user's past scores */}
      <section className="section2">
        <Row>
          {/* Past Scores */}
          <Col>
            <h2 className="h2">PAST SCORES</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} className="scoreDisplayCol">
            {/* PastScores */}
            <div id="pastScoresOutput">
              {/* Button to trigger fetching past scores */}
              {/* <Button variant="primary" type="button" onClick={fetchScores}>
                FETCH SCORES
              </Button> */}
              {/* Conditional rendering to check if there 
              are scores to display */}
              {userScores.length > 0 ? (
                <div>
                  {/* Dropdown for quiz selection */}
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={selectedQuiz || 'Select a Quiz'}
                  >
                    {/* Map through the user scores and display 
                    them in the dropdown */}
                    {userScores.map((score, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => setSelectedQuiz(score.quizName)}
                      >
                          {score.name}
                        // {score.quizName}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                  {/* Display quizResults scores for the selected quiz */}
                  {quizResults.length > 0 ? (
                    quizResults.map((score, index) => (
                      <div key={index}>
                        {/*Quiz name*/}
                        <p>Quiz Name: {score.name}</p>
                        {/*Highest score*/}
                        <p>Score: {score.score}</p>
                        {/*Date of highest score*/}
                        <p>Date: {new Date(score.date).toLocaleDateString()}</p>
                        {/*Total number of attempts*/}
                        <p>Total Attempts: {score.attempts}</p>
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
