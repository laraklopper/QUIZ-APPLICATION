// Import necessary modules and packages
import React, { useCallback } from 'react'// Import the React module to use React functionalities
import '../CSS/newQuestions.css'
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Stack from 'react-bootstrap/Stack';

import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//NewQuestionsList function component
export default function NewQuestionsList(//Export default NewQuestionsList function component
  {//PROPS PASSED FROM PARENT COMPONENT
    questions, 
    setQuestions,
    errorMessage,
    addNewQuiz,
    quizName,
    setQuizName,
    setErrorMessage
  }
) {
  //============EVENT LISTENERS===================
  // Function to delete a question new questuion
  const deleteNewQuestion = (index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions) // Update the questions state with the new array
  }

  // Function to handle form submission
  const handleAddNewQuiz = useCallback(async() => {
    /*Conditional rendering to check if the quiz name is 
    provided and if there is at least one question*/
    if (!quizName || questions.length === 0) {
      setErrorMessage('Please enter a quiz')// Set error message to notify the user 
      return;//Exit the function
    }
    await addNewQuiz()//Call the addNewQuiz component
    // Clear the data after successful submission
    setQuestions([]);  // Clear all questions
    setQuizName('');   // Clear the quiz name
    setErrorMessage('')// Clear any error messages after successful submission
  },[addNewQuiz, questions.length, quizName, setQuizName, setErrorMessage, setQuestions])

// Function to clear the quiz form (name, questions, and error message)
  const handleClearQuiz = () => {
    setQuizName('');// Clear the quiz name
    setQuestions([]);// Clear the questions list
    setErrorMessage('');// Clear any error messages
  };

  //===============JSX RENDERING===============
  return (
    <div id='newQuiz'>   
      {/* New Questions output */}
    <div className='newQuizOuput'>
        <Row className='quizNameRow'>
          <Stack direction="horizontal" gap={3} className='newQuizNameStack' >
            {/* New Quiz Name */}
            <div className="quizNameItem"> 
              <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
              </div>
          </Stack>
        </Row>
        <Row className='newQuestionsRow'>
          <Col className='outputCol'>
            {/* Display an error message if an error occurs */}
            {errorMessage && <div className="error">{errorMessage}</div>}  
          </Col>  
          </Row>       
          {/* LIST OF NEW QUESTIONS */}
          {/* Map the list of new Questions */}
      {questions.map((q, index) => (
        <div className='newQuestionsOutput' key={index}>
          <Row className='questionsRow'>
            <Col md={3} className='newQuestionCol'>
            {/* Display the question text*/}
              <p className='newQuestionText'>{q.questionText}</p>
            </Col>
            <Col md={2} className='newAnswerCol'>
             {/* Display the correct answer  */}
              <p className='newAnswerOutput'>{q.correctAnswer}</p>
            </Col>
            <Col md={4} className='newOptionsCol'>
            {/* Options for the new quiz*/}
              <p className='newOptionsOutput'>
                {Array.isArray(q.options) ? q.options.join(', ') : ''}
              </p>
            </Col>
            <Col md={3} id='newQuizBtnCol'>
            {/* Button to delete new question */}
              <Button
                variant='danger'//Bootstrap variant
                id='deleteQuesBtn'//Unique identifier
                type='button'// Specify the type of the button
                onClick={() => deleteNewQuestion(index)}// Call deleteNewQuestion function
                aria-label={`Delete Question ${index + 1}`}// Accessibility label
              >
                DELETE QUESTION
              </Button>
            </Col>
          </Row>
        </div>
      ))}      
        <Row id='addQuizBtnRow'>
          <Stack direction="horizontal" gap={3} className='addQuizBtnStack'>
            <div className="p-2"></div>
            <div className="p-2 ms-auto">
              {/* Button to clear quiz output */}
              <Button 
                type='reset' //Specify the button type as reset
                variant='danger' // Bootstrap variant
                onClick={handleClearQuiz} //Call the function to reset the quiz data
                aria-label='clear new quiz output' // Accessibility label for screen readers
                id='clearOutputBtn'//Unique identifier
                >
                 CLEAR
                </Button>
            </div>
            <div className="p-2">
              {/* Button to add a new quiz */}
              <Button
                variant='primary'//Bootstrap variant
                type='button'// Specify the type of the button
                id='addQuizBtn'// Button identifier
                onClick={handleAddNewQuiz}// Call the handleAddNewQuiz function
                aria-label='Add Quiz'// Accessibility label for screen readers
              >
                ADD QUIZ
              </Button>
            </div>
          </Stack>
          
        </Row>
      </div>
    </div>
  )
}
