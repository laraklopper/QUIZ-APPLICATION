import React from 'react';

export default function Score ({ 
  score, 
  setScore, 
  setCurrentQuestion, 
  setQuizStarted, 
  setIsLastq, 
  setTimer 
}) {

  //===========JSX RENDERING===========
  
  return (
    <div>
      <h2>Quiz Completed!</h2>
      <h4>Your score: {score}</h4>
      <button
        onClick={() => { 
          setCurrentQuestion(0); 
          setScore(0); 
          setQuizStarted(true); 
          setIsLastq(false); 
          setTimer(10);
        }}>
        Restart Quiz
      </button>
    </div>
  );
};
