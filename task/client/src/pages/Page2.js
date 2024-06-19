import React, { useState} from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import QuizDisplay from '../components/QuizDisplay';


//Page 2 function component
export default function Page2({logout}) {
  //=========STATE VARIABLES====================
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lastQuestion, setLastQuestion] = useState(false);



//===========================================
    
// Function to handle when an answer is selected
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
      setScore={setScore}
      lastQuestion={lastQuestion}
      setLastQuestion={setLastQuestion}
      handleAnswer={handleAnswer}
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
