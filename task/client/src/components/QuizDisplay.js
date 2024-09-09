import React, { useCallback, useState } from 'react'
//Components
import StartQuizForm from '../components/StartQuizForm'
import Quiz from './Quiz'
import Result from './Result';

export default function QuizDisplay(
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
    // Current question index in the quiz
  const [quizIndex, setQuizIndex] = useState(0);
  // Boolean to track whether the quiz has started
  const [quizStarted, setQuizStarted] = useState(false); 
   // Boolean to track whether the quiz is completed
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentScore, setCurrentScore] = useState(0); // State to track the user's score

    //=========REQUESTS============
    //--------POST------------
    // Function to add the user Score
    const addScore = useCallback(async(e) => {
      try {
      
        //Send a POST request to the server
        const existingScoreResponse = await fetch (`http://localhost:3001/scores/findQuizScores`, {
          method: 'POST',
          mode:'cors',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: currentUser._id,
            quizId: selectedQuizId
          })
        })

        const existingScore = await existingScoreResponse.json();
        
        // Response handling where the response is unsuccessful
        if (existingScore) {
          throw new Error('Error saving score')
        }

        const result = await response.json();
       
        setUserScores (prevScores => [result, ...prevScores]);
      } catch (error) {
        console.error('Error saving score', error.message);
        setError('Error saving score', error.message)
      }
    }, [currentUser, quizName, setError, setUserScores, currentScore])
  //=======EVENT LISTENERS==========
  // Function to move to the next question
  const handleNextQuestion = useCallback(() => {
    if (quizIndex < quiz.questions.length - 1) {
      // Increment the quiz index to move to the next question
      setQuizIndex(quizIndex + 1)
      if(quizTimer) setTimer(10)

    }else{
      //End the Quiz
      setQuizStarted(false)
      setQuiz(null)
      setSelectedQuizId('')
      setQuizCompleted(true)
      addScore()
    }
  },[ quiz, 
    quizIndex,
    quizTimer, 
    setQuizIndex,
    setQuizStarted,
    setQuiz, 
    setSelectedQuizId,
    addScore,  
    setTimer,
    setQuizCompleted
     ])

  //Function to start the quiz
  const handleQuizStart = useCallback(async(e) => {
    e.preventDefault();
    if (!selectedQuizId) return;
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
    }
    
   
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex , setError])
  
    // Function to restart the quiz
    const handleRestart = useCallback(() => {
      setQuizIndex(0)// Reset the quiz index
      setCurrentScore(0);//Reset the quiz score
      setTimer(null)// Clear the timer
      setQuizCompleted(false)
      if (quizTimer) {
        // Restart the quiz if the timer is enabled
        handleQuizStart({preventDefault:() => {}})
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
