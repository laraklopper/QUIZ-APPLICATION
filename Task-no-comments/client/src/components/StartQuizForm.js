import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//StartQuizForm function component
export default function StartQuizForm(
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz,
        quizTimer,
        setQuizTimer,
        handleQuizStart
    }) {

    //=======JSX RENDERING=============
  return (
    // Form to start quiz
      <form
      onSubmit={handleQuizStart}
      id='startQuizForm'
      >
          <Row>
              <Col md={12} className='quizNameCol'>
                  <h3 className='quizName'>
                      {quiz ? quiz.name : ''}
                      </h3>
              </Col>
          </Row>
          <Row>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='timerCol'>
                  <label id='addTimerLabel'>
                      <p className='labelText'>ADD TIMER:</p>
                  </label>
                  {/* Checkbox to add timer */}
                  <input
                      type='checkbox'
                        checked={quizTimer}
                        onChange={(e) => setQuizTimer(e.target.checked)}
                      id='addQuizTimer'
                  />
              </Col>
              <Col xs={6} md={4}>
                  {/* Button to start quiz */}
                  <Button variant='primary' type='submit'>
                    START QUIZ
                </Button>
              </Col>
          </Row>
      </form>
  )
}
