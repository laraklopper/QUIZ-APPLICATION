import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 


//EditQuizFunction
export default function EditQuiz(
  { //PROPS PASSED FROM PARENT COMPONENT
  quiz,
  newQuizName, 
  editQuiz,
  setNewQuestion,
  setNewQuizName,
  newQuestion
  }
) {

  //==================EVENT LISTENERS===========================
 
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

  
//==========JSX RENDERING===========================

  return (
    <div>
      <Row>
        <Col>
          <h2 className='h3'>EDIT QUESTIONS</h2>
        </Col>
      </Row>
      <form onSubmit={(e) => { e.preventDefault(); editQuiz(quiz._id); }}>
        <Row>
          <Col xs={6} md={4} className='editQuizCol'>
            <label htmlFor='newQuizName'>
              <p className='labelText'>QUIZ NAME:</p>
              <input
                placeholder='QUIZ NAME'
                onChange={(e) => setNewQuizName(e.target.value)}
                value={newQuizName}
                id='newQuizName'
                type='text'
              />
            </label>
          </Col>
        </Row>
        {newQuestion.map((question, index) => (
          <div key={index}>
            <Row>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}>
                <label>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    type='text'
                    placeholder='question'
                    name='newQuestionText'
                    value={question.newQuestionText}
                    onChange={(e) => handleQuestionChange(index, e)}
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
                    name='newCorrectAnswer'
                    value={question.newCorrectAnswer}
                    onChange={(e) => handleQuestionChange(index, e)}
                  />
                </label>
              </Col>
            </Row>
            {question.options.map((option, optIndex) => (
              <Row key={optIndex}>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                  <label>
                    <p className='labelText'>{optIndex + 1}. ALTERNATIVE ANSWER:</p>
                    <input
                      type='text'
                      name={`option.${optIndex}`}
                      value={option}
                      onChange={(e) => handleQuestionChange(index, e)}
                    />
                  </label>
                </Col>
              </Row>
            ))}
          </div>
        ))}
        <Row>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4}>
            <Button type="submit" variant="primary">EDIT</Button>
          </Col>
        </Row>
      </form>
    </div>
  );
}

