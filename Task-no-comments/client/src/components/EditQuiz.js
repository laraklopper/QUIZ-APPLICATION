// Import necessary modules and packages
import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//EditQuiz function component
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

  // Function to edit a question
  const handleEditQuestion = () => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions);     
    setQuizList(quizList.map(q => q._id === quiz._id ? { ...q, questions: updatedQuestions, name: newQuizName }: 
      )
    );
  };

 

  //==============JSX RENDERING====================
  
  return (
    // Form to edit quiz
    <div id='editQuizForm'>
      <Row className='formRow'>
        <Col>
        {/* Heading for editQuiz section */}
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
              onChange={(e) => setNewQuizName(e.target.value)}
              autoComplete='off'// Disable autocomplete
              placeholder={quiz.name}
              className='editQuizInput'
            />
          </label>
        </Col>
      </Row>
      <div className='editQuestions'>
        <Row>
          <Col className='editQuestionHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
            <label className='editQuizLabel'>
              {/* EDITED QUIZ QUESTION */}
              <p className='labelText'>QUESTION:</p>
              <input
                type='text'
                name='editQuestionText'
                value={editQuizIndex.editQuestionText}
                onChange={(e) => setEditQuizIndex({...editQuizIndex, questionText: e.target.value,})
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.newQuestionText || ''}
                className='editQuizInput'
              />
            </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            {/* Edited correct answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
                type='text'
                name='editCorrectAnswer'
                value={editQuizIndex.editCorrectAnswer}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    editCorrectAnswerCorrectAnswer: e.target.value,
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.editCorrectAnswer || ''}
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
              <input
                type='text'
                name='editOptions[0]'
                value={editQuizIndex.editOptions[0] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    options: [
                      e.target.value,
                      editQuizIndex.editOptions[1],
                      editQuizIndex.editOptions[2],
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.editOptions || ''}
                className='editQuizInput'
              />
            </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
              <input
                type='text'
                name='editOptions[1]'
                value={editQuizIndex.editOptions[1] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    options: [
                      editQuizIndex.editOptions[0],
                      e.target.value,
                      editQuizIndex.editOptions[2],
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.editOptions || ''}
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
              <input
                type='text'
                name='editOptions[2]'
                value={editQuizIndex.editOptions[2] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    newOptions: [
                      editQuizIndex.editOptions[0],
                      editQuizIndex.editOptions[1],
                      e.target.value,
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.editOptions || ''}
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
              variant='primary'
              onClick={handleEditQuestion}
              className='editQuestionBtn'
            >
              EDIT QUESTION
            </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
            {/* Button to move to previous question */}
            <Button
              variant='secondary'
              onClick={() => {
                /* Conditional rendering to check if the current
            question index is greater than 0*/
                if (currentQuestionIndex > 0) {
                  // Decreases the index to move to the previous question
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
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
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
              className='nextQuestionBtn'
            >
              NEXT QUESTION
            </Button>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={12} className='editQuizCol'>
            {/* Button to edit quiz */}
            <Button
              variant='primary'
              // Call the editQuiz function with the quiz ID on click
              onClick={() => editQuiz(quiz._id)}
            >
              EDIT QUIZ
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
