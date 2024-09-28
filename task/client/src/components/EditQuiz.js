// Import necessary modules and packages
// Import the React module to use React functionalities
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//EditQuiz function component
export default function EditQuiz(//Export default editQuiz Function component
  {//PROPS PASSED FROM PARENT COMPONENT
    quiz, // The quiz object passed from the parent component
    setQuizList, // Function to update the list of quizzes
    quizList,// The current list of all quizzes
    editQuizIndex,// Object holding the state of the question being edited (e.g., text, options)
    setEditQuizIndex, // Function to update the current question's edit state
    editQuiz,// Function to submit the final quiz edit
    setNewQuizName,// Function to update the new quiz name
    newQuizName,// Current value of the edited quiz name
    newQuestions,        // Array holding the new set of questions after edits
    setNewQuestions      // Function to update the list of questions after edits
  }
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);// State to track the index of the current question being edited


  //=========USE EFFECT HOOK==================
  /* Effect to initialize and update the editQuizIndex 
  state when quiz or currentQuestionIndex changes*/
  useEffect(() => {
    //Conditional rendering 
    if (quizList && Array.isArray(quizList.questions) && quizList.questions.length > 0) {
      // Retrieve the current question based on the currentQuestionIndex state
      const currentQuestion = quizList.questions[currentQuestionIndex];

      setEditQuizIndex({// Update the editQuizIndex state with the current question's details
        editQuestionText: currentQuestion?.questionText || '',// Set the question text or empty if undefined
        editCorrectAnswer: currentQuestion?.correctAnswer || '',  // Set the correct answer or empty if undefined      
        editOptions: currentQuestion?.options?.length === 3
        ? currentQuestion.options:
          ['', '', '']// Set options or default to 3 empty strings
      })
    }
  }, [quizList, currentQuestionIndex, setEditQuizIndex, quiz])

  if (!quiz || !quiz.questions) {
    return <div>Loading...</div>// Handle loading or error states
  }

  //============EVENT LISTENERS=================
  // Function to edit a question
