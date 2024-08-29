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
    // currentQuestion
  }
) {
  //=============STATE VARIABLES======================
  // State to track the index of the current question being edited
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //============EVENT LISTENERS=================

  // Function to edit a question
  const handleEditQuestion = () => {
    // Create a copy of the current list of questions (`newQuestions`)
    const updatedQuestions = [...newQuestions];
    /*Update the question at the current index (`currentQuestionIndex`) 
    with the data in `editQuizIndex`*/
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
              type='text'//Specify input type
              name='newQuizName'// Name attribute for the input
              value={newQuizName}// The current value of the quiz name
              onChange={(e) => setNewQuizName(e.target.value)}// Update state on change
              autoComplete='off'// Disable browser autocomplete
              placeholder={quiz.name}// Placeholder showing the current quiz name
              id='newQuizName'// ID for the input field
              className='editQuizInput'// CSS class for styling
            />          
        </div>
        </Col>
        <Col xs={12} md={8} className='editQuizCol'></Col>
      </Row>
            {/* Section for editing the questions */}
      <div className='editQuestions'>
        <Row>
          <Col className='editQuestionHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
          {/* Row for editing the question text */}
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
          {/* Label for the question input field */}
            <label className='editQuizLabel' htmlFor='editQuestion'>
              <p className='labelText'>QUESTION:</p>
            </label>
              <input
                type='text'//Specify the input type
                name='editQuestionText'// The name attribute used to identify the input
                value={editQuizIndex.editQuestionText}// The current value of the question text
                onChange={(e) => 
                  setEditQuizIndex({
                    ...editQuizIndex, // Preserve the existing state
                    editQuestionText: e.target.value, // Update the question text
                  })}
                autoComplete='off'//Disable the brower autocomplete field
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
                id='editQuestion' //Unique identifier for the input field.
                className='editQuizInput'// CSS class for styling 
              />         
          </div>
          </Col>
          <Col xs={6} className='editQuizCol' htmlFor='editAnswer'>
            {/* Edited correct answer */}
            <div className='editField'>
                  {/* Label for the correct answer input field */}
              <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
                </label>
                  {/* Input field to edit the correct answer */}
              <input
                type='text'//Specify input type as text
                name='editCorrectAnswer'// Name attribute for the input
                value={editQuizIndex.editCorrectAnswer}// The current value of the correct answer
                 onChange={(e) => setEditQuizIndex({
                    ...editQuizIndex, // Preserve the existing state
                    editCorrectAnswer: e.target.value, // Update the correct answer
                  })}
                   autoComplete='off' // Disable browser autocomplete
                  placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''} // Placeholder showing the current correct answer
                  id='editAnswer' // ID for the input field
                  className='editQuizInput' // CSS class for styling
              />
            
            </div>           
          </Col>
        </Row>
        {/* Rows for editing the alternative answers */}
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            {/* Edited alternative answer 1 */}
          {/* Label for the first alternative answer */}
              <label className='editQuizLabel' htmlFor='optionOne'>
                <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
              </label>
          {/* Input field to edit the first alternative answer */}
              <input
                type='text'//Specify the input type
                name='editOptions[0]'// Name attribute for the input
                value={editQuizIndex.editOptions[0] || ''}// The current value of the first alternative answer
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex, // Preserve the existing state
                    editOptions: [
                      e.target.value, // Update the first alternative answer
                      editQuizIndex.editOptions[1] || '', // Preserve the second alternative answer
                      editQuizIndex.editOptions[2] || '', // Preserve the third alternative answer
                    ],
                  })
                }
                 autoComplete='off' // Disable browser autocomplete
                // Placeholder showing the current first alternative answer
                placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''} 
                id='optionOne' // ID for the input field
                className='editQuizInput' // CSS class for styling
              />
          </div>       
          </Col>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            {/* Label for the second alternative answer */}
              <label className='editQuizLabel'>
                <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
              </label>
                  {/* Input field to edit the second alternative answer */}
              <input
                type='text'//Specify the input type
                name='editOptions[1]'// Name attribute for the input
                value={editQuizIndex.editOptions[1] || ''} // The current value of the second alternative answer
                  onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex, // Preserve the existing state
                    editOptions: [
                      editQuizIndex.editOptions[0] || '', // Preserve the first alternative answer
                      e.target.value, // Update the second alternative answer
                      editQuizIndex.editOptions[2] || '', // Preserve the third alternative answer
                    ],
                  })
                }
                autoComplete='off' // Disable browser autocomplete
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''} // Placeholder showing the current second alternative answer
                id='optionTwo' // ID for the input field
                className='editQuizInput' // CSS class for styling
              />
          </div>           
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
              {/* Label for the third alternative answer */}
             <label className='editQuizLabel' htmlFor='optionThree'>
              <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
              </label>
                  {/* Input field to edit the third alternative answer */}
              <input
                type='text'//Specify the input type
                name='editOptions[2]'// Name attribute for the input
                value={editQuizIndex.editOptions[2]}// Value of the third alternative answer
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex,// Preserve the existing state
                    editOptions: [
                      editQuizIndex.editOptions[0] || '', // Preserve the first option
                      editQuizIndex.editOptions[1] || '', // Preserve the second option
                      e.target.value, // Update the third option
                    ],
                  })
                }
                autoComplete='off' // Disable browser autocomplete
                placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''} // Placeholder showing current value or empty
                id='optionThree' // ID for the input field
                className='editQuizInput' // CSS class for styling
              />           
          </div>                       
          </Col>
        </Row>
        <Row className='editQuizRow'>
          {/* BUTTONS */}
          {/* Buttons for editing the quiz and navigating between questions */}
          <Col xs={6} md={4} className='editQuizCol'>
            {/* Button to edit question */}
            <Button
              variant='primary'
              onClick={handleEditQuestion}// Calls the function to handle editing the question
              className='editQuestionBtn'
            >
              EDIT QUESTION
            </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
                {/* Button to navigate to the previous question */}
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
            {/* Button to navigate to the next question */}
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
                {/* Button to save changes and edit the quiz */}
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
