import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Result function component
export default function Result({
  // PROPS PASSED FROM PARENT COMPONENT
  currentScore,
  addScore,
  quizName,
  selectedQuiz,
  totalQuestions,
  currentUser
}) {
  // State to control the visibility of the result display
  const [showScore, setShowScore] = useState(true);

  // Function to submit score
  const handleSubmitScore = async (e) => {
    e.preventDefault();
    try {
      await addScore();  
    } catch (error) {
      console.log('Failed to save score', error.message);
    }
  };

  // Function to hide the result display
  const handleExit = () => {
    setShowScore(false);
  };

  // Function to display the current date in a readable format
  const currentDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-GB', options);
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
                value={selectedQuiz?.quizName || quizName || 'Unnamed Quiz'}
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
                type='text'
                value={`RESULT: ${currentScore} OF ${totalQuestions}`}
                readOnly
              />
            </Col>
            <Col xs={6} md={4} className='resultsCol'>
              
             
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}>
            {/* Display the current date */}
             <input
                type='text'
                value={currentDate(new Date())}
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
              >
                SAVE SCORE
              </Button>
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </form>
        <Row>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            {/* Button to exit */}
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
    ))}
  

