import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//QuizDisplay function
export default function QuizDisplay() {
    //=========STATE VARIABLES====================
    const [answers, setAnswers] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [currentScore, setCurrentScore] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [lastQuestion, setLastQuestion] = useState(false); // Indicates if the current question is the last one
    const [quizStarted, setQuizStarted] = useState(false)
    const [newQuizName, setNewQuizName] = useState('')
    const [questions, setQuestions] = useState([
        {
            questionText: '',
            correctAnswer: '',
            options: ['', '', '']
        }
    ]);
    // const [score, setScore] = useState(0);
     //State variables to handle timer option

    const [timer, setTimer] = useState(10)
    const [timerEnabled, setTimerEnabled] = useState(false);
    
   //=============TIMER=====================
    //===========USE EFFECT HOOK TO DISPLAY TIMER OPTION============
    useEffect(() => {
        if
            (play) {
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if
                        (prevTimer > 0) {
                        return prevTimer - 1;
                    }
                    else {
                        setCurrentQuestion(prevQuestion => prevQuestion + 1);
                        return 10;
                    }
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentQuestion]);

     useEffect(() => {
        if (timeLeft === 0) {
            return () => clearInterval(intervalRef)
        }
    },[timeLeft])

        const handleStart= () => {
        clearInterval(intervalRef.current); // Clear any existing interval
        setTimeLeft(10); // Reset the countdown to 10 seconds

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
    }
 

    const handleStop = () => {
        clearInterval(intervalRef.current)
    }
    
    // Handles the change in the timer option
    // const handleTimerChange = (event) => {
    //     setTimerEnabled(event.target.checked); // Update timerEnabled based on the checkbox state
    // };

    //=========EVENT LISTENERS====================

    //Function to startQuiz
    const startQuiz = () => {
        setQuizStarted(true)
    };

      const handleSelect = (event) => {
    try {
      const quiz = JSON.parse(event.target.value)
      setSelectedQuiz(quiz)
      setCurrentQuestion(0)
      setScore()
    } catch (error) {
      console.error('Error parsing quiz:', error);
    }
  }
    //================JSX RENDERING=========================
  return (
    <div>
        {! quizStarted ? (
            <div>
                <h3 className='h3'>{selectedQuiz.quizName}</h3>
            <form>
              <Row>
                <Col xs={12} md={8}>
                  <label>
                    <p>SELECT</p>
                    <select onChange={(e) => startQuiz(quizList.find(q => q.category === e.target.value))}>
                      {quizList.map((quiz, index) => (
                        <option key={index} value={quiz.name}>{quiz.name}</option>
                      ))}

                    </select>
                  </label>
                </Col>
                <Col xs={6} md={4}>
                  <label>
                    Add Timer:
                    <input type="checkbox" onChange={(e) => setTimer(e.target.checked ? 60 : null)} />
                  </label>
                </Col>
              </Row>
              <h4>{/* question */}</h4>

              <div>

              </div>
            </form>
        </div>
      ):(
            <div>
              <Row>
                <Col>
                  <h2 className='h2'>SELECT QUIZ</h2>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <label>
                    <p>SELECT</p>
                    <select onChange={(e) => startQuiz(quizList.find(q => q.category === e.target.value))}>
                      {quizList.map((quiz, index) => (
                        <option key={index} value={quiz.name}>{quiz.name}</option>
                      ))}

                    </select>
                  </label>
                </Col>
                <Col xs={6} md={4}>
                  <label>
                    Add Timer:
                    <input type="checkbox" onChange={(e) => setTimer(e.target.checked ? 60 : null)} />
                  </label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>

                </Col>
                <Col xs={6} md={4}>
                  <button onClick={startQuiz}>PLAY</button>
                </Col>
              </Row>
           
            </div>
      )}  )
}
