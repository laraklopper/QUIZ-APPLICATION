// Import necessary modules and packages
import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 

//EditQuiz Function component
export default function EditQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  quiz, 
  setQuizList,  
  quizList,
  editQuizIndex,
  setEditQuizIndex,
  editQuiz,
  setNewQuizName,
  newQuizName,
  newQuestions, 
  setNewQuestions
}
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  //============EVENT LISTENERS=================

//Function to edit a question
  const handleEditQuestion = () => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions);
    setQuizList(quizList.map(q => q._id === quiz._id ? ...q, questions: updatedQuestions, name: newQuizName } : q));
  };

  //=========JSX RENDERING===================

  return (
    // Form to edit quiz
    <div id='editQuizForm'>
      <Row className='formRow'>
        <Col>
        <h2 className='h2'>EDIT QUIZ</h2>
        </Col>
      </Row>
      <Row className='editQuizRow'>
        <Col xs={6} md={4} className='editQuizCol'>
        <label className='editQuizLabel'>
          {/* Edit quiz name */}
          <p className='labelText'>QUIZ NAME:</p>
          {/* Edit quizName input field */}
          <input
              type='text'
              name='newQuizName' 
              value={newQuizName}
              // Update the newQuizName state with the input value
              onChange={(e) => setNewQuizName(e.target.value)} 
              autoComplete='off'
              placeholder={quiz.name}
              className='editQuizInput'
          />
        </label>
        </Col>
      </Row>
      {/* EDIT QUESTIONS INPUT */}
      <div className='editQuestions'>
        <Row>
          <Col className='editQuestionHead' >
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* EDITED QUIZ QUESTION */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUESTION:</p>
            <input
                type='text' //Specify input type
                name='questionText'
                value={editQuizIndex.questionText}
                onChange={(e) =>
                  setEditQuizIndex({
                    // Preserve other properties
                    ...editQuizIndex, 
                    // Update questionText with the new value
                    questionText: e.target.value 
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
                className='editQuizInput' 
                id='editQuestionInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
          {/* Edited correct answer */}
          <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
                type='text'
                name='correctAnswer'
                value={setEditQuizIndex.correctAnswer} 
                onChange={(e) => 
                  setEditQuizIndex({ 
                    // Spread the current state to retain other properties
                    ...editQuizIndex, 
                    // Update correctAnswer with the new value
                    correctAnswer: e.target.value
                 })}
                autoComplete='off' 
                placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''}
                className='editQuizInput' 
                id='correctAnswer' 
              />
          </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* Edited alternative answer */}
          <label className='editQuizLabel'>
            <p className='labelText'>1.ALTENATIVE ANSWER:</p>
            <input
               type='text'
                name='options[0]'
                value={editQuizIndex.options[0] || ''}
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, 
                    options: [e.target.value, editQuizIndex.options[1], editQuizIndex.options[2]] 
                })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''}
                className='editQuizInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            <label className='editQuizLabel'>
              {/* Edited Alternative answer input */}
              <p className='labelText'>2.ALTENATIVE ANSWER:</p>
              <input
                type='text'
                name='options[1]'
                value={editQuizIndex.options[1] || ''} 
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, 
                    options: [editQuizIndex.options[0],e.target.value, editQuizIndex.options[2]]})}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6}>         
          </Col>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>3.ALTENATIVE ANSWER:</p>
              <input 
              type='text'
                name='options[2]'
                value={editQuizIndex.options[2] || ''} 
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, 
                    options: [editQuizIndex.options[0], editQuizIndex.options[1], e.target.value]                           
                })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''} 
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          {/* BUTTONS */}
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to edit question */}
            <Button 
              variant="primary"  
              onClick={handleEditQuestion}
              className='editQuestionBtn' 
            >
              EDIT QUESTION
            </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to previous question */}
          <Button 
          variant='secondary' //Bootstrap variant
          onClick={() => {
            if (currentQuestionIndex > 0) {setCurrentQuestionIndex(currentQuestionIndex - 1)}
          }}
              className='previousQuestionBtn'
          >
            PREVIOUS QUESTION
          </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to next question */}
            <Button
              variant='secondary'
              onClick={() => {
                if (currentQuestionIndex < quiz.questions.length - 1)
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}>
              NEXT QUESTION
            </Button>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={12} className='editQuizCol'>
          {/* Button to edit quiz */}
            <Button 
              variant='primary'
              onClick={() => editQuiz(quiz._id)}
              >
              EDIT QUIZ
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}