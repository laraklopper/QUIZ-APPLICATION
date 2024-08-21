// Import necessary modules and packages
import React, { useCallback, useEffect, useState} from 'react';
import '../CSS/Page2.css';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quiz from '../components/Quiz';

// Page 2 function component
export default function Page2(
  {// PROPS PASSED FROM PARENT COMPONENT
    quizList,
    setQuizList,
    logout,
    fetchQuizzes,
    setError,
    quiz,
    setQuiz,  
    setQuizName,
    setQuestions,
    questions
    }
) {
  // =========STATE VARIABLES====================
  const [selectedQuizId, setSelectedQuizId] = useState('');// State for the selected quiz ID
  // State for the current quiz index (question index in the quiz)
  const [quizIndex, setQuizIndex] = useState(0);
  const [startQuiz, setQuizStarted] = useState(false);// State to control whether the quiz has started
  const [questionIndex, setQuestionIndex] = useState(null);// State for the current question index  
  //Score variables
  const [score, setScore] = useState(0);  // State for tracking the user's score
  //Timer variables
  const [timer, setTimer] = useState(null);  // State for the quiz timer
  const [quizTimer, setQuizTimer] = useState(false);// State to control whether the timer is active


  //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

//==========================================
  // Fisher-Yates shuffle algorithm to randomize array elements
  const shuffleArray = (array) => {
    let shuffledArray = array.slice(); // Create a copy of the array to avoid mutating the original array
    //  Create a shallow copy of the original array so that the shuffle doesn't alter the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {// Loop from the end of the array to the beginning
      const j = Math.floor(Math.random() * (i + 1));     // Generate a random index from 0 to i

      // Swap the element at index i with the element at the random index j
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;  // Return the shuffled array
  };


  //Function to calculate the score
  // const calculateScore = () => {
  //   let score = 0;
  //   questions.forEach((question, index)=> {
  //     if (answers[index] === question.correctAnswer) {
  //       score++
  //     }
  //   });
  //   setScore(score)
  //   showScore(true)//display the score when quiz is comleted
  // }
  
  //=======EVENT LISTENERS============
  // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value); // Update the selected quiz ID
  };

