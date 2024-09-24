// Import necessary modules and packages
// Import the React module to use React functionalities
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

//StartQuizForm function component
export default function StartQuizForm(
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz,
        quizTimer,
        setQuizTimer,
        quizStarted,
        handleQuizStart
    }) {

    //=======JSX RENDERING=============
  return (
    // Form to start quiz
      <form
      onSubmit={handleQuizStart}
      id='startQuizForm'
      >
          <Row className='startQuizRow'>
              <Col md={12} className='quizNameCol'>
                  <h3 className='quizName'>
                    {/* Display the quiz name */}
                      {quiz ? quiz.name : ''}
                      {/* If the quiz does not exist display an empty string */}
                      </h3>
              </Col>
          </Row>
          {/* Row containing a checkbox for adding 
          a timer and the start button */}
          <Row className='startQuizRow'>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='timerCol'>
                  <label id='addTimerLabel'>
                      <p className='labelText'>ADD TIMER:</p>
                  </label>
                  {/* Checkbox to add timer based on the quizTimer state */}
                  <input
                      type='checkbox'//Specify the input type
                      checked={quizTimer}//Current state of the timer 
                      // Update the timer state when toggled
                      onChange={(e) => setQuizTimer(e.target.checked)}
                      id='addQuizTimer'
                      // Disable checkbox if the quiz has started
                      disabled={quizStarted} 
                  />
              </Col>
              <Col xs={6} md={4} className='startQuizBtnCol'>
                  {/* Button to start quiz */}
                  <Button variant='primary' type='submit' id='startQuizBtn'>
                    START QUIZ
                </Button>
              </Col>
          </Row>
      </form>
  )
}
