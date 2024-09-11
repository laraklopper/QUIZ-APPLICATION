import React, { useCallback, useState } from 'react'
//Components
import StartQuizForm from '../components/StartQuizForm'
import Quiz from './Quiz'
import Result from './Result';

//QuizDisplay Function component
export default function QuizDisplay(//Export default quizDisplay component
  {// PROPS PASSED FROM PARENT COMPONENT
    selectedQuizId, 
    quiz, 
    setQuiz,
    fetchQuiz,
    quizName,
    currentUser,
    setError,
    questions,
    setTimer,
    quizTimer,
    setQuizTimer,
    timer,
    setSelectedQuizId,
    setUserScores
  }) {
    //======STATE VARIABLES=========== 
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);   
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  // const [attempts, setAttempts] = useState(1)
    //=========REQUESTS============
    //--------POST------------
    // Function to add the user Score
// Function to add the user Score
  const addScore = useCallback(async (e) => {//Define an async function to add a users Score
    e.preventDefault()
    try {
      const token = localStorage.getItem('token');
     
      if (!token) {
        alert('Authentication required');
        console.log('Authentication required')
        return;//Exit the function if the token is missing
      }
      //Send a POST request to the server
      const response = await fetch(`http://localhost:3001/scores/addScore`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type 
          'Authentication': `Bearer ${token}`,//Add the Authorization header 
        },
        body: JSON.stringify({
          username: currentUser.username,
          name: quizName,
          score: currentScore,
          // attempts: currentAttempts
        })
      })

      // Response handling where the response is unsuccessful
      if (!response.ok) {
        throw new Error('Error saving score')
      }

      const result = await response.json();
      // Update the user scores state 
      setUserScores(prevScores => [result, ...prevScores]);
    } catch (error) {
      console.error('Error saving score', error.message);
      setError('Error saving score', error.message);
    }
  }, [currentUser, quizName, setError, setUserScores, currentScore])
  //=======EVENT LISTENERS==========
  // Function to move to the next question
  const handleNextQuestion = useCallback(() => {
    if (quiz && quiz.questions && quizIndex < quiz.questions.length - 1) {
      setQuizIndex(quizIndex + 1)
      if (quizTimer) setTimer(10)// Reset timer if quiz timer is enabled
    }else{
       setQuizStarted(false)
      setQuiz(null) 
      setSelectedQuizId('')
      setQuizCompleted(true)
    }
  },[ quiz, 
    quizIndex,
    quizTimer, 
    setQuizIndex,
    setQuizStarted,
    setQuiz, 
    setSelectedQuizId,
    setTimer,
    setQuizCompleted
     ])

  //Function to start the quiz
  const handleQuizStart = useCallback(async(e) => {
    e.preventDefault();
    if (!selectedQuizId) return;// If no quiz is selected, return early
    try {
      await fetchQuiz(selectedQuizId)
      setQuizStarted(true)
      setQuizIndex(0)
      setCurrentScore(0) 
    if (quizTimer) {
      setTimer(10)// Initialize timer if enabled
    }
    } catch (error) {
      setError('Error starting quiz: ', error.message);
      console.error('Error starting quiz')
    }
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex , setError])
  
    // Function to restart the quiz
    const handleRestart = useCallback(() => {
      setQuizIndex(0)
      setCurrentScore(0);
      setQuizStarted(true)
      setQuizCompleted(false)
      if (quizTimer) {
        setTimer(10)
        // Restart the quiz if the timer is enabled
        handleQuizStart({preventDefault:() => {}})
      }else{
        setTimer(null)
      }
    },[quizTimer, handleQuizStart, setTimer])
    
  //======JSX RENDERING============

  return (
    <div id='quizDisplay'>    
      {selectedQuizId && (
        <div id='quizDisplayForm'>
         {/* Form to start quiz */}
         <StartQuizForm
         handleQuizStart={handleQuizStart}
         quizTimer={quizTimer}
         setQuizTimer={setQuizTimer}
         quiz={quiz}
         />
        </div>
      )}
      {/* QUIZ */}
      {quiz && quizStarted && (
        <Quiz
        selectedQuiz={quiz}
        quizIndex={quizIndex}
        setQuizIndex={setQuizIndex}
        handleRestart={handleRestart}
        handleNextQuestion={handleNextQuestion}
        quiz={quiz}
        currentScore={currentScore}
        setCurrentScore={setCurrentScore}
        quizTimer={quizTimer}
        timer={timer}
        questions={questions}
        quizCompleted={quizCompleted}
        setQuizCompleted={setQuizCompleted}
        />
      )}
      {quizCompleted && (
        <div>
          <Result
          selectedQuizId={selectedQuizId}
          addScore={addScore}
          currentScore={currentScore}
          totalQuestions={questions.length}
          currentUser={currentUser}
          quizName={quizName}
          />
        </div>
      )}
    </div>
  )
}
