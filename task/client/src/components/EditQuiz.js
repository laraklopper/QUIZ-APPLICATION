// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 
import FormHeaders from './FormHeaders';

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
      const currentQuestion = quiz.questions[currentQuestionIndex];
      console.log(currentQuestion);
      console.log(quiz);
    
      //Conditional rendering to check if the the currentQuestion exists
      if (currentQuestion) {
        setEditQuizIndex({
        editQuestionText: currentQuestion.questionText || '',
        editCorrectAnswer: currentQuestion.correctAnswer || '',       
        editOptions: Array.isArray(currentQuestion.options) && 
        currentQuestion.options.length === 3 ? currentQuestion.options: ['', '', '']
      })}     
    }}, [ currentQuestionIndex, setEditQuizIndex, quiz])

  /* Effect to synchronize newQuestions state with quiz.questions whenever
 the quiz prop changes.*/
  useEffect(() => {
    if (quiz && Array.isArray(quiz.questions)) {      
      setNewQuestions(quiz.questions);
    }
  }, [quiz, setNewQuestions]);
  //============EVENT LISTENERS=================
  // Function to edit a question
const handleEditQuestion = () => {
  // Conditional rendering to ensure that the quizList is not an empty array
  if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');
    alert('No quizzes available to update');
    return;
  }

  //Conditional rendering to check if the quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    alert('No questions to update');//Display an alert to the user 
      return;// Exit if there are no questions to update
    }
  if (currentQuestionIndex >= quiz.questions.length) {
    console.error('Current question index is out of bounds');
    alert('Invalid question Index')// Notify the user of the invalid index
    return;// Exit if index is invalid
  }
     const updatedQuestions = [...newQuestions];

 
  updatedQuestions[currentQuestionIndex] = {
    questionText: editQuizIndex.editQuestionText,
    correctAnswer: editQuizIndex.editCorrectAnswer,
    options: editQuizIndex.editOptions
  };

  /* Update the specific question being edited  
  with the current editQuizIndex state*/
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
    setQuizList(// Update the quiz list with the modified quiz
      quizList.map(q => q._id === quiz._id ? 
        { ...q, questions: updatedQuestions, name: newQuizName } : q));
  };

  //Function to handle navigation between questions
  const handleNavigation = useCallback(direction => {
    if (!quiz.questions && !Array.isArray(quiz.questions)) {
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
  },[currentQuestionIndex, quiz.questions])


  //Function to handle form submission
  const handleEditQuiz= useCallback(async () => {
    try {
      await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID
      alert('Quiz updated successfully!'); 
      console.log('Quiz successufully updated');
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

  //Conditional rendering to check if the currentQuestion index is valid
  if (currentQuestionIndex >= quiz.questions.length) {
    // Return an error message if the index is invalid
    return <div>Invalid question index</div>
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
                name='questionText'
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
                name='correctAnswer'              
                value={editQuizIndex.editCorrectAnswer}
                onChange={(e) => setEditQuizIndex({
                ...editQuizIndex,              
                correctAnswer: e.target.value})}          
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
              {/* Edit alternative answer input */}
            <input
            type='text'
                name='options[0]'
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
              {/* Edit alternative answer input */}
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
        <Row className='editQuizRow'>
              {/* BUTTONS */}
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to edit a question */}
              <Button 
              variant='primary'//Bootstrap variant
              onClick={handleEditQuestion}
              className='editQuestionBtn'// CSS class for styling
              type='button'//Specify the button type
              aria-label='editQuestion'
              >
                EDIT QUESTION
              </Button>
              </Col>
              {/* Navigation buttons */}
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to previous question */}
              <Button
              variant='secondary'//Bootrap variant
              onClick={() => handleNavigation('previous')}
              className='prevQuestionBtn'
              type='button'//Specigy the button type
              aria-label='previous question'
              disabled={currentQuestionIndex === 0}
              >
                PREVIOUS QUESTION
              </Button>
              </Col>
              <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to next question */}
              <Button 
              variant='primary'
              onClick={() => handleNavigation('next')}
              className='nextQuestionBtn'
              aria-label='next question'
              type='button'
              disabled={currentQuestionIndex === quiz.questions.length - 1}
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
