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
    timer,
  }
) {
    //=============STATE VARIABLES=====================
    const [timeLeft, setTimeLeft] = useState(timer); 
    const [selectedOption, setSelectedOption] = useState(null);  

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
        return prevTime - 1;
      });
    }, 1000);

      /* Cleanup function to clear the interval when the 
      component unmounts or dependencies change*/
    return () => clearInterval(interval);
  }, [quizTimer, timer, handleNextQuestion]);
  // Display loading text if quiz or questions are not available

  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>
  }

  // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = time % 60; 
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  //============EVENT LISTENERS=================
  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);// Update the score if the answer is correct
    }
    handleNextQuestion();// Move to the next question
  };

  // Function to handle option click and update the selected option
  const handleOptionClick = (option) => {
    setSelectedOption(option);// Update the selected option
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
  };

 

  //================JSX RENDERING======================

  return (
    // Selected quiz
    <div id='quizDisplay'>
      <Row>
        <Col id='quizHeading'>
          {/* Display quiz name */}
            <h3 className='quizName'>{selectedQuiz.quizName}</h3> 
        </Col>
      </Row>
      <div>
        <Row className='quizRow'>
          <Col xs={12} md={8} id='questionCol'>
          {/* Display question number */}
            <div id='questionNumber'>
              <label>
                <p className='number'>QUESTION {quizIndex + 1} of {selectedQuiz.questions.length} </p>
              </label>
            </div>     
          </Col>
          <Col xs={6} md={4} id='timerCol'>
            {/* Display timer if enabled */}
            {quizTimer && <div id='timer'>TIMER: {formatTimer(timeLeft)}</div>}
          </Col>
        </Row>
        {/* Question */}
        <div className='question'>
          <Row>
            <Col md={9} className='questionCol'>
            {/* Display current question text */}
            <label className='questionLabel'>
                <h6 className='h6'>{questions[quizIndex].questionText}</h6>
            </label>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row className='optionsRow'>
            <Col xs={6} md={4} className='optionCol'></Col>   
            <Col xs={6} md={4} className='optionCol'>     
          {/* Map through and randomize options */}
          {questions[quizIndex].options.map((option, index)=> (
            <div key={index} className='questions'>
              {/* Render  buttons for each option */}
              <div className='options'>     
                <div className='option'> 
                  <Button
                    variant={selectedOption === option ? 'success' : 'secondary'}
                    className='answerOption'
                    onClick={() => handleOptionClick(option)}
                  >
                    <p>{option}</p>  
                    </Button>     
                </div> 
                </div>
                
            </div> 
          ))}
            </Col> 
            <Col xs={6} md={4} className='optionsCol'></Col>

          </Row>
        </div>
        <Row>
          <Col xs={6} md={4}>
          <div>
            {/* Display the current score */}
            <p id='resultText'>RESULT: {score} of {selectedQuiz.questions.length}</p>          
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
          onClick={handleRestart}
          id='resetBtn'
          >
            RESTART
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
