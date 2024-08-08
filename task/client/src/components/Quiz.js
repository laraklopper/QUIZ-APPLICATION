// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz(
  {// PROPS PASSED FROM PARENT COMPONENT
    selectedQuiz,
    quizIndex,
    setScore,
    handleNextQuestion,
    handleRestart,
    score,
    questions,
    quizTimer,
    timer
  }) {

    //=============STATE VARIABLES=====================
  // State to keep track of the time left for the countdown
  const [timeLeft, setTimeLeft] = useState(timer);
  // State to keep track of the selected option
    const [selectedOption, setSelectedOption] = useState(null)
    
    const optionIds = ['A', 'B', 'C', 'D']

    //========USE EFFECT HOOK==================
      // Effect hook to manage countdown timer
    useEffect(() => {
    if (!quizTimer) return;

    setTimeLeft(timer);
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          handleNextQuestion();
          return 0;
        }
        // /Decrement the timer
        return prevTime - 1;
      });
    }, 1000);

      /* Cleanup function to clear the interval when the 
      component unmounts or dependencies change*/
    return () => clearInterval(interval);
  }, [quizTimer, timer, handleNextQuestion]);
  
    // Conditional rendering to  if the quiz data or questions are not loaded yet
  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>
  }

  // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00'; // Return default if time is null
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds 
    // Format timer
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  //============EVENT LISTENERS=================
  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  // Function to handle option click and update the selected option
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
  };

  //================JSX RENDERING======================

  return (
    // Selected quiz
    <div id='quizDisplay'>
      <Row>
        <Col>
          {/* Display quiz name */}
            <h3 className='h3'>{selectedQuiz.quizName}</h3> 
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={6} md={4} id='questionCol'>
          {/* Display question number */}
            <div id='questionNumber'>
              <h3 className='h3'>
                QUESTION {quizIndex + 1} of {selectedQuiz.questions.length} 
              </h3>
            </div>     
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='timerCol'>
            {/* Display timer if enabled */}
            {quizTimer && <div id='timer'>TIMER: {formatTimer(timeLeft)}</div>}
          </Col>
        </Row>
        <div>
          <Row>
            <Col md={2}></Col>
            <Col md={7}>
            {/* Display current question text */}
            <h3 className='h3'>
              {questions[quizIndex].questionText}
            </h3>
            </Col>
            <Col md={3}></Col>
          </Row>
          {/* Map through and randomize options */}
          <Row>

          <Col>
          {questions[quizIndex].options.map((option, index)=> (
            <div key={index}>
              {/* Render radio buttons for each option */}
              <input 
              type='radio'
              name='answer'
              value={option}
                checked={selectedOption === option} 
                onChange={() => handleOptionClick(option)} 
                />
              {/* Display option label with identifier*/}
              {optionIds[index]} {option} 
            </div> 
          ))}</Col></Row>
        </div>
        <Row>
          <Col xs={6} md={4}>
          <div>
            {/* Display the current score */}
            <p id='resultText'>
              RESULT: {score} of {selectedQuiz.questions.length}
            </p>
          </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
          {/* Button to move to next question */}
          <Button 
          variant='primary' 
          type='button' 
          onClick={handleNextQuestion}>
            NEXT QUESTION
            </Button>
          {/* Button to restart quiz */}
          <Button 
          variant='primary' 
          type='reset' 
          onClick={handleRestart}>
            RESTART
            </Button>
          </Col>
        </Row>
      </div>
    </div>

  );
}
