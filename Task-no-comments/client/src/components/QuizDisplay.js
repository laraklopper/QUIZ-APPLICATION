import React, { useCallback, useState } from 'react';// Import the React module to use React functionalities
//Components
import StartQuizForm from '../components/StartQuizForm';//Import the StartQuiz function component
import Quiz from './Quiz';//Import the Quiz function component
import Result from './Result';//Import the results function component

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
    //-------GET--------------------
    //Function to check if a score for the Quiz already exists
  const checkExistingScore = useCallback(async () => {
  try {
    // Retrieve JWT token from local storage
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Authentication required');
      console.log('Authentication required');
      return null;// Exit the function if no token is found
    }

    //Send a GET request to the server 
    const response = await fetch(`http://localhost:3001/scores/findQuizScores/${quizName}/${currentUser.username}`, {
      method: 'GET',//HTTP request method
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',// Specify the content type 
        'Authorization': `Bearer ${token}`,//Add the Authorization header 
      }
    });

    //Response handling
    if (!response.ok) {
      throw new Error('Error fetching scores for the quiz');
    }

    const result = await response.json();//Parse the JSON response from the server

    if (Array.isArray(result.userScores)) {
      // Find the existing score for the current quiz
      const existingScore = result.userScores.find(score => score.name === quizName);
      return existingScore || null;// Return the found score or null if not found
    } else {
      // Handle unexpected data structure
      console.error('Invalid data structure for userScores');
      return null;
    }

  } catch (error) {
    console.error('Error fetching scores:', error.message);
    setError('Error fetching scores');
    return null;
  }
}, [quizName, setError, currentUser.username]);

    //--------PUT------------
    /*Function to update score if a score for the quiz already 
    exists and is better than the prevous result/score*/
  const updateScore = useCallback(async (scoreId) => {

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');

      if (!token) return// Exit function if no token is found
      
      //Send a PUT request to the server
      const response = await fetch (`http://localhost:3001/scores/updateScore/${scoreId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the content type 
          'Authorization': `Bearer ${token}`,//Add the Authorization header 
        },
        body: JSON.stringify({
          score: currentScore
        })
      })

      //Response handling
      if (!response.ok) {
        throw new Error('Error updating score');
      }
      const result = await response.json();// Parse the JSON response

      // Update the user scores state with the new score
      setUserScores(prevScores => [result, ...prevScores])
    } catch (error) {
      console.error('Error saving score', error.message);
      setError('Error saving score', error.message);
    }
  },[currentScore, setError, setUserScores])

  //-------------POST-------------------------

  // Function to add the user Score
  const addScore = useCallback(async () => {
    try {
      // Retrieve JWT token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        console.log('Authentication required');
        return;//Exit the function if the token is missing
      }

      // Check if a score for the quiz already exists
      const existingScore = await checkExistingScore();

      //Conditional rendering to check if a score already exists
      if (existingScore) {      
        /*If an existing score is found, call the 
        updateScore function to update it*/
        await updateScore(existingScore._id) 
        return// Exit the function after updating the score
      }
      //Send a POST request to the server
      const response = await fetch(`http://localhost:3001/scores/addScore`, {
        method: 'POST',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type 
          'Authorization': `Bearer ${token}`,//Add the Authorization header 
        },
        body: JSON.stringify({
          username: currentUser, 
          name: quizName,
          score: currentScore,
        })
      })
      const result = await response.json();
      
      if (response.status === 200 && result.message) {
        console.log(result.message);
        return;
      }

      // Response handling
      if (!response.ok) {
        throw new Error('Error saving score');
      }
  
      // Update the user scores state  
      setUserScores(prevScores => [result, ...prevScores]);
    } catch (error) {
      console.error('Error saving score', error.message);;
      setError('Error saving score', error.message);
    }
  }, [
    currentUser, 
    quizName, 
    setError, 
    setUserScores, 
    checkExistingScore, 
    updateScore, 
    currentScore])



  //=======EVENT LISTENERS==========
  // Function to move to the next question
  const handleNextQuestion = useCallback(() => {
    if (quiz && quiz.questions && quizIndex < quiz.questions.length - 1) {
      // Increment the quiz index to move to the next question
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
      await fetchQuiz(selectedQuizId)// Fetch the quiz by its ID
      setQuizStarted(true)
      setQuizIndex(0)
      setCurrentScore(0) // Reset score to 0
    
      if (quizTimer) {
        // Initialize timer if enabled
      setTimer(10)
      }
    } catch (error) {
      // Handle errors during quiz start
      setError(`Error starting quiz: ${error.message}`);
      console.error('Error starting quiz');
    }
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex , setError])
  
    // Function to restart the quiz
    const handleRestart = useCallback(() => {
      setQuizIndex(0)// Reset the quiz index
      setCurrentScore(0);//Reset the quiz score
      setQuizStarted(true)
      setQuizCompleted(false)// Mark quiz as not completed
      if (quizTimer) {
        setTimer(10)// Clear the timer
        // Restart the quiz if the timer is enabled
        handleQuizStart({preventDefault:() => {}})
      }
      else{
        setTimer(null)
      }
    },[quizTimer, handleQuizStart, setTimer])

    
  //======JSX RENDERING============

  return (
    <div id='quizDisplay'>    
      {/* Show the quiz start form if a quiz is 
      selected but not started */}
      {selectedQuizId && (
        <div id='quizDisplayForm'>
         {/* Form to start quiz */}
         <StartQuizForm
         handleQuizStart={handleQuizStart}
         quizTimer={quizTimer}
         setQuizTimer={setQuizTimer}
         quiz={quiz}
         quizStarted={quizStarted}
         />
        </div>
      )}
      {/* QUIZ */}
      {quiz && quizStarted && (
        // Quiz function component
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
        quizName={quizName}
        timer={timer}
        questions={questions}
        quizCompleted={quizCompleted}
        setQuizCompleted={setQuizCompleted}
        />
      )}
      {quizCompleted && (
        <div>
          {/* Result function component */}
          <Result
          selectedQuizId={selectedQuizId}
          addScore={addScore}
          currentScore={currentScore}
          totalQuestions={questions.length || 0}
          currentUser={currentUser}
          quizName={quizName}
          />
        </div>
      )}
    </div>
  )
}
