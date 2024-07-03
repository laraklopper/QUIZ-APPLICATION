import React, { useState, useEffect } from 'react';
import qBank from "./Components/QuestionBank";
import Questions from './Components/Questions';
import Score from './Components/Score';

export default function App () {
  const [questions, setQuestions] = useState(qBank);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLastq, setIsLastq] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setCurrentQuestion(prevQuestion => prevQuestion + 1);
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
      setIsLastq(true);
    }
    setCurrentQuestion(prevQuestion => prevQuestion + 1);
    setTimer(10);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div>
    <header>
    <Row>
        <h1 className='h1'>GAME</h1
    </Row>
    </header>
    <section>
    
    </section>
      <div>
        {!quizStarted ? (
          <div>
            <h2>Start Test</h2>
            <button onClick={startQuiz}>
              Start Test
            </button>
          </div>
        ) : currentQuestion < questions.length ? (
          <Quiz
            questions={questions}
            handleNextQuestion={handleNextQuestion}
            currentQuestion={currentQuestion}
            handleAnswerClick={handleAnswerClick}
            timer={timer}
            isLastq={isLastq}
          />
        ) : (
          <Score
            score={score}
            setScore={setScore}
            setCurrentQuestion={setCurrentQuestion}
            setQuizStarted={setQuizStarted}
            setIsLastq={setIsLastq}
            setTimer={setTimer}		 
          />
        )}
      </div>
    </div>
  );
};

