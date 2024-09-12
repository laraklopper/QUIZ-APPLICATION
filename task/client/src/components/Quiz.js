// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row';//Import Bootstrap Row 
import Col from 'react-bootstrap/Col';//Import Col from Bootstrap
import Button from 'react-bootstrap/Button';//Import Bootstrap Button Component

// Quiz function component
export default function Quiz({
  // PROPS PASSED FROM PARENT COMPONENT
  selectedQuiz,
  quizIndex,
  setCurrentScore,
  handleNextQuestion,
  handleRestart,
  currentScore,
  questions,
  quizTimer,
  timer,
  setQuizIndex
}) {
  // =============STATE VARIABLES=====================
  const [selectedOption, setSelectedOption] = useState(null);// State to track the selected answer option 
  const [feedback, setFeedback] = useState('');// Feedback message for correct/incorrect answers              
  const [timeLeft, setTimeLeft] = useState(10);// Timer state for countdown

  // ========USE EFFECT HOOK==================
  /* Effect to reset the question index to the first 
  question when the questions array changes */
  useEffect(() => {
    if (questions.length > 0) {
      setQuizIndex(0);
    }
  }, [questions, setQuizIndex]);

  // Effect to manage the timer countdown
  useEffect(() => {
    if (!quizTimer) return;

    setTimeLeft(timer);
    let isMounted = true;
    const interval = setInterval(() => {
      if (isMounted) {
        setTimeLeft((prevTime) => {
          if (prevTime<= 1) {
            clearInterval(interval);
            handleNextQuestion()
            return 0
          }
          return prevTime - 1
        })
      }
    }, 1000);

    return () => {
      isMounted = false
      clearInterval(interval);
    }
  }, [timer, handleNextQuestion, quizTimer]);

  // Display loading text if quiz or questions are not available
  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  // =======Utility function============
  // Function to format the timer into mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ============EVENT LISTENERS=================
  /* Function to handle answer selection and 
  update the score if correct */
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setCurrentScore(currentScore + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
   setTimeout(() => setFeedback(''), 1000)
  };

  /* Function to handle option click and 
  update the selected option */
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
    handleNextQuestion();
  };

  // =================JSX RENDERING======================
  return (
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
                <p className='number'>
                  QUESTION {quizIndex + 1} of {selectedQuiz.questions.length}
                </p>
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
                <h6 className='h6'>
                  {questions[quizIndex].questionText}
                  </h6>
              </label>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row className='optionsRow'>
            <Col xs={6} md={4} className='optionCol'></Col>
            <Col xs={6} md={4} className='optionCol'>
              {/* Map through and render options as buttons */}
              {questions[quizIndex].options.map((option, index) => (
                <Button
                  key={index} // Unique key for each button to identify which items have changed
                  variant={selectedOption === option ? 'success' : 'secondary'}
                  className='answerOption'
                  name='options'
                  checked={selectedOption=== option}
                  type='button'
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </Col>
            <Col xs={6} md={4} className='optionsCol'></Col>
          </Row>
          <Row className='feedbackRow'>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4} className='feedbackMessage'>
              {/* Display feedback message */}
              {feedback && <p className='feedback'>{feedback}</p>}
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <Row>
          <Col xs={6} md={4}>
            <div>
              {/* Display the current score */}
              <p id='resultText'>RESULT: {currentScore} of {selectedQuiz.questions.length}</p>
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            {/* Button to move to next question */}
            <Button
              variant='primary'
              type='button'
              onClick={handleNextQuestion}
              aria-label='Next question'
            >
              NEXT QUESTION
            </Button>
            {/* Button to restart quiz */}
            <Button
              variant='primary'
              type='reset'
              onClick={handleRestart}
              id='resetBtn'
              aria-label='Restart quiz'
            >
              RESTART
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
