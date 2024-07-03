import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//SelectQuiz function component
export default function SelectQuiz(
    {
        quizList, 
        setQuizName,
        handleTimerChange,
        startQuiz,
        timerEnabled

    }
) {
    //=========JSX RENDERING========
    
  return (
      <div id='selectQuiz'>
          {/* <form> */}
          <Row>
              <Col>
                  <h2 className='h1'>SELECT QUIZ</h2>
              </Col>
          </Row>
          <Row>
              <Col xs={6} md={4}>
                  <label className='selectLabel'>
                      <p className='labelText'>SELECT:</p>
                      <select onChange={(e) => setQuizName(e.target.value)}>
                          <option value="">Select Quiz</option>
                          {quizList.map((quiz) => (
                              <option key={quiz._id} value={quiz._id}>
                                  {quiz.quizName}
                              </option>
                          ))}
                      </select>
                  </label>
              </Col>
              <Col xs={6} md={4}>
                  {/* Add Timer */}
                  <label className='timerLabel'>{/*Checkbox to add a timer*/}
                      <p className='labelText'>ADD TIMER:</p>
                      <input type="checkbox" onChange={handleTimerChange} checked={timerEnabled} />
                  </label>
              </Col>
              <Col xs={6} md={4}>
                  <Button variant="primary" onClick={startQuiz} id='startQuizBtn'>
                      PLAY
                  </Button>
              </Col>
          </Row>
          {/* </form> */}
      </div>
  )
}
