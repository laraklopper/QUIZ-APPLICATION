import React, { useState, useEffect } from 'react'
//Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Page 2 function component
export default function Page2({logout}) {
    //=====STAT E VARIABLES================
  const [play, setPlay] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState()
  const [timer, setTimer] = useState(10)
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      correctAnswer: '',
      options: ['', '', '']
    }
  ]);
    
// Function to handle when an answer is selected
  const handleAnswer = async (answer) => {
    // Conditional rendering to check if the selected answer is correct
    if (answer === selectedQuiz.questions[questionIndex].correctAnswer) {
      setScore(score + 1); // Increment the score if the answer is correct

    }
    // Conditional rendering to check if there are more questions in the quiz
    if (questionIndex < selectedQuiz.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);// Move to the next question
    } else {
      // If no more questions, send the result to the server
      try {
        // Send a POST request to the server to save the results
        const response = await fetch('http://localhost:3001/users/results', {
          method: 'POST', // Use the POST method to send data
          headers: { 
            'Content-Type': 'application/json' // Set the content type to JSON
          }, 
          body: JSON.stringify({ quizId: selectedQuiz._id, score }) // Send the quiz ID and score in the request body
        });
        const data = await response.json();// Parse the response as JSON
        console.log('Result saved:', data);        // Log the saved result to the console for debugging purposes

      } catch (error) {
        console.error('Error saving result:', error);//Log any errors in the console for debugging purposes
      }
    }
  };
    //======JSX RENDERING==========
  return (
    <>
    {/* Header */}
    <Header heading="GAME"/>
    {/* section 1 */}
    <section className='section1'>

    </section>
    <footer>
     <Row>
          <Col xs={12} md={8}>
          </Col>
          <LogoutBtn logout={logout}/>
     </Row>
     
    </footer>
    </>
  )
}
