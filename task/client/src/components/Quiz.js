// Import necessary modules and packages
import React from 'react'
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Component
import Timer from './Timer';

//Quiz Function Component
export default function Quiz(//Export default quiz function component
  {  // PROPS PASSED FROM PARENT COMPONENT
    questions, 
    currentQuestion, 
    timeLeft, 
    setTimeLeft, 
    timerEnabled, 
    handleAnswer, 
    currentScore, 
    handleNextQuestion, 
    lastQuestion
  }
) {

  //==================JSX RENDERING==================
  
  return (
    <div>
      <Row>
        <Col xs={6} md={4}>
          <Col xs={6}>
            <p>
              {questions[currentQuestion]?.questionText}: {currentQuestion + 1} of {questions.length}
            </p>
          </Col>
        </Col>
        <Col xs={6} md={4}>
        </Col>
        <Col xs={6} md={4} id='timer'>
          {/* Timer if user selects to play with timer */}
          {timerEnabled && (
            <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          )}
        </Col>
      </Row>
      <div>
        {questions[currentQuestion]?.options.map((option, index) => (
          <Button variant='primary' key={index} onClick={() => handleAnswer(option === questions[currentQuestion].correctAnswer)}>
            {option}
          </Button>
        ))}
      </div>
      <Row>
        <Col xs={6} md={4}>
          <p className="labelText">RESULT: {currentScore} of {questions.length}</p>
        </Col>
        <Col xs={6} md={4}>
        </Col>
        <Col xs={6} md={4}>
          <Button variant="primary" type='button' onClick={handleNextQuestion} disabled={lastQuestion}>
            {lastQuestion ? 'FINISH' : 'NEXT'}
          </Button>
        </Col>
      </Row>
    </div>
  )
}
