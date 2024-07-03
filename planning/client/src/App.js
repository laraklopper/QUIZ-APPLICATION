import React, { useEffect, useState } from 'react'
import './App.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import questionList from './components/QuestionList';
import Quiz from './components/Quiz';
import Score from './components/Score';

export default function App() {
  const [questions, setQuestions] = useState(questionList);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(true); // State to control timer
  const [quizStarted, setQuizStarted] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(false);

  useEffect(() => {
    if (quizStarted && timerEnabled) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            handleNextQuestion();
            return 10;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, quizStarted]);

  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 2 === questions.length) {
      setLastQuestion(true);
    }
    setCurrentQuestion(prevQuestion => prevQuestion + 1);
    setTimer(10);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className='h1'>QUIZ TEST</h1>
        </Col>
      </Row>
      {!quizStarted ? (
        <Row>
          <Col xs={12} className='text-center'>
            <Button variant="primary" type='button' onClick={startQuiz}>
              START
            </Button>
          </Col>
        </Row>
      ) : (
        currentQuestion < questions.length ? (
          <Quiz
            timer={timerEnabled ? timer : null} 
            handleAnswerClick={handleAnswerClick}
            currentQuestion={currentQuestion}
            questions={questions}
            lastQuestion={lastQuestion}
            handleNextQuestion={handleNextQuestion}
          />
        ) : (
          <Score
            score={score}
            setScore={setScore}
            setCurrentQuestion={setCurrentQuestion}
            setLastQuestion={setLastQuestion}
            setQuizStarted={setQuizStarted}
            setTimer={setTimer}
          />
        )
      )}
    </Container>
  );
}
