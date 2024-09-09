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
    setNewQuestions,
  }
) {
  //=============STATE VARIABLES======================
  // State to track the index of the current question being edited
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //============EVENT LISTENERS=================

  // Function to edit a question
  const handleEditQuestion = () => {
    const updatedQuestions = [...newQuestions];
    
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
   
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
    
    setQuizList(//Update the quiz list (`quizList`) by mapping over it
      quizList.map(q =>// Iterate over each quiz in the quizList array
        /* If the current quiz matches the quiz being edited 
        (`quiz._id`), return an updated version:*/
        q._id === quiz._id // Check if the current quiz ID matches the ID of the quiz being edited
          ? { ...q, questions: updatedQuestions, name: newQuizName }// If it matches, return a new object with updated questions and name
          : q // If it doesn't match, return the quiz as is
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
          <h2 className='h2' id='quizEditHead'>EDIT QUIZ</h2>
        </Col>
      </Row>
      <Row className='editQuizRow'>
        <Col xs={6} md={4} className='editQuizCol'>
        <div className='editField'> 
          {/* Edit quiz name */}
          <label className='editQuizLabel' htmlFor='newQuizName'> 
            <p className='labelText'>QUIZ NAME:</p>
          </label>
            {/* Edit quizName input field */}
            <input
              type='text'
              name='newQuizName'
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
              autoComplete='off'
              placeholder={quiz.name}
              id='newQuizName'
              className='editQuizInput'
            />          
        </div>
        </Col>
        <Col xs={12} md={8} className='editQuizCol'></Col>
      </Row>
      {/* New question input */}
      <div className='editQuestions'>
        <Row>
          <Col className='editQuestionHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            <label className='editQuizLabel' htmlFor='editQuestion'>
              {/* EDITED QUIZ QUESTION */}
              <p className='labelText'>QUESTION:</p>
            </label>
              <input
                type='text'
                name='editQuestionText'
                value={editQuizIndex.editQuestionText}
                onChange={(e) => 
                  setEditQuizIndex({
                    ...editQuizIndex, 
                    editQuestionText:
                    e.target.value,
                  })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
                id='editQuestion' 
                className='editQuizInput'
              />         
          </div>
          </Col>
          <Col xs={6} className='editQuizCol' htmlFor='editAnswer'>
            {/* Edited correct answer */}
            <div className='editField'>
              <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
                type='text'
                name='editCorrectAnswer'
                value={editQuizIndex.editCorrectAnswer}
                onChange={(e) => setEditQuizIndex({
                  ...editQuizIndex, 
                  editCorrectAnswer: e.target.value,
                })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.correctAnswer || ''}
                  id='editAnswer'
                className='editQuizInput'
              />
            </label>
            </div>           
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            {/* Edited alternative answer 1 */}
              <label className='editQuizLabel' htmlFor='optionOne'>
                <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
              </label>
              <input
                type='text'
                name='editOptions[0]'
                value={editQuizIndex.editOptions[0] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    editOptions: [
                      e.target.value,// Update the first option
                      editQuizIndex.editOptions[1] || '',// Preserve the second option
                      editQuizIndex.editOptions[2] || '', // Preserve the third option
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''}
                id='optionOne'
                className='editQuizInput'
              />
          </div>       
          </Col>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
              {/* Edited alternative answer 2*/}
              <label className='editQuizLabel'>
                <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
              </label>
              <input
                type='text'
                name='editOptions[1]'
                value={editQuizIndex.editOptions[1] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    editOptions: [
                      editQuizIndex.editOptions[0] || '', // Preserve the first option
                      e.target.value, // Update the second option
                      editQuizIndex.editOptions[2] || '', // Preserve the third option
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}
                id='optionTwo'
                className='editQuizInput'
              />
          </div>           
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
              {/* Edited alternative answer 3 */}
             <label className='editQuizLabel' htmlFor='optionThree'>
              <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
              </label>
              <input
                type='text'
                name='editOptions[2]'
                value={editQuizIndex.editOptions[2]}
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,
                    editOptions: [
                      editQuizIndex.editOptions[0] || '', // Preserve the first option
                      editQuizIndex.editOptions[1] || '', // Preserve the second option
                      e.target.value, // Update the third option
                    ],
                  })
                }
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]
                  ?.options[2] || ''}
                  id='optionThree'
                className='editQuizInput'
              />           
          </div>                       
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
                /*Conditional rendering to check if the current question
                index is less than the last question index*/
                if (currentQuestionIndex < quiz.questions.length - 1) {
                  // Increase the index to move to the next question
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
