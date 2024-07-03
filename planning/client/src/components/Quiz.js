//Quiz.js
import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz  ({ 
  questions, 
  handleNextQuestion, 
  currentQuestion, 
  handleAnswerClick, 
  timer, 
  lastQuestion 
}
) {

  const optionIds = ['A', 'B', 'C', 'D'];
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option);
  };

  //==========JSX RENDERING==============
  
  return (
    <div>
      <div>
        <p>
          Time remaining: {timer}
        </p>
        <h4>
          {questions[currentQuestion].id}
          {questions[currentQuestion].question}
        </h4>
        <div>
          {questions[currentQuestion].options.map((option, index) => (
            <Button key={index} onClick={() => handleOptionClick(option)}>
              {optionIds[index]}) {option}
            </Button>
          ))}
        </div>
        <br/>
        <div>
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div>
            {lastQuestion ? (
              <button onClick={handleNextQuestion}>
                Submit
              </button>
            ) : (
              <button onClick={handleNextQuestion}>
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
