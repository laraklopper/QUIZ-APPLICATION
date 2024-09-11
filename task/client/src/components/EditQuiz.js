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
        // Get the text of the current question, defaulting to an empty string if not available
        editQuestionText: quiz.questions[currentQuestionIndex]?.questionText || '',
        // Get the correct answer for the current question, defaulting to an empty string if not available
        editCorrectAnswer: quiz.questions[currentQuestionIndex]?.correctAnswer || '',
        // Get the options for the current question, defaulting to an array of three empty strings if not available
        editOptions: quiz.questions[currentQuestionIndex]?.options || ['','','']
      })
    }
  }, [quiz, currentQuestionIndex, setEditQuizIndex])
  // Dependencies array: the effect runs when quiz, currentQuestionIndex, or setEditQuizIndex changes

//============EVENT LISTENERS=================

  // Function to edit a question
  const handleEditQuestion = () => {
    //Conditional rendering 
    if (newQuestions.length === 0) {
      alert('No questions to update');
      return;//Exit early if an error occurs
    }
    const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
   
    setNewQuestions(updatedQuestions); // Update the state with the new list of questions
    
    setQuizList(//Update the quiz list (`quizList`) by mapping over it
      quizList.map(q =>
        q._id === quiz._id 
          ? { ...q, questions: updatedQuestions, name: newQuizName } : q 
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
            <Col xs={6} className='editQuiz'> 
            {/* Edited correct answer */}
              <div className='editField'>
                <label className='editQuizLabel' htmlFor='editAnswer'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                </label>
                {/* New correct answer input */}
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
              </div>          
             </Col>
          </Row>
            {/* Input for each option */}
          {[0, 1, 2].map((optionIndex) => (
            <Row className='editQuizRow' key={optionIndex}>
              <Col xs={6}  className='editQuizCol'>
              <div className='editField'>             
              <label><p className='labelText'>ALTERNATIVE ANSWER:</p></label>
                <input
                  type='text'
                  name={`editOption${optionIndex + 1}`}
                  value={editQuizIndex.editOptions[optionIndex]}
                  onChange={(e) => {
                    const updatedOptions = [...editQuizIndex.editOptions];
                    updatedOptions[optionIndex] = e.target.value;
                    setEditQuizIndex({ ...editQuizIndex, editOptions: updatedOptions });
                  }}
                  placeholder={quiz.questions[currentQuestionIndex]?.options[optionIndex] || ''}
                  id={`editOption${optionIndex + 1}`}
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
