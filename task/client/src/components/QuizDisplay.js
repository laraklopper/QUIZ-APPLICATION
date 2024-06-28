import React, {useEffect, useRef, useState } from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//QuizDisplay function component
export default function QuizDisplay(
    {//PROPS PASSED FROM PARENT COMPONENT
        quizList, 
        currentQuestion, 
        setCurrentQuestion, 
        setCurrentScore, 
        setLastQuestion, 
        selectedQuiz, 
        setSelectedQuiz
    }) {

    //=======REACT HOOKS=================
    //-------useState Hook variables------------
    // State to store the questions of the selected quiz
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            correctAnswer: '',
            options: ['', '', '']
        }
    ]);
    const [quizStarted, setQuizStarted] = useState(false);
    //State variables to handle timer option
    const [timeLeft, setTimeLeft] = useState(10);
    const [timerEnabled, setTimerEnabled] = useState(false);
    //------UseRef---------------
    //React useRef hook to store the interval ID for the timer
    const intervalRef = useRef(null);

    //================USE EFFECT HOOK=======================
    // Effect to clear the interval if timeLeft reaches 0
    useEffect(() => {
        if (timeLeft === 0) {
            /* Cleanup function to clear the interval when the 
            component unmounts or the effect re-runs*/
            clearInterval(intervalRef.current);
        }
    }, [timeLeft]);

    //--------Timer--------------
    // Function to start the timer
    const handleStart = () => {
        /* Clear any existing interval to avoid multiple 
        intervals running simultaneously*/
        clearInterval(intervalRef.current); 
        setTimeLeft(10); 

        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft > 0) {
                    return prevTimeLeft - 1;
                } else {
                    clearInterval(intervalRef.current);
                    return 0;
                }
            });
        }, 1000); // Update every second
    };

    // Function to stop the timer
    const handleStop = () => {
        clearInterval(intervalRef.current); 
    };


    // Handles the change in the timer option
    const handleTimerChange = (event) => {
        setTimerEnabled(event.target.checked); 
    };


    //=========EVENT LISTENERS====================

    // Function to start the quiz
    const startQuiz = () => {
        setQuizStarted(true);
        if (timerEnabled) {
            // Start the timer if the timer option is enabled
            handleStart();
        }
    };
    
    // Function to go to the next question
    const handleNextQuestion = () => {
        if (currentQuestion + 1 === questions.length) {
            setLastQuestion(true); 
        }
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
        if (timerEnabled) {
            // Reset the timer to 10 seconds for the next question
            setTimeLeft(10); 
        }
    };
    
    // Function to select a quiz from the dropdown
    const handleSelect = (event) => {
        try {
            const quiz = JSON.parse(event.target.value);
            setSelectedQuiz(quiz);
            setQuestions(quiz.questions);
            setCurrentQuestion(0);
            setCurrentScore(0);
        } 
        catch (error) {
            console.error('Error parsing quiz:', error);
        }
    };
    // Function to generate the answer buttons based on the options provided
    const generateAnswers = (options) => {
        return options.map((option, index) => (
            // Create a Button component for each answer
            <Button
                variant='primary'
                className='answerBtn'
                key={index}
                value={option}
            >
                {option}
            </Button>
        ));
    };


    
    //==================JSX RENDERING=======================

  return (
    <div>        
          {!quizStarted ? (// Conditional rendering to check if the quiz has started
              <div>
                  <h3 className='h3'>{selectedQuiz?.quizName}</h3>
                  <div>
                      <Row>
                          <Col xs={12} md={8}>
                          </Col>
                          <Col xs={6} md={4}>
                          {/* Add Timer */}
                              <label className='timerLabel'>{/*Checkbox to add a timer*/}
                                  <p className='labelText'>ADD TIMER:</p>
                                  <input type="checkbox" onChange={handleTimerChange} checked={timerEnabled}/>
                              </label>
                          </Col>
                      </Row>
                      <div className='quiz'>
                      {/* Current question */}
                      <h4 className='h4'>
                        {questions[currentQuestion]?.questionText}
                    </h4>
                    
                      <div>
                          <Row id='timerRow'>
                              {timerEnabled && ( // Display timer if the user chose to add a timer
                                  <Col xs={6} id='timerCol'>TIMER: {timeLeft}</Col>
                              )}
                              {/* Display the current question number out of all the questions */}
                              <Col xs={6}><h3>QUESTION: {currentQuestion + 1} of {questions.length}</h3></Col>
                          </Row>
                      </div>
                      <div>
                        <Row>
                            <Col>
                                  <h3 className='question'>{questions[currentQuestion]?.questionText}</h3>
                            </Col>
                        </Row>
                          <Row>
                            {/* POSSIBLE ANSWERS */}
                                  {questions[currentQuestion]?.options.map((option, index) => (
                                      <Col xs={6} key={index}>
                                          <button onClick={() => { generateAnswers()}}>
                                              {option}
                                          </button>
                                      </Col>
                                  ))}
                          </Row>
                          <Row className='resultRow'>
                              <Col xs={6} md={4} id='resultCol'>
                              {/* Result */}
                              <div id='results'>
                                <h5 className='result'>RESULT:{/*x OF 5*/}</h5>
                              </div>
                              </Col>
                              <Col xs={12} md={8} className='quizBtnCol'>
                                  <Button 
                                  variant="primary" 
                                  type='button' 
                                  onClick={handleNextQuestion} 
                                  className='nextBtn'>
                                    NEXT
                                </Button>
                                  <Button 
                                  variant="primary" 
                                  type='button' 
                                  onClick={() => { setQuizStarted(false); handleStop() }} 
                                  className='restartBtn'>
                                    RESTART
                                </Button>
        
                              </Col>
                          </Row>
                      </div>
                      </div>
                  </div>
              </div>
        ):(
                  <div id='select'>
                      <Row>
                          <Col>
                              <h2>SELECT QUIZ</h2>
                          </Col>
                      </Row>
                    <form id='selectForm'>
                     
                          <Row>
                              <Col xs={12} md={8}>
                                  <label>
                                      <p>SELECT</p>
                                      {/* Map over quizList from database */}
                                      <select onChange={(e) => handleSelect(e)}>
                                          {quizList.map((quiz, index) => (
                                              <option key={index} value={JSON.stringify(quiz)}>
                                                {quiz.name}
                                            </option>
                                          ))}
                                      </select>
                                  </label>
                              </Col>
                              <Col xs={6} md={4}>
                                  <label>
                                      Add Timer:
                                      <input type="checkbox" onChange={handleTimerChange} />
                                  </label>
                              </Col>
                          </Row>
                      <Row>
                          <Col xs={12} md={8}>

                          </Col>
                          <Col xs={6} md={4}>
                          <button type='submit'>PLAY</button>
                              <button onClick={startQuiz}>PLAY</button>
                          </Col>
                      </Row>         
                      </form> 
                      </div>                             
        )}
    </div>
  )
}
