// Import necessary modules and packages
import React, { useEffect, useState} from 'react';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz(//Export default Quiz function component
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

  const [timeLeft, setTimeLeft] = useState(timer); // State to keep track of the time left for the countdown  
    const [selectedOption, setSelectedOption] = useState(null)// State to keep track of the selected option
    const optionIds = ['A', 'B', 'C', 'D']// Option identifiers (e.g., A, B, C, D)

    //========USE EFFECT HOOK==================
      // Effect hook to manage countdown timer
    useEffect(() => {
    if (!quizTimer) return;// Exit if quiz timer is not enabled

    setTimeLeft(timer);// Initialize timer
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);// Clear the interval to stop the timer
          handleNextQuestion();// Call the handleNextQuestion function to move to the next question
          return 0;// Ensure time left is set to 0
        }
        return prevTime - 1;// Decrease time left by 1 second
      });
    }, 1000);// 1000 milliseconds = 1 second

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
  // const handleAnswerClick = (isCorrect) => {
  //   if (isCorrect) {
  //     setScore(score + 1);
  //   }
  //   handleNextQuestion();// Move to the next question
  // };

  // // Function to handle option click and update the selected option
  // const handleOptionClick = (option) => {
  //   setSelectedOption(option);// Update the selected option
  //   handleAnswerClick(option === questions[quizIndex].correctAnswer);
  // };

  //Function to handle user input when answering questions
  const handleOptionClick = (option) => {
    setSelectedOption(option)  // Update the selected option in state to reflect user selection
    //Conditional rendering to check if the option is correct
    if (option === questions[quizIndex].correctAnswer) {
      setScore(score + 1);  // Increment the score if the selected option is correct
    }
    else if(quizIndex === 5){
      addScore();//Call the addScore function if the question is the last question
    }
    else{
      /* Call the handleNextQuestion() function if the 
      question is not the last question*/ 
      handleNextQuestion();
    }
  }


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
             {/*<h4>TimePassed: {secondsPassed.toFixed(3)}</h4>*/}
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
