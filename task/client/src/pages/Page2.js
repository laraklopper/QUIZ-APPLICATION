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
    questions,
    quizName,
    currentUser
    }
) {
  // =========STATE VARIABLES====================
  //QuizVariables
  const [selectedQuizId, setSelectedQuizId] = useState('');// Selected quiz ID
  const [quizIndex, setQuizIndex] = useState(0);// Index of the current question in the quiz
  const [startQuiz, setQuizStarted] = useState(false);// Flag to start quiz
  const [quizCompleted, setQuizCompleted] = useState(false); // Flag to check if the quiz is completed  
  const [questionIndex, setQuestionIndex] = useState(null); // State to store the index of the current question
  //Score variables
  const [score, setScore] = useState(0);// User's score
  const [showScore, setShowScore] = useState(false); // Flag to show score
  //Timer variables
  const [timer, setTimer] = useState(null); // Timer for the quiz
  const [quizTimer, setQuizTimer] = useState(false); // Flag to enable or disable timer

  
  //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

//==========================================
//==========================================
  // Fisher-Yates shuffle algorithm to randomize array elements
  // const shuffleArray = (array) => {
  //   let shuffledArray = array.slice(); 
  //   for (let i = shuffledArray.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));    
  //     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  //   }
  //   return shuffledArray;  
  // };

  //Function to randomise answers
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  //=======EVENT LISTENERS============
  // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value); // Update selected quiz ID
  };

    // Function to move to the next question or end the quiz
  const handleNextQuestion = useCallback(() => {
    if (quizIndex < quiz.questions.length - 1) {
      setQuizIndex(quizIndex + 1); // Move to the next question
      if (quizTimer) setTimer(30); // Reset timer if enabled
    } else {
      setQuizStarted(false); // End quiz
      setQuiz(null); // Clear quiz data
      setSelectedQuizId(''); // Reset selected quiz ID
      setTimer(null); // Clear timer
      setQuizCompleted(true); // Mark quiz as completed
    }
  }, [quiz, quizTimer, /*setQuiz*/ quizIndex]);
  

  // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0);  // Reset question index
    setScore(0); // Reset score
    setTimer(null); // Clear timer
    setQuizCompleted(false); // Reset completion flag
    if (quizTimer) {
      handleQuizStart(); // Restart quiz if timer is enabled
    }
  };


  //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (quizId) => {
    try {
     
      if (!quizId) return;// If no quiz ID is selected, exit the function
      const token = localStorage.getItem('token');
      if(!token) return
      // Send a GET request to fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',//Enable Cross-Origin resourcing
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      
      const fetchedQuiz = await response.json();// Parse the JSON response to get the quiz data
      // Shuffle the questions to randomize their order
      const shuffledQuestions = fetchedQuiz.questions.map(question => {
        // Combine options and correct answer
        const optionsWithCorrectAnswer = [...question.options, question.correctAnswer];
       
        const shuffledOptions = shuffleArray(optionsWithCorrectAnswer); // Shuffle the options
        return { ...question, options: shuffledOptions }; // Return the question with shuffled options
      });


      setQuizList(prevQuizList =>
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );
      setQuizName(fetchedQuiz.quizName);
      setQuestions(shuffledQuestions)
      setQuiz(fetchedQuiz)
    } 
    catch (error) {
      setError(`Error fetching quiz: ${error.message}`);
      console.error(`Error fetching quiz: ${error.message}`);
    }
  }, [setQuizList, setError, setQuestions, setQuizName, setQuiz])

   //----------------POST-------------------------
  // Function to save the user's score
 const addScore = async () => {
    // alert('Quiz Completed' + score )
    // console.log('quiz Completed' + score);
    try {
      //Send a POST request to the server 
      const response = await fetch('http://localhost:3001/scores/addScore', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser,
          quizName: quizName,
          score,
        })
      })

      if(!response.ok){
        throw new Error()
      }
      if (response.ok) {
        const userScore = await response.json();

      }
      else {
        throw new Error('Error saving user score');
      }

    } catch (error) {
      console.error('Error saving score');
      setError('Error saving score' + error.message)
    }
  }*/
  
  // Function to start the quiz
  const handleQuizStart = useCallback(async(e) => {
    e.preventDefault()
    if (!selectedQuizId) return;
    await fetchQuiz(selectedQuizId)
    setQuizStarted(true);

    setQuizIndex(0);
    setScore(0);
    if (quizTimer) {
      setTimer(30);
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
          {quiz && startQuiz &&  (
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
           {quizCompleted && (
            <div>
              <Score score={score} quiz={quiz} addScore={addScore} />
              <Button onClick={viewScore}>VIEW SCORE</Button>
            </div>
          )}
          {quizCompleted && (
            <>
              <Button onClick={handleRestart}>RESTART QUIZ</Button>
              <Button onClick={() => setQuizTimer(!quizTimer)}>
                {quizTimer ? 'Disable Timer' : 'Enable Timer'}
              </Button>
            </>
          )}
        </div>
      </section>
      {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}
