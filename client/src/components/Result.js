import React, { useCallback, useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// Result function component
export default function Result(//Export default Result function component
  {// PROPS PASSED FROM PARENT COMPONENT
  currentScore,
  addScore,
  quizName,
  totalQuestions,
  currentUser,  
}
) {
  //===========STATE VARIABLES=================
  const [showScore, setShowScore] = useState(true);// State to control the visibility of the result display
  const [submitted, setSubmitted] = useState(false)//Boolean to indicate if the score has been submitted
  const [submissionError, setSubmissionError] = useState(null)//State to indicate if an error occured while submitting the score

  //--------------EVENT LISTENERS---------------
  // Function to submit score
  const handleSubmitScore = useCallback( async (e) => {
    e.preventDefault()// Prevent default form submission
    setSubmitted(true); // Indicate submission in progress
    setSubmissionError(null); // Clear previous errors
    try {
      await addScore(); // Call the addScore function 
      console.log(currentScore);//Log the current score in the database for debugging purposes
      setShowScore(false)// Hide the result display after submission
    } catch (error) {
      // Handle any errors that occur during submission
      setSubmissionError('Failed to save score'); // Set an error message
      console.error('Failed to save score', error.message);//Log an error message for debugging purposes
    }
    finally{
      setSubmitted(false)// Reset submission state on failure
    }
  },[addScore, currentScore]);

   // Function to display the current date format
  const currentDate = () => {
    const options = { 
      day: '2-digit', // Display day as two digit
      month: '2-digit',  // Display month as two digits
      year: 'numeric',// Display year as four digits
      timeZone: 'Europe/Bucharest'// Set the timezone
     };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date());// Format the current date
  };
  //=============JSX RENDERING=================

  return (
    showScore && (
      <div id='results'>
        <form onSubmit={handleSubmitScore} id='resultForm'>
          <Row className='resultFormRow'>
            <Col xs={6} md={4} className='resultFormCol'>
            {/* Display the quizName */}
              <input
                value={quizName || 'Unnamed Quiz'} 
                // Fallback to 'Unnamed Quiz' if quizName is undefined
                 readOnly//Mark the field as readonly
                type='text'//Input type
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4} className='resultFormCol'>
              {/* Display the username of the user */}
              <input
                id='quizUser'
                className='resultFormInput'
                type='text'//Input type
                value={`Username: ${currentUser?.username || ''}`}
                // Fallback to an empty string if username is undefined
                readOnly//Mark the field as readOnly
              />
            </Col>
            <Col xs={6} md={4} id='resultsCol'>
              {/* Display the result with the score and total questions */}
              <input
                id='resultOutput'
                className='resultFormInput'
                type='text'
                value={`RESULT: ${currentScore} OF ${totalQuestions}`} // Display score and total questions
                readOnly//Mark the field as readonly
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'>             
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4} className='resultsCol'>
             <input
                type='text'
                value={currentDate()}// Display the current date
                name='date'
                readOnly//Mark the field as readonly
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'></Col>
          </Row> 
          <Row>
            <Col xs={6} md={4} className='resultFormCol'></Col>
            <Col xs={6} md={4} id='saveScoreBtnCol'>
              {/* Button to submit the score */}
              <Button
                variant='primary'
                type='submit'//Specify the button type
                id='saveScoreBtn'
                disabled={submitted}// Disable the button while submission is in progress
              >
                {/* Text bassed on the submission state */}
                {submitted ? 'Submitting...' : 'SAVE SCORE AND EXIT'}              
              </Button>
            </Col>
            <Col xs={6} md={4} className='resultFormCol'></Col>
          </Row>
        </form>
          {/* Display error message if an error 
          occurs when the score is submitted */}
        {submissionError && <p>{submissionError}</p>}
      </div>
    )
    )}
  