// Function to move to the next question
const handleNextQuestion = useCallback(() => {
  // Conditional rendering if the current quiz index is less than the last question index
  if (quizIndex < quiz.questions.length - 1) {
    // Move to the next question by incrementing the quizIndex
    setQuizIndex(quizIndex + 1); 
    
    // Reset the timer if the quizTimer is enabled
    if (quizTimer) {
      setTimer(30); // Set the timer to 30 seconds
    }
  } else {
    // Actions to perform when all questions have been answered
    setQuizStarted(false); // Stop the quiz
    setQuiz(null); // Clear the current quiz data
    setSelectedQuizId(''); // Reset the selected quiz ID
    setTimer(null); // Clear the timer
    setQuestionIndex(null); // Reset the question index
  }
}, [quiz, quizTimer, quizIndex]); 
  // Dependencies: Only re-create the function if quiz, quizTimer, or quizIndex changes

  // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0); // Reset quiz index to start
    setScore(0); // Reset score
    setTimer(null); // Reset timer
    if (quizTimer) {
      handleQuizStart(); // Restart quiz if timer is enabled
    }
  };


  //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (quizId) => {//Define an async function to fetch a single quiz
    try {
     
      if (!quizId) return;// If no quiz ID is selected, exit the function
      const token = localStorage.getItem('token');// Exit if no token is available
      if(!token) return
      // Send a GET request to fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',//Enable CORS
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type as JSON
          'Authorization': `Bearer ${token}`, // Include token for authorization
        }
      })

      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');//Throw an error message if the GET request is unsuccessful
      }
    
    const fetchedQuiz = await response.json();// Parse the JSON response to get the quiz data
      // Shuffle the questions to randomize their order
      // const shuffledQuestions = shuffleArray(fetchedQuiz.questions);
      const shuffledQuestions = fetchedQuiz.questions.map(question => {
        // Combine options and correct answer
        const optionsWithCorrectAnswer = [...question.options, question.correctAnswer];    
        const shuffledOptions = shuffleArray(optionsWithCorrectAnswer); // Shuffle the options
        return { ...question, options: shuffledOptions }; // Return the question with shuffled options
      });
 // Update quiz list and state
      setQuizList(prevQuizList =>
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );// Update the quiz list with the fetched quiz
    setQuizName(fetchedQuiz.quizName); // Set the quiz name
    setQuestions(shuffledQuestions); // Set the shuffled questions
    setQuiz(fetchedQuiz); // Set the current quiz
    } 
    catch (error) {
      setError(`Error fetching quiz: ${error.message}`);// Set an error message to be displayed
      console.error(`Error fetching quiz: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  }, [setQuizList, setError, setQuestions, setQuizName, setQuiz])

  //----------POST--------------------------------
    //Function to save score
  const addScore = async () => {//Define an async function to add userScores
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/quiz/addScore', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Enable CORS
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type as JSON
          'Authorization': `Bearer ${token}`, // Include token for authorization
        },
        body: JSON.stringify({
          username: currentUser, // Pass current user's name
          quizName: quizName, // Pass quiz name
          score, // Pass the current score
        })
      });
      if (response.ok) {
        const userScore = await response.json(); // Parse the response data
      } else {
        throw new Error('Error saving user score'); // Throw an error message if the POST request is not successful
      }
    } catch (error) {
      console.error('Error saving score'); // Log error message in the console for debugging purposes
      setError('Error saving score: ' + error.message); // Set the error state
    }
  };
  
   // Function to start the quiz
  const handleQuizStart = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!selectedQuizId) return; // Exit if no quiz ID is selected
    await fetchQuiz(selectedQuizId); // Fetch quiz data
    setQuizStarted(true); // Start the quiz

    setQuizIndex(0); // Reset quiz index
    setScore(0); // Reset score
    if (quizTimer) {
      setTimer(30); // Start timer if enabled
    }
  }, [selectedQuizId, quizTimer, fetchQuiz]);


  // ==========JSX RENDERING==========
  return (
    <>
    {/* Header */}
      <Header heading="GAME" />
      {/* Section1 */}
      <section className='section1'>
        <div>
        <Row>
          <Col>
            <h2 className='h2'>SELECT QUIZ</h2>
          </Col>
        </Row>
          <Row> 
            <Col md={4}></Col>
            <Col xs={6} md={4} id='selectQuizCol'>
              <label id='selectQuizLabel'>
                <p className='labelText'>SELECT: </p>
                </label>
                {/* Form to select quiz */}               
              <Form.Select  
              id='quizSelect' 
              value={selectedQuizId}
                // Handles selection change and fetches quiz data
              onChange={(e) => {handleSelectQuiz(e)}}
              >
                {/* Default option prompting the user to select a quiz */}
                <option value=''>Select a quiz</option>
                {/* Map over the quizList array to create 
                an option for each quiz */}
                {quizList.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {/* Display quiz name */}
                    {quiz.name}
                  </option>
                ))}
              </Form.Select>
            </Col>           
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <div>
          {/* Display a form to start the selected quiz*/}
          {selectedQuizId && (
            <div id='quizDisplayForm'>
              {/* Form to start quiz */}
              <form onSubmit={handleQuizStart}>
                <Row>
                  <Col md={12}>
                    {/* Display quiz name */}
                    <h3 className='quizName'>{quiz ? quiz.name : ''}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={4}></Col>
                  <Col xs={6} md={4}>
                  {/* Checkbox to add timer */}
                    <label id='addTimerLabel'>
                      <p className='labelText'>ADD TIMER:</p>
                      <input
                        type='checkbox'
                        checked={quizTimer}
                        onChange={(e) => setQuizTimer(e.target.checked)}
                        id='quizTimer'
                      />
                    </label>
                  </Col>
                  <Col xs={6} md={4}>
                  {/* Button to start quiz */}
                    <Button 
                    type='submit' 
                    variant='primary' 
                    >
                      START QUIZ
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          {/* QUIZ */}
          {quiz && startQuiz && (
            // Quiz component
            <Quiz
              selectedQuiz={quiz} 
              quizIndex={quizIndex} 
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
              handleNextQuestion={handleNextQuestion}
              handleRestart={handleRestart}
              score={score} 
              quizTimer={quizTimer} 
              timer={timer} 
              questions={questions}
              setScore={setScore}
            />
          )}
        </div>
      </section>
      {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}
