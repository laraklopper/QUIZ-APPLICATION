import React, { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; // Import the Bootstrap Button component

//QuizDisplay function component
export default function QuizDisplay({ quizList, currentQuestion, setCurrentQuestion, setScore, answers }) {//Export default QuizDisplay function component
    //=========STATE VARIABLES====================
    const [timeLeft, setTimeLeft] = useState(10); // State for countdown timer
    const intervalRef = useRef(null); // Ref to store the interval ID for the timer
    const [timerEnabled, setTimerEnabled] = useState(false); // State to track if timer is enabled
    const [selectedQuiz, setSelectedQuiz] = useState(null); // State to store the selected quiz
    const [lastQuestion, setLastQuestion] = useState(false); // Indicates if the current question is the last one
    const [quizStarted, setQuizStarted] = useState(false); // State to track if the quiz has started
    const [questions, setQuestions] = useState([ // State to store the questions of the selected quiz
        {
            questionText: '',
            correctAnswer: '',
            options: ['', '', '']
        }
    ]);

    // Effect to clear the interval if timeLeft reaches 0
    useEffect(() => {
        //Conditional rendering to check if the timeLeft is O
        if (timeLeft === 0) {// Clear the interval when timeLeft reaches 0 to stop the timer
            clearInterval(intervalRef.current);// Cleanup function to clear the interval when the component unmounts or the effect re-runs
        }
    }, [timeLeft]);/*The effect runs every time the `timeLeft` state changes. When timeLeft is 0, it clears the interval using 
    clearInterval(intervalRef.current). This ensures that the interval stops running when the timer has expired.*/

    //--------Timer--------------
    // Function to start the timer
    const handleStart = () => {
        clearInterval(intervalRef.current); // Clear any existing interval to avoid multiple intervals running simultaneously
        setTimeLeft(10); // Reset the countdown to 10 seconds

            // Start a new interval to update the timeLeft state every second
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft > 0) {
                    return prevTimeLeft - 1;//Decrease the time by 1 second
                } else {
                    clearInterval(intervalRef.current);// Clear the interval when the timer reaches 0
                    return 0;// Ensure the timeLeft state is set to 0
                }
            });
        }, 1000); // Update every second
    };

    // Function to stop the timer
    const handleStop = () => {
        clearInterval(intervalRef.current);// Update timerEnabled based on the checkbox state
    };

    // Handles the change in the timer option
    const handleTimerChange = (event) => {
        setTimerEnabled(event.target.checked); // Update timerEnabled based on the checkbox state
    };

    //=========EVENT LISTENERS====================
    // Function to start the quiz
    const startQuiz = () => {
        setQuizStarted(true);// Set the quizStarted state to true, indicating the quiz has started
        //Conditional rendering to check if the timer is enabled 
        if (timerEnabled) {
            handleStart();// Start the timer if the timer option is enabled
        }
    };

    // Function to go to the next question
    const handleNextQuestion = () => {
    // Conditional rendering to check if the next question is the last one in the list
        if (currentQuestion + 1 === questions.length) { 
            setLastQuestion(true); // Set the state indicating that this is the last question
        }
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
        //Conditional rendering to check if the timer is enabled
        if (timerEnabled) {
            setTimeLeft(10); // Reset the timer to 10 seconds for the next question
        }
    };

    // Function to select a quiz from the dropdown
    const handleSelect = (event) => {
        try {
            const quiz = JSON.parse(event.target.value);// Parse the selected quiz from the event target value
            setSelectedQuiz(quiz); // Set the selected quiz in state
            setQuestions(quiz.questions); // Ensure questions state is updated
            setCurrentQuestion(0); // Reset the current question index to the first question
            setScore(0); // Reset score when a new quiz is selected
        } catch (error) {
            console.error('Error parsing quiz:', error);//Log an error message in the console for debugging purposes
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

    //=========================================
    return (
        <div>
            {quizStarted ? ( // Conditional rendering to check if the quiz has started
                <div>
                    <h3 className='h3'>{selectedQuiz?.quizName}</h3>
                    <div>
                        <Row>
                            <Col xs={12} md={8}>
                            </Col>
                            <Col xs={6} md={4}>
                                <label>
                                    Add Timer:
                                    <input type="checkbox" onChange={handleTimerChange} checked={timerEnabled} />
                                </label>
                            </Col>
                        </Row>
                        <h4>{questions[currentQuestion]?.questionText}</h4>

                        <div>
                            <Row>
                                {timerEnabled && ( // Display timer if the user chose to add a timer
                                    <Col xs={6}>TIMER: {timeLeft}</Col>
                                )}
                                <Col xs={6}>QUESTION {currentQuestion + 1} of {questions.length}</Col>
                            </Row>
                        </div>
                        <div>
                            <Row>
                                <Col>
                                    <h3 className='question'>{questions[currentQuestion]?.questionText}</h3>
                                </Col>
                            </Row>
                            <Row>
                                {questions[currentQuestion]?.options.map((option, index) => (
                                    <Col xs={6} key={index}>
                                        <button onClick={() => {  generateAnswers()}}>
                                            {questions.option}
                                        </button>
                                    </Col>
                                ))}
                            </Row>
                            <Row>
                                <Col xs={6} md={4}>
                                    {/* Result */}
                                    <p>RESULT {/* Display the result here */}</p>
                                </Col>
                                <Col xs={12} md={8}>
                                    <button type='button' onClick={handleNextQuestion}>NEXT</button>
                                    <button type='button' onClick={() => { setQuizStarted(false); handleStop(); }}>RESTART</button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <form>
                        <Row>
                            <Col>
                                <h2>SELECT QUIZ</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8}>
                                <label>
                                    <p>SELECT</p>
                                    {/* Map over quizList from database */}
                                    <select onChange={(e) => handleSelect(e)}>
                                        <option value="">Select a quiz</option>
                                        {quizList.map((quiz, index) => (
                                            <option key={index} value={JSON.stringify(quiz)}>{quiz.name}</option>
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
                                <button type='button' onClick={startQuiz}>PLAY</button>
                                {/* toggle the quiz after clicking the button */}
                            </Col>
                        </Row>
                    </form>
                </div>
            )}
        </div>
    );
}
