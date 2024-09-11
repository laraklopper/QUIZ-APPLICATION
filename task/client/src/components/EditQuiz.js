// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

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

  //=========USE EFFECT HOOK==================
   /* Effect to initialize and update the editQuizIndex state when 
  quiz or currentQuestionIndex changes*/
  useEffect(() => {
    // Conditional rendering to check if the object is available
    if (quiz) {
      // Update the editQuizIndex state with data from the current question
      setEditQuizIndex({
        editQuestionText: quiz.questions[currentQuestionIndex]?.questionText || '',// Set the question text or empty if undefined
        editCorrectAnswer: quiz.questions[currentQuestionIndex]?.correctAnswer || '',// Set the correct answer or empty if undefined
        editOptions: quiz.questions[currentQuestionIndex]?.options || ['', '', '']// Set options or default to 3 empty strings
      })
    }
  }, [quiz, currentQuestionIndex, setEditQuizIndex])
  // Dependencies array: the effect runs when quiz, currentQuestionIndex, or setEditQuizIndex changes

//============EVENT LISTENERS=================

  // Function to edit a question
const handleEditQuestion = () => {
  // Conditional rendering to check if there are any new questions to update
    if (newQuestions.length === 0) {
      // If no questions are available, alert the user and stop the function execution
      alert('No questions to update');
      return;// Exit the function
    }
    // Copy the newQuestions array to avoid directly mutating the state
  const updatedQuestions = [...newQuestions];
  /* Update the specific question being edited by replacing its value 
  with the current editQuizIndex state*/
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
  // Update the quiz list with the modified quiz
    setQuizList(
      //Map over the existing quizzes
      quizList.map(q =>
        // Check if the quiz's ID matches the ID of the quiz being edited
        q._id === quiz._id 
          // Update the quiz's questions and name
          ? { ...q, questions: updatedQuestions, name: newQuizName } 
          : q  // If it doesn't match, return the quiz unchanged
      ));
  };

 

  //==============JSX RENDERING====================
  
  return (
    <div id='editQuizForm'>      
      <Row className='formRow'>
        <Col>
        {/* Heading for editQuiz section */}
          <h2 className='h2' id='quizEditHead'>EDIT QUIZ</h2>
        </Col>
      </Row>
      {/* Form to edit quiz */}
      <form onSubmit={(e) =>{ e.preventDefault(); editQuiz(quiz._id)}}>
        <Row className='editQuizRow'>
          <Col xs={6} md={4} className='editQuizCol'>
          <div className='editField'>
              {/* Edit quiz name */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUiZ NAME:</p>
          </label>
              {/* Edit quizName input field */}
            <input
              type='text'
              name='newQuizName'
              value={newQuizName}// The current value of the edited question
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
        <div className='editQuestions'>
           <Row>
          <Col className='editQuestionHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
          <Row>
            <Col xs={6} className='editQuizRow'>
            <div className='editField'>
                <label className='editQuizLabel' htmlFor='editQuestion'>
                  {/* EDITED QUIZ QUESTION */}
                  <p className='labelText'>QUESTION:</p>
                </label>
                {/* New question input */}
               <input
                  type='text'
                  name='editQuestionText'
                  value={editQuizIndex.editQuestionText} // The current value of the edited question
                  onChange={(e) =>
                    setEditQuizIndex({
                      ...editQuizIndex,
                      editQuestionText: e.target.value, 
                    })}
                  autoComplete='off'
                  placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}// Placeholder shows current question text
                  id='editQuestion'
                  className='editQuizInput'
                />      
            </div>
            </Col>
            <Col xs={6} className='editQuiz'> 
            {/* Edited correct answer */}
              <div className='editField'>
                <label className='editQuizLabel' htmlFor='editAnswer'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                </label>
                {/* New correct answer input */}
                <input
                  type='text'//Input type
                  name='editCorrectAnswer'// Name of the input field
                  value={editQuizIndex.editCorrectAnswer}// The value of the input is bound to the 'editCorrectAnswer' property in the editQuizIndex state
                  onChange={(e) => setEditQuizIndex({
                    ...editQuizIndex,// Spread the current state to retain other properties
                    editCorrectAnswer: e.target.value,// Update only the 'editCorrectAnswer' property with the new value from the input
                  })}
                  autoComplete='off'//Disable the browser from autocompleting the previous answers
                  placeholder={quiz.questions[currentQuestionIndex]
                    ?.correctAnswer || ''}
                  id='editAnswer'
                  className='editQuizInput'
                />
              </div>          
             </Col>
          </Row>
            {/* Input for each option */}
         {[0, 1, 2].map((optionIndex) => (
            <Row className='editQuizRow' key={optionIndex}>
              <Col xs={6}  className='editQuizCol'>
              <div className='editField'>             
              <label className='editQuizLabel'>
                <p className='labelText'>ALTERNATIVE ANSWER:</p>
              </label>
              {/* Input for new option */}
                <input
                  type='text'//Input type
                    name={`editOption${optionIndex + 1}`}// Set a unique name for each option input
                    value={editQuizIndex.editOptions[optionIndex]}// The current value of the edited option
                    //The value of the input is controlled by the 'editOptions' array in editQuizIndex state
                  onChange={(e) => {
                    const updatedOptions = [...editQuizIndex.editOptions];// Clone the existing options array to maintain immutability
                    updatedOptions[optionIndex] = e.target.value;  // Update the specific option in state
                    setEditQuizIndex({ ...editQuizIndex, editOptions: updatedOptions });// Set the updated options array back to the state
                  }}
                    placeholder={quiz.questions[currentQuestionIndex]?.options[optionIndex] || ''}// Placeholder shows current option value
                    id={`editOption${optionIndex + 1}`}// Assign a unique ID for each option input field
                  className='editQuizInput'
                />
                </div>  
              </Col>             
            </Row>
          ))}
          {/* <Row className='editQuizRow'>
            <Col xs={6} className='editQuizCol'>
              <div className='editField'>
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
                        e.target.value, 
                        editQuizIndex.editOptions[2] || '',
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
          </Row> */}

          {/* <Row className='editQuizRow'>
            <Col xs={6} className='editQuizCol'>
              <div className='editField'>
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
          </Row> */}
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
          </div>
          <div className='editQuiz'>
          <Row className='editQuizRow'>
            <Col xs={12} className='editQuizCol'>
              {/* Button to edit quiz */}
              <Button
                variant='primary'
                type='submit'
                // Call the editQuiz function with the quiz ID on click
                // onClick={() => editQuiz(quiz._id)}
              >
                EDIT QUIZ
              </Button>
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
}
