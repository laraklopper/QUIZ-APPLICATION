import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//EditQuizFunction
export default function EditQuiz() {


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
