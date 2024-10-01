// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//EditQuiz function component
export default function EditQuiz(//Export default editQuiz Function component
  {//PROPS PASSED FROM PARENT COMPONENT
    quiz, 
    quizList,
    setQuizList, 
    editQuizIndex,
    setEditQuizIndex, 
    setNewQuizName,
    newQuizName,
    editQuiz,
    newQuestions,       
    setNewQuestions,      
  }
) {
  //=============STATE VARIABLES======================
  // State to track the index of the current question being edited
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //=========USE EFFECT HOOK==================
  /* Effect to initialize and update the editQuizIndex 
  state when quiz or currentQuestionIndex changes*/
  useEffect(() => {
    console.log('Quiz:', quiz);
    console.log('Current Question Index:', currentQuestionIndex);

    //Conditional rendering to check that the questions are valid
    if (quiz &&  
      Array.isArray(quiz.questions) &&  
      quiz.questions.length > 0 && 
      currentQuestionIndex < quiz.questions.length) {
      const currentQuestion = quiz.questions[currentQuestionIndex];// Retrieve the current question based on the currentQuestionIndex state
      console.log(currentQuestion);//Log the current question in the console for debugging purposes
      console.log(quiz);//Log the quiz in the console for debugging purposes
    
      //Conditional rendering to check if the the currentQuestion exists
      if (currentQuestion) {
        // Update the editQuizIndex state with the current question's details
        setEditQuizIndex({
        editQuestionText: currentQuestion?.questionText || '',// Set the question text or empty if undefined
        editCorrectAnswer: currentQuestion?.correctAnswer || '',// Set the correct answer or empty if undefined        
        editOptions: Array.isArray(currentQuestion?.options) && 
        currentQuestion.options.length === 3 ? currentQuestion.options: ['', '', '']// Set options or default to 3 empty strings
      })}     
    }}, [ currentQuestionIndex, setEditQuizIndex, quiz])

  /* Effect to synchronize newQuestions state with quiz.questions whenever
 the quiz prop changes.*/
  useEffect(() => {
    if (quiz && Array.isArray(quiz.questions)) {      
      setNewQuestions(quiz.questions);// Update newQuestions with current quiz's questions
    }
  }, [quiz, setNewQuestions]);
  //============EVENT LISTENERS=================
  // Function to edit a question
const handleEditQuestion = () => {
  // Conditional rendering to ensure that the quizList is not an empty array
  if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');//Log an error message in the console for debugging purposes
    alert('No quizzes available to update');//Notify the user if no quizzes are available to update
    return;
  }

  //Conditional rendering to check if the quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    alert('No questions to update');//Display an alert to the user 
      return;// Exit if there are no questions to update
    }
  //Conditional rendering to check if the currentQuestionIndex is greater than or equal to the length of the quiz.questions array
  if (currentQuestionIndex >= quiz.questions.length) {
    console.error('Current question index is out of bounds');//Log an error message in the console for debugging purposes
    alert('Invalid question Index')// Notify the user of the invalid index
    return;// Exit if index is invalid
  }
     const updatedQuestions = [...newQuestions];// Copy the newQuestions array to avoid directly mutating the state

  /* Update the specific question being edited 
  with the current editQuizIndex state*/
  updatedQuestions[currentQuestionIndex] = {
    questionText: editQuizIndex.editQuestionText,// Updated question text
    correctAnswer: editQuizIndex.editCorrectAnswer,// Updated correct answer
    options: editQuizIndex.editOptions// Updated alternative options
  };

  /* Update the specific question being edited  
  with the current editQuizIndex state*/
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
    setQuizList(// Update the quiz list with the modified quiz
      //Map over the existing quizzes
      quizList.map(q =>        // Check if the quiz's ID matches the ID of the quiz being edited
        q._id === quiz._id  
          ? { ...q, questions: updatedQuestions, name: newQuizName } // Update the quiz's questions and name 
          : q  // If it doesn't match, return the quiz unchanged
      ));
  };

   //Function to handle navigation between questions
  const handleNavigation = useCallback(direction => {
    if (quiz.questions && Array.isArray(quiz.questions)) {
      console.error('Quiz questions are not properly defined.');
      alert('Cannot navigate questions at this time.');
      return;
    }
    if (direction === 'previous') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      } else {
        console.log('You are already at the first question.');
      }
    } else if (direction === 'next'){
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log('You are already at the last question');
      }
    }
  },[])
  //Function to handle navigation between questions
  const handleNavigation = useCallback((direction) => {
    if (quiz.questions && Array.isArray(quiz.questions)) {
        /*Conditional rendering to check if the request 
        is to move to the previous question*/
    if (direction === 'previous' && currentQuestionIndex > 0) {// Navigate to the previous question
      setCurrentQuestionIndex((prevIndex) => prevIndex -1) //Decrement the currentQuestion by 1
    } 
      /*Conditional rendering to check if the navigation 
      request is to move to the next question.*/
    else if (direction === 'next' && 
      currentQuestionIndex < quiz.questions.length - 1){      // Navigate to the next question     
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);;//Increment the currentQuestionIndex by 1
    }
    }
  },[currentQuestionIndex, quiz.questions])

  //Function to handle form submission
  const handleEditQuiz= useCallback(async () => {
    try {
      await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID
      alert('Quiz updated successfully!'); // Notify the user of success
      console.log('Quiz successufully updated');//Debugging
    } catch (error) {
      console.error(`Failed to edit quiz`, error.message);//Log an error message in the console for debugging purposes
      alert(`Failed to edit quiz`, error.message)// Notify the user of the failure
    }
  },[editQuiz, quiz._id])

  //==================CONDITIONAL RENDERING=================
  // Display a loading message if quiz data isn't available yet
  if (!quiz || !Array.isArray(quiz.questions)) {
    return <div>Loading...</div>;// Handle loading or error states
  }

  //Conditional rendering to check if the currentQuestion index is valid
  if (currentQuestionIndex >= quiz.questions.length) {
    // Return an error message if the index is invalid
    return <div>Invalid question index</div>
  }
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
              name='newQuizName'// Name attribute for form identification
              value={newQuizName}//Input value for the newQuizName 
              onChange={(e) => setNewQuizName(e.target.value)}// Update state on input change
              autoComplete='off'// Disable browser autocomplete
              placeholder={quiz.name}// Placeholder shows current quiz name
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
            type='text'//Specify the input type as text
                name='questionText'//Name for form identification and accessibility
                value={editQuizIndex.editQuestionText}// input value for the questionText state
            onChange={(e) => setEditQuizIndex({              
              ...editQuizIndex,//Preserve other properties             
              editQuestionText: e.target.value//Update questionText with the new value
            })}
              autoComplete='off'// Disable the browser's autocomplete 
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}// Placeholder with current question text
                className='editQuizInput'//CSS class for styling
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
                type='text'//Specify the input type as text
                name='correctAnswer'//Name for form identification and accessibility                
                value={editQuizIndex.editCorrectAnswer}// input value to the correctAnswer state
                onChange={(e) => setEditQuizIndex({
                ...editQuizIndex,// Spread the current state to retain other properties               
              correctAnswer: e.target.value})}// Update correctAnswer with the new value           
            placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer|| ''}
            autoComplete='off'//Disable browser autocomplete
            className='editQuizInput'//CSS class for styling
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
                ...editQuizIndex,// Spread the current state to retain other properties
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
                type='text'//Specify the input type
                name='options[1]'//Name for form identification and accessibility
                value={editQuizIndex.editOptions[1] || ''}
                onChange={(e) =>
                  setEditQuizIndex({                   
                    ...editQuizIndex, // Spread the current state to retain other properties
                    options: [
                      editQuizIndex.editOptions[0],// Keep the first option unchanged
                      e.target.value,// Update the second option with the new value
                      editQuizIndex.editOptions[2], // Keep the third option unchanged
                    ]
                  })}
                autoComplete='off'// Disable the browser autocomplete feature
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}
                className='editQuizInput'// CSS class for styling
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
              type='text'//Specify the input type
              name='options[2]'//Name for form identification and accessibility
              value={editQuizIndex.editOptions[2] || ''}
              onChange={(e) =>
                setEditQuizIndex({                
                  ...editQuizIndex,// Spread the current state to retain other properties
                  options: [
                    editQuizIndex.editOptions[0],// Preserve the first option
                    editQuizIndex.editOptions[1],// Preserve the second option
                    e.target.value// Update the third option with the new value
                  ]
                })}
              autoComplete='off'// Disable the browser autocomplete feature
              placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''}
                className='editQuizInput'// CSS class for styling
              id='option3'
            />
          </div>
          </Col>            
        </Row>
        <Row className='editQuizRow'>
              {/* BUTTONS */}
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to edit a question */}
              <Button 
              variant='primary'//Bootstrap variant
              onClick={handleEditQuestion}//Event handler to edit the question
              className='editQuestionBtn'// CSS class for styling
              type='button'//Specify the button type
              aria-label='editQuestion'
              >
                EDIT QUESTION
              </Button>
              </Col>
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to previous question */}
              <Button
              variant='secondary'//Bootrap variant
              onClick={() => handleNavigation('previous')}//Event handler to navigate to the previous question
              className='prevQuestionBtn'// CSS class for styling
              type='button'//Specigy the button type
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
              onClick={() => handleNavigation('next')}// Event handler to navigate to the next question
              className='nextQuestionBtn'//CSS class for styling
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
              type='button'//Specify the button type
              className='editQuizButton'//CSS class for styling
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
