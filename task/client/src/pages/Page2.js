// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css'; // Import CSS stylesheet
// Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
// Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import Timer from '../components/Timer';

// Page 2 function component
export default function Page2({
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  questions = [],
  setQuestions,
  quizName,
  setQuizName,
  fetchQuizzes,
  logout
}) {
  //=========STATE VARIABLES====================
  const [selectedQuiz, setSelectedQuiz] = useState(null); // State for currently selected quiz
  const [currentScore, setCurrentScore] = useState(0); // State for current score of the user
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [lastQuestion, setLastQuestion] = useState(false); // State to track if last question is reached
  const [quizStarted, setQuizStarted] = useState(false); // State to track if the quiz has started
  const [timerEnabled, setTimerEnabled] = useState(false); // State to track if the timer is enabled
  const [timeLeft, setTimeLeft] = useState(10); // State used for the time left on the timer

  // useEffect to fetch a single quiz when component mounts
  useEffect(() => {
    const fetchQuiz = async (quizId) => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await fetch(`http://localhost:3001/quiz/${quizId}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Set authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching Quiz'); // Throw error if response is not OK
        }

        const data = await response.json(); // Parse response data
        setSelectedQuiz(data); // Set selected quiz state
      } catch (error) {
        console.error('Failed to fetch selected quiz', error); // Log error to console
      }
    };

    if (quizName) {
      fetchQuiz(quizName); // Fetch quiz if quizName is set
    }
  }, [quizName]);

 // useEffect to set questions and quiz name when the selected quiz changes
useEffect(() => {
  // Conditional rendering to check if selectedQuiz is not null
  if (selectedQuiz) {
    setQuestions(selectedQuiz.questions); // Set the questions state in the parent component to the questions of the selected quiz
    setQuizName(selectedQuiz.quizName); // Set the quiz name state in the parent component to the name of the selected quiz
  }
}, [selectedQuiz, setQuestions, setQuizName]); // Dependencies: this effect runs whenever selectedQuiz, setQuestions, or setQuizName changes

  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes(); 
  }, [fetchQuizzes]);

  // Function to handle answer selection
  const handleAnswer = async (answer) => {
    try {
      // Check if a quiz is selected
      if (!selectedQuiz) {
        throw new Error("No quiz selected."); // Throw error if no quiz is selected
      }
      const correctAnswer = selectedQuiz.questions[currentQuestion]?.correctAnswer; // Get correct answer for current question
      if (answer === correctAnswer) {
        setCurrentScore((prevScore) => prevScore + 1); // Increment score if answer is correct
      }
      if (currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1); // Move to next question if there are more questions
        if (timerEnabled) {
          setTimeLeft(10); // Reset timer if enabled
        }
      } else {
        // Save result when the quiz is finished
        const response = await fetch('http://localhost:3001/users/result', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            quizId: selectedQuiz._id,
            currentScore,
          }),
        });
        const data = await response.json(); // Parse response data
        console.log('Result saved:', data); // Log result to console
        setLastQuestion(true); // Set last question state
      }
    } catch (error) {
      console.error('Error handling answer:', error); // Log error to console
    }
  };

  // Handles the change in the timer option
  const handleTimerChange = (event) => {
    setTimerEnabled(event.target.checked); // Set timer enabled state based on checkbox
  };

  // Function to start the quiz
  const startQuiz = () => {
    setQuizStarted(true); // Set quiz started state
    setCurrentScore(0); // Reset score
    setCurrentQuestion(0); // Reset current question index
    setLastQuestion(false); // Reset last question state
    setTimeLeft(timerEnabled ? 10 : 0); // Reset timer if enabled
  };

  //======JSX RENDERING==========

  return (
    <>
      {/* Header */}
      <Header heading="GAME" />
      {/* section 1 */}
      <section className="section1">
        {quizStarted ? (
          <form>
            <div>
              <Row>
                <Col xs={6} md={4}>
                  <Col xs={6}>
                    <p>
                      {questions[currentQuestion]?.questionText}: {currentQuestion + 1} of {questions.length}
                    </p>
                  </Col>
                </Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4} id="timer">
                  {/* Timer if user selects to play with timer */}
                  {timerEnabled && <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />}
                </Col>
              </Row>
              <div>
                {questions[currentQuestion]?.options.map((option, index) => (
                  <Button
                    variant="primary"
                    key={index}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <Row>
                <Col xs={6} md={4}>
                  <p className="labelText">RESULT: {currentScore} of {questions.length}</p>
                </Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                {lastQuestion ? (
              <button type="submit">
                Submit
              </button>
            ) : (
              <button type='button' onClick={handleNextQuestion}>
                Next Question
              </button>
            )}
{/* <Button variant="primary" type="button" onClick={handleNextQuestion} disabled={lastQuestion}>
                    {lastQuestion ? 'FINISH' : 'NEXT'}
                  </Button>*/}
                </Col>
              </Row>
            </div>
          </form>
        ) : (
          <div id="selectQuiz">
            <Row>
              <Col>
                <h2 className="h1">SELECT QUIZ</h2>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <label className="selectLabel">
                  <p className="labelText">SELECT:</p>
                  <select onChange={(e) => setQuizName(e.target.value)}>
                    <option value="">Select Quiz</option>
                    {quizList.map((quiz) => (
                      <option key={quiz._id} value={quiz._id}>
                        {quiz.quizName}
                      </option>
                    ))}
                  </select>
                </label>
              </Col>
              <Col xs={6} md={4}>
                {/* Add Timer */}
                <label className="timerLabel">
                  {/* Checkbox to add a timer */}
                  <p className="labelText">ADD TIMER:</p>
                  <input type="checkbox" onChange={handleTimerChange} checked={timerEnabled} />
                </label>
              </Col>
              <Col xs={6} md={4}>
                <Button variant="primary" onClick={startQuiz} id="startQuizBtn">
                  PLAY
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </section>
      <footer className="pageFooter">
        <Row>
          <Col xs={12} md={8}></Col>
          <LogoutBtn logout={logout} />
        </Row>
      </footer>
    </>
  );
}