const handleEditQuestion = () => {

  if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');//Log an error message in the console for debugging purposes
    alert('No quizzes available to update');//Notify the user that there are no quizzes to update
    return;
  }
  // Conditional rendering to check if there are any new questions to update
  if (!quiz.questions || quiz.questions.length === 0) {
      alert('No questions to update');//Alert the user if no questions exist
      return;// Exit and stop further execution of the function
    }
    // Copy the newQuestions array to avoid directly mutating the state
  const updatedQuestions = [...newQuestions];

  // Update the specific question being edited with the current editQuizIndex state
  updatedQuestions[currentQuestionIndex] = {
    questionText: editQuizIndex.editQuestionText,
    correctAnswer: editQuizIndex.editCorrectAnswer,
    options: editQuizIndex.editOptions
  };

  /* Update the specific question being edited  
  with the current editQuizIndex state*/
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
  // Update the quiz list with the modified quiz
    setQuizList(
      //Map over the existing quizzes
      quizList.map(q =>
        q._id === quiz._id  // Check if the quiz's ID matches the ID of the quiz being edited        
          ? { ...q, questions: updatedQuestions, name: newQuizName } // Update the quiz's questions and name
          : q  // If it doesn't match, return the quiz unchanged
      ));
  };

  //Function to handle navigation between questions
  const handleNavigation = useCallback((direction) => {
    if (quiz.questions && Array.isArray(quizList.questions)) {
        //Conditional rendering to check if the request is to move to the previous question
    if (direction === 'previous' && currentQuestionIndex > 0) {
      // Navigate to the previous question
      setCurrentQuestionIndex((prevIndex) => prevIndex -1)//Decrement the currentQuestion by 1
    } 
      //Conditional rendering to check if the navigation request is to move to the next question.
    else if (direction === 'next' && currentQuestionIndex < quizList.questions.length - 1){
      // Navigate to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);;//Increment the currentQuestionIndex by 1
    }
    }
  },[currentQuestionIndex, quiz.questions, quizList.questions])

  //Function to handle form submission
  const handleEditQuiz= useCallback(async () => {
    try {
      await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID
      // alert('Quiz updated successfully!'),; // Notify the user of success
      console.log('Quiz successufully updated');//Log a success message in the console for debugging purposes
    } catch (error) {
      console.error(`Failed to edit quiz`, error.message);// Log the error mesage in the console for debugging purposes
      alert(`Failed to edit quiz`, error.message)// Notify the user of the failure
    }
  },[editQuiz, quiz._id])
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
      <Row className='editQuizRow'>
        <Col xs={6} md={4} className='editQuizCol'>
          {/* Edit quiz name */}
          <div className='editField'>  
            <label className='editQuizLabel' id='newQuizName'>
              <p className='labelText'>QUIZ NAME:</p>
            </label>
            {/* Edit quizName input field */}
            <input
              type='text'//Specify the input type
              name='newQuizName'
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}// Update newQuizName state on change
              autoComplete='off'//Disable browser autocomplete
              placeholder={quiz.name}// Display current quiz name as placeholder
              id='newQuizName'
              className='editQuizInput'
            />
          </div>
        </Col>
      </Row>
      {/* EDIT QUESTIONS*/}
      <div className='editQuestions'>
        <Row className='editQuestionRow'>
          <Col className='editQuestionHead'>
          <h3 className='h3'>EDIT QUESTIONS</h3>          
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* EDIT QUIZ QUESTION */}
          <div className='editField'>
            <label className='editQuizName' htmlFor='editQuestionInput'>
              <p className='labelText'>QUESTION:</p>
            </label> 
            {/* Edit QuestionTextInput */}
            <input
            type='text'
                name='questionText'//Name for form identification and accessibility
                value={editQuizIndex.questionText}// input value for the questionText state
            onChange={(e) => setEditQuizIndex({
              //Preserve other properties
              ...editQuizIndex,
              //Update questionText with the new value
              questionText: e.target.value
            })
          }
                autoComplete='off'// Disable the browser's autocomplete 
          placeholder={quiz.questions[currentQuestionIndex]?.quiz.questions[currentQuestionIndex].questionText || ''}
          className='editQuizInput'
          id='editQuestionInput'
            />
          </div>       
          </Col>
          <Col xs={6} className='editQuizCol'>
          {/* Edited correct answer */}
          <div className='editField'>
            <label className='editQuizLabel' htmlFor='correctAnswer'>
              <p className='labelText'>CORRECT ANSWER:</p>
            </label>
            {/* Edit correct answer input */}
            <input
            type='text'
                name='correctAnswer'//Name for form identification and accessibility
                value={setEditQuizIndex.correctAnswer}// input value to the correctAnswer state
                onChange={(e) => setEditQuizIndex({
                  // Spread the current state to retain other properties
                ...editQuizIndex,
                  // Update correctAnswer with the new value
              correctAnswer: e.target.value})
            }
            placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer|| ''}
            autoComplete='off'//Disable browser autocomplete
            className='editQuizInput'
                id='correctAnswer'
            />
          </div>
          </Col>
        </Row>
        {/* EDITED ALTERNATIVE ANSWERS*/}
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* Edited alternative answer1 */}
          <div className='editField'>
            <label className='editQuizLabel' htmlFor='option1'>
              <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
            </label>
              {/* Edit alternative answer input */}
            <input
            type='text'//Specify input type
                name='options[0]'//Name for form identification and accessibility
                value={editQuizIndex.editOptions[0] || ''}
            onChange={(e) => 
              setEditQuizIndex({
                // Spread the current state to retain other properties
                ...editQuizIndex,
                options: [
                  e.target.value, // Update first option
                  editQuizIndex.editOptions[1], // Keep the second option unchanged
                  editQuizIndex.editOptions[2],// Keep the third option unchanged
                ]
              })}
              autoComplete='off'//Disable browser autocomplete
              placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''}
              className='editQuizInput'
              id='option1'
            />
          </div>
          </Col>
          <Col xs={6} className='editQuizCol'>
          {/* Edited alternative answer2 */}
            <div className='editField'>
              <label className='editQuizLabel' htmlFor='option2'>
                <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
              </label>
              {/* Edit alternative answer input */}
              <input
                type='text'
                name='options[1]'//Name for form identification and accessibility
                value={editQuizIndex.editOptions[1] || ''}
                onChange={(e) =>
                  setEditQuizIndex({
                    // Spread the current state to retain other properties
                    ...editQuizIndex,
                    options: [
                      editQuizIndex.editOptions[0],// Keep the first option unchanged
                      e.target.value,// Update the second option with the new value
                      editQuizIndex.editOptions[2], // Keep the third option unchanged
                    ]
                  })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}
                className='editQuizInput'
                id='option2'
              />
            </div>
          </Col>
        </Row>
        <Row className='editQuizRow'>
           <Col xs={6} className='editQuizCol'><div></div></Col> 
          {/* Edited alternative answer3 */}
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            <label className='editQuizLabel' htmlFor='option3'>
              <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
            </label>
            {/* Edit alternative answer input */}
            <input
              type='text'
              name='options[2]'//Name for form identification and accessibility
              value={editQuizIndex.editOptions[2] || ''}
              onChange={(e) =>
                setEditQuizIndex({
                  // Spread the current state to retain other properties
                  ...editQuizIndex,
                  options: [
                    editQuizIndex.editOptions[0],// Preserve the first option
                    editQuizIndex.editOptions[1],// Preserve the second option
                    e.target.value// Update the third option with the new value
                  ]
                })}
              autoComplete='off'// Disable the browser autocomplete feature
              placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''}
              className='editQuizInput'
              id='option3'
            />
          </div>
          </Col>   
         
        </Row>
        <Row className='editQuizRow'>
              {/* BUTTONS */}
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to edit a question */}
              <Button variant='primary'
              onClick={handleEditQuestion}
              className='editQuestionBtn'
              type='button'
              aria-label='editQuestion'
              >
                EDIT QUESTION
              </Button>
              </Col>
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to previous question */}
              <Button
              variant='secondary'//Bootrap variant
              onClick={() => handleNavigation('previous')}
              className='prevQuestionBtn'
              type='button'
              aria-label='previous question'
              disabled={currentQuestionIndex === 0}//Disable if first question
              >
                PREVIOUS QUESTION
              </Button>
              </Col>
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to next question */}
              <Button 
              variant='primary'//Bootstrap variant
              onClick={() => handleNavigation('next')}//Event
              className='nextQuestionBtn'
              aria-label='next question'
              type='button'//Button type
              disabled={currentQuestionIndex === quiz.questions.length - 1}// Disable if last question
              >
                NEXT QUESTION
                </Button> 
              </Col>
            </Row>
      </div>
      <div className='editQuiz'>
        <Row>
          <Col xs={6} md={4}>
          {/* Button to edit a quiz */}
              <Button 
              variant='primary'//Bootstrap variant
              type='button'
              className='editQuizButton'
              aria-label='editQuiz'
              onClick={handleEditQuiz}//Call the editQuiz function
              >
                EDIT QUIZ
              </Button>
          </Col>
          <Col xs={12} md={8}></Col>
        </Row>
      </div>
    </div>
  );
}
