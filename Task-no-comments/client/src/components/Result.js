// Import the React module to use React functionalities
import React, { useCallback, useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

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
  const [showScore, setShowScore] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  //--------------EVENT LISTENERS---------------
  // Function to submit score
  const handleSubmitScore = useCallback( async (e) => {
    e.preventDefault()
    setSubmitted(true);
    setSubmissionError(null); 
    try {
      await addScore(); // Call the addScore function 
      console.log(currentScore);
    } catch (error) {
      setSubmissionError('Failed to save score');
      console.error('Failed to save score', error.message);
    }
    finally{
      setSubmitted(false)
    }
  },[addScore, currentScore]);

// console.log(quizName)

  // Function to hide the result display
  const handleExit = () => {
    // Hide the result display after successful submission
    setShowScore(false);
  };

   // Function to display the current date format
  const currentDate = () => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' };
    return new Date().toLocaleDateString('en-GB', options);
  };
  //=============JSX RENDERING=================

  return (
    showScore && (
      <div id='results'>
        <form onSubmit={handleSubmitScore}>
          <Row>
            <Col xs={6} md={4}>
            {/* Display the quizName */}
              <input
                value={quizName || 'Unnamed Quiz'}
              readOnly
              type='text'
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}>
              {/* Display the username of the user */}
              <input
                id='quizUser'
                className='resultFormInput'
                type='text'
                value={`Username: ${currentUser?.username || ''}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} id='resultsCol'>
              {/* Display the result with the score and total questions */}
              <input
                id='resultOutput'
                className='resultFormInput'
                type='text'//Input type
                value={`RESULT: ${currentScore} OF ${totalQuestions}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'>             
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
             <input
                type='text'
                value={currentDate()}
                name='date'
                readOnly
                className='resultFormInput'
              />
            </Col>
            <Col xs={6} md={4}></Col>
          </Row> 
          <Row>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4}>
              {/* Button to submit the score */}
              <Button
                variant='primary'
                type='submit'
                disabled={submitted}
              >
                {submitted ? 'Submitting...' : 'SAVE SCORE'}              
              </Button>
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </form>
          {/* Display error message if an error 
          occurs when the score is submitted */}
        {submissionError && <p>{submissionError}</p>}
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            {/* Button to exit when the quiz is 
            complete or the user saved the score*/}
            <Button
              variant='warning'
              onClick={handleExit}
              type='button'
            >
              Exit
            </Button>
          </Col>
          <Col xs={6} md={4}></Col>
        </Row>
      </div>
    )
    )}
  

