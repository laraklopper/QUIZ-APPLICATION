// Import necessary modules and packages
import React, { useEffect, useState} from 'react';
import '../CSS/Page2.css'; // Import styles for Page2
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import Row component from React Bootstrap
import Col from 'react-bootstrap/Col'; // Import Col component from React Bootstrap
//Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import QuizDisplay from '../components/QuizDisplay';


//Page 2 function component
export default function Page2(
  {//PROPS PASSED FROM PARENT COMPONENT 
    quizList, 
    logout, 
    fetchQuizzes
  }
) {
  //=========STATE VARIABLES====================
  const [selectedQuiz, setSelectedQuiz] = useState(null); // State for currently selected quiz
  const [currentScore, setCurrentScore] = useState(0); // State for current score of the user
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [lastQuestion, setLastQuestion] = useState(false); // State to track if last question is reached


  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes(); // Fetch quizzes using the fetchQuizzes function passed as prop
  }, []); // Empty dependency array means this effect runs once on mount
 
  //========REQUESTS======================
// Function to addScore once the user finishes the Quiz
  const handleAnswer = async (answer) => {
    try {
      //Conditional rendering to check if a quiz is selected
      if (!selectedQuiz) {
        throw new Error("No quiz selected.");// Throw error if no quiz is selected
      }
      const correctAnswer = selectedQuiz.questions[currentQuestion]?.correctAnswer;
      if (answer === correctAnswer) {
        setCurrentScore(currentScore + 1);// Increment score if answer is correct
      }
      if (currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1); // Move to next question if not the last question
      } else {
        // If the last question is answered, send the result to server
        const response = await fetch('http://localhost:3001/users/result', {
          method: 'POST',//HTTP request method
          mode: 'cors',//Set the mode to cors, allowing cross-origin requests
          headers: {
            'Content-Type': 'application/json'// Specify the Content-Type being sent in the request payload. 
          },
          body: JSON.stringify({
            quizId: selectedQuiz._id,// JSON body data: quizId taken from selectedQuiz object
            currentQuestion // The currentQuestion value taken from component state
          })
        });
        const data = await response.json();//Parse the response data
        console.log('Result saved:', data); // Log the result saved in response from server in the console for debugging purposes
      }
    } catch (error) {
      console.error('Error handling answer:', error);//Log an error message in the console for debugging purposes
    }
  }

    //======JSX RENDERING==========

  return (
    <>
    {/* Header */}
    <Header heading="GAME"/>
    {/* section 1 */}
    <section className='section1'>
      {/* QuizDisplay */}
      <QuizDisplay
      quizList={quizList}
      setCurrentScore={setCurrentScore}      
      lastQuestion={lastQuestion}
      setLastQuestion={setLastQuestion}
      handleAnswer={handleAnswer}
      currentQuestion={currentQuestion}
      setCurrentQuestion={setCurrentQuestion}
      setSelectedQuiz={setSelectedQuiz}
      />     
    </section>
    <footer className='pageFooter'>
     <Row>
          <Col xs={12} md={8}>
          </Col>
          <LogoutBtn logout={logout}/>
     </Row>
     
    </footer>
    </>
  )
}
