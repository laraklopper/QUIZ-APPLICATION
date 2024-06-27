import React, { useState} from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import QuizDisplay from '../components/QuizDisplay';


//Page 2 function component
export default function Page2({quizList, logout}) {
  //=========STATE VARIABLES====================
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastQuestion, setLastQuestion] = useState(false);


  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes()
  })
  
  //========REQUESTS======================
// Function to addScore once the user finishes the Quiz
  const handleAnswer = async (answer) => {
    try {
      if (!selectedQuiz) {
        throw new Error("No quiz selected."); // Handle case where no quiz is selected
      }
      const correctAnswer = selectedQuiz.questions[currentQuestion]?.correctAnswer;
      if (answer === correctAnswer) {
        setCurrentScore(currentScore + 1);
      }
      if (currentQuestion < selectedQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const response = await fetch('http://localhost:3001/users/result', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quizId: selectedQuiz._id,
            currentQuestion
          })
        });
        const data = await response.json();
        console.log('Result saved:', data);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
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
