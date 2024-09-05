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
    quizCompleted
  }
) {
    //=============STATE VARIABLES=====================
    const [selectedOption, setSelectedOption] = useState(null); //State used to track the selected option
  const [feedback, setFeedback] = useState('');// State used to store feedback message for correct/incorrect answers
  const [timeLeft, setTimeLeft] = useState(10);// State used to track the remaining time for the timer
    //========USE EFFECT HOOK==================
  /* Effect to reset the question index to the first 
  question when the questions array changes*/
    useEffect(()=> {
      if (questions.length > 0) {
        setQuizIndex(0)// Reset the question index to 0 (the first question)
      }
    }, [questions, setQuizIndex])
  
   // Effect to manage the timer countdown
  useEffect(() => {
    if (!quizTimer) return; //Exit early if the quizTimer is not enabled

    setTimeLeft(timer);// Set the initial time for the timer based on the value
    // Set up an interval to decrease the timer every second
    const interval =setInterval(() => {
      setTimeLeft((prevTime) => {// Update the time left by decrementing it by 1 second
        // If the time left is 1 second or less, handle the end of the countdown
        if (prevTime <= 1) {
          clearInterval(interval)// Clear the interval to stop the countdown
          handleNextQuestion() // Move to the next question as time has run out
          return 0;// Set time left to 0 to indicate no time remains
        }          
        return prevTime - 1;// Otherwise, continue decreasing the time by 1 second
      }, 1000);// Run the interval every 1000 milliseconds (1 second)
    })
       /* Cleanup function to clear the interval 
      when component unmounts or timer changes*/
      return ()=> clearInterval(interval)
    
  }, [timer, handleNextQuestion,  quizTimer]);
  // Dependencies: re-run the effect if timer, handleNextQuestion, or quizTimer changes
  
   //=================================================
   // Display loading text if quiz or questions are not available
  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>
  }

    //=======Utility function============
// Function to format the timer into mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds/ 60)
    const secs = seconds % 60;
    return `${minutes}: ${secs < 10 ? '0' : ' '}${secs}`
  }

 /*
  // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00'; // Default value if time is null
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds 
    // Format time
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  */

  //============EVENT LISTENERS=================
  /* Function to handle answer selection and 
update the score if correct*/
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);// If correct, increment the score
      setFeedback('correct')// Provide feedback that the answer is correct
    }
    else{
      setFeedback('incorrect')// If incorrect, provide feedback that the answer is wrong
    }
   
    // Set a timeout to move to the next question after a short delay
      // setTimeout(() => {
    //   setSelectedOption(null);  // Reset selected option
      //   handleNextQuestion(); // Move to the next question
      // }, 1000);     // 1 second delay to display feedback
      // Move to the next question
    handleNextQuestion();
  };
  
// Function to handle option click and update the selected option
  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent re-selection
    setSelectedOption(option);// Update the selected option
    // Conditional rendering to check if the selected option is correct
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
               <Button
                    variant={selectedOption === option ? 'success' : 'secondary'}
                    className='answerOption'
                    name='options'
                    onClick={() => handleOptionClick()}
                    // value={option}
                  >
                    {option}
                    </Button> 
            </div>
          ))}
            </Col> 
            <Col xs={6} md={4} className='optionsCol'></Col>
          </Row>
              <Row className='feedbackRow'>
            <Col md={12} className='feedbackMessage'>
              {/* Display feedback message */}
              {feedback && <p className='feedback'>{feedback}</p>}
            </Col>
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
          onClick={handleNextQuestion}
            disabled={quizCompleted} // Disable button if the quiz is completed
            >
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
              {/*display score if quiz is completed*/}
             {/*button to exit and save score to database*/}
        </Row>
      </div>
    </div>
  );
}
