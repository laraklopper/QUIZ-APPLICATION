// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 
// Components
import FormHeaders from './FormHeaders';
import NavigationBtns from './NavigationBtns';

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
    //Conditional rendering to check that the questions are valid
    if (quiz && Array.isArray(quiz.questions) &&  
      quiz.questions.length > 0 && 
      currentQuestionIndex < quiz.questions.length) {

      // Retrieve the current question based on currentQuestionIndex
      const currentQuestion = quiz.questions[currentQuestionIndex];
      console.log(currentQuestion);//Log the current question in the console for debugging purposes
      console.log(quiz);//Log the quiz in the console for debugging purposes
    
      //Conditional rendering to check if the the currentQuestion exists
      if (currentQuestion) {
        setEditQuizIndex({
          editQuestionText: currentQuestion.questionText || '',// Set question text or empty string
          editCorrectAnswer: currentQuestion.correctAnswer || '',   // Set correct answer or empty string      
          editOptions: Array.isArray(currentQuestion.options) && // Set options if exactly 3 are present
        currentQuestion.options.length === 3 
        ? currentQuestion.options
            : ['', '', ''] // Otherwise, default to three empty strings
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
/*const handleEditQuestion = () => {
  // Conditional rendering to ensure that the quizList is not an empty array
  if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');//Log an error messag in the console for debugging purposes
    return;// Exit the function if there are no quizzes to update
  }

  //Conditional rendering to check if the quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    console.log('No questions available to update');//Log an error message in the console for debugging purposes
      return;// Exit if there are no questions to update
    }
  if (currentQuestionIndex >= quiz.questions.length) {
    console.error('Invalid question Index');//Log an error message in the console for debugging purposes
    return;// Exit if index is invalid
  }

  //Copy the newQuestions array to avoid mutaing state
     const updatedQuestions = [...newQuestions];

 
  // Update the specific question being edited with the current editQuizIndex state
  updatedQuestions[currentQuestionIndex] = {
    questionText: editQuizIndex.editQuestionText,
    correctAnswer: editQuizIndex.editCorrectAnswer,
    options: editQuizIndex.editOptions
  };
   
  // Update the state with the new list of questions
  setNewQuestions(updatedQuestions);
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
  };*/

  //Function to handle form submission
  const handleEditQuiz= useCallback(async () => {
    try {
      await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID
    } catch (error) {
      console.error(`Failed to edit quiz: ${error.message}`);
      alert(`Failed to edit quiz: ${error.message}`);
    }
  },[editQuiz, quiz._id])

  
  //==================CONDITIONAL RENDERING=================
  // Display a loading message if quiz data isn't available yet
  if (!quiz || !Array.isArray(quiz.questions)) {
    return <div>Loading...</div>;// Handle loading or error states
  }

  //==============JSX RENDERING====================
  
  return (
    <div id='editQuizForm'>      
    {/* Form heading */}
      <FormHeaders formHeading='EDIT QUIZ'/>
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
                name='editQuestionText'
                value={editQuizIndex.editQuestionText}
                onChange={(e) => setEditQuizIndex({
                  ...editQuizIndex, 
                  editQuestionText: 
                  e.target.value
                })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
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
                name='editCorrectAnswer'              
                value={editQuizIndex.editCorrectAnswer}
                onChange={(e) => 
                  setEditQuizIndex({
                ...editQuizIndex,              
                editCorrectAnswer: e.target.value})}          
                placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer|| ''}
                autoComplete='off'
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
                ]
              })}
              autoComplete='off'
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
              <input
                type='text'
                name='options[1]'
                value={editQuizIndex.editOptions[1] || ''}
                onChange={(e) =>
                  setEditQuizIndex({                   
                    ...editQuizIndex, 
                    options: [
                      editQuizIndex.editOptions[0],
                      e.target.value,
                      editQuizIndex.editOptions[2], 
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
           <Col xs={6} className='editQuizCol'></Col> 
          {/* Edited alternative answer3 */}
          <Col xs={6} className='editQuizCol'>
          <div className='editField'>
            <label className='editQuizLabel' htmlFor='option3'>
              <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
            </label>
            <input
              type='text'
              name='options[2]'
              value={editQuizIndex.editOptions[2] || ''}
              onChange={(e) =>
                setEditQuizIndex({                
                  ...editQuizIndex,
                  options: [
                    editQuizIndex.editOptions[0],
                    editQuizIndex.editOptions[1],
                    e.target.value
                  ]
                })}
              autoComplete='off'
              placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''}
                className='editQuizInput'
              id='option3'
            />
          </div>
          </Col>            
        </Row>
      {/* BUTTONS */}
        <Row className='editQuizRow'>
          <Col className='editQuizCol'></Col>
          {/*Button to edit a question*/}
            {/* <Col xs={6} md={4} className='editQuizCol'>
              <Button 
              variant='primary'
              className='editQuizBtn'
              onClick={handleEditQuestion}
              type='button'>
                EDIT QUESTION
              </Button>
            </Col>
            <Col xs={12} md={8}></Col> */}
        </Row>
           <NavigationBtns 
              quiz={quiz} 
              currentQuestionIndex={currentQuestionIndex} 
              setCurrentQuestionIndex={setCurrentQuestionIndex}/>
      </div>
      <div className='editQuiz'>
        <Row>
          <Col xs={6} md={4} id='editQuesBtnCol'>
          {/* Button to edit a quiz */}
              <Button 
              variant='primary'
              type='button'
              className='editQuizButton'
              aria-label='editQuiz'
              onClick={handleEditQuiz}
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
