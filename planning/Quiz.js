//Quiz.js
import React, { useState } from 'react';

export default function Quiz  ({ 
  questions, 
  handleNextQuestion, 
  currentQuestion, 
  handleAnswerClick, 
  timer, 
  isLastq 
}
) {

  const optionIds = ['A', 'B', 'C', 'D'];
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option);
  };
  
  return (
    <div>
      <div>
        <p>
          Time remaining: {timer}
        </p>
        <h4>
          {questions[currentQuestion].id}) {questions[currentQuestion].question}
        </h4>
        <div>
          {questions[currentQuestion].options.map((option, index) => (
            <button key={index} onClick={() => handleOptionClick(option)}>
              {optionIds[index]}) {option}
            </button>
          ))}
        </div>
        <br/>
        <div>
          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div>
            {isLastq ? (
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

