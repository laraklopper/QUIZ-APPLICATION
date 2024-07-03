import React, { useState } from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Quiz({timer, handleAnswerClick, currentQuestion, handleNextQuestion, lastQuestion, questions}) {
  const optionIds = ['A', 'B', 'C', 'D'];
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option);
  };
  return (
    <div>
      <Row>
        <Col xs={6} md={4}>
          <p>Time remaining: {timer}</p>
         
          </Col>
        <Col xs={6} md={4}>
          <h4>
            {questions[currentQuestion].id}
            {questions[currentQuestion].question}
          </h4>
          

        </Col>
        <Col xs={6} md={4}>
        </Col>
        </Row>
        <Row>
        <Col xs={6} md={4}>
        </Col>
        <Col xs={6} md={4}>
        <div id='options'>
          <Row id='questionsRow'>
            <Col>
            {questions[currentQuestion].options.map((option, index) => (
              <Button key={index} onClick={() => handleOptionClick(option)}>
                {optionIds[index]} {option}
              </Button>
            ))}
            </Col>
          </Row>

        </div>
         
        </Col>
        <Col xs={6} md={4}>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={4}>
        </Col>
        <Col xs={6} md={4}>
          {lastQuestion ? (
            <button onClick={handleNextQuestion}>
              Submit
            </button>
          ) : (
            <button onClick={handleNextQuestion}>
              Next Question
            </button>
          )}      </Col>
        <Col xs={6} md={4}>
        </Col>
      </Row>
    </div>
  )
}
