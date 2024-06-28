import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 
// import Form from 'react-bootstrap/Form';


//EditQuizFunction
export default function EditQuiz() {
 const [newQuizName, setNewQuizName] = useState(quiz.quizName);
  const [newQuestions, setNewQuestions] = useState(quiz.questions);
 const handleQuestionChange = (index, event) => {
    const values = [...newQuestions];
    if (event.target.name === 'newQuestionText' || event.target.name === 'newCorrectAnswer') {
      values[index][event.target.name] = event.target.value;
    } else {
      const optionIndex = Number(event.target.name.split('.')[1]);
      values[index].options[optionIndex] = event.target.value;
    }
    setNewQuestions(values);
  };
  // Function to set the form inputs for editing a quiz
  // const handleQuizUpdate = (quiz) => {
  //   setQuizName(quiz.quizName);
  //   setQuestions(quiz.questions);
  //   setUpdateQuiz(quiz._id);
  // };

  
  //=============================================
  return (
    <div>
      <Row>
        <Col>
          <h2>EDIT QUESTIONS</h2>
        </Col>
      </Row>
      <form>
        <Row>
          <Col xs={6} md={4}>
            <label><p>QUIZ NAME:</p>
            <input
            placeholder='QUIZ NAME'
            />
            </label>
          </Col>
          <Col xs={12} md={8}>
          </Col>
        </Row>
          <div>
            <Row>
              <Col xs={6} md={4}>
              {/* select question number */}
              </Col>
              <Col xs={6} md={4}>
                <label>
                  <p className='labelText'>QUESTION:</p>
                  <input
                  type='text'
                  />
                </label>
              </Col>
              <Col xs={6} md={4}>
              <label>
                <p className='labelText'>1. ALTERINATIVE ANSWER:</p>
                <input 
                type='text'
                />
              </label>
              </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4}>
              <label>
                <p className='labelText'>CORRECT ANSWER:</p>
                <input 
                type='text'
                />
              </label>
              </Col>
            <Col xs={6} md={4}>
              <label>
                <p className='labelText'>2. ALTERINATIVE ANSWER:</p>
                <input 
                
                />
              </label>            
              </Col>
          </Row>
          <Row>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4}>
              <label>
                <p className='labelText'>3. ALTERINATIVE ANSWER:</p>
                <input />
              </label>           
               </Col>
              </Row>

          </div>
        <Row>
          <Col xs={12} md={8}>
          </Col>
          <Col xs={6} md={4}>
          </Col>
        </Row>

      </form>
    
    </div>
  )
}
