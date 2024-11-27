// Import necessary modules and packages
import React, { useCallback } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
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
    //Conditional rendering to check if the quiz name is provided and if there is at least one question
    if (!quizName || questions.length === 0) {
      setErrorMessage('Please enter a quiz')
      return;//Exit early
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
          <Col md={4} className='quizNameCol'>
            {/* NEW QUIZ NAME */}
            <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
          </Col>
          <Col md={8}></Col>
        </Row>
        <Row className='newQuestionsRow'>
          <Col className='outputCol'>
            {/* Display an error message if an error occurs */}
            {errorMessage && <div className="error">{errorMessage}</div>}
            {/* LIST OF NEW QUESTIONS */}
            {/* <h4 className='h4'>NEW QUESTIONS</h4> */}
          </Col>  </Row>       
          {/* Map the list of new Questions */}
      {questions.map((q, index) => (
        <div className='questionsOutput' key={index}>
          <Row className='questionsRow'>
            <Col md={3} className='questionsCol'>
            {/* QUESTION */}
              <p className='questionOutput'>{q.questionText}</p>
            </Col>
            <Col md={2}>
             {/* CORRECT ANSWER  */}
              <p className='answerOutput'>{q.correctAnswer}</p>
            </Col>
            <Col md={4}>
            {/* OPTIONS */}
              <p className='optionsOutput'>
                {Array.isArray(q.options) ? q.options.join(', ') : ''}
              </p>
            </Col>
            <Col md={3} id='newQuizBtnCol'>
            {/* Button to delete new question */}
              <Button
                variant='danger'
                id='newQuizBtn'
                type='button'
                onClick={() => deleteNewQuestion(index)}
                aria-label={`Delete Question ${index + 1}`}
              >
                DELETE QUESTION
              </Button>
            </Col>
          </Row>
        </div>
      ))}      
        <Row id='addQuizBtnRow'>
          <Col md={7}></Col>          
          <Col md={5} id='addQuizBtnCol'>
          {/* Button to clear quiz output */}
            <Button 
            type='reset' 
            variant='danger' 
            onClick={handleClearQuiz} 
            aria-label='clear new quiz output'  
            id='clearOutputBtn'>CLEAR</Button> 
            {/* Button to add a new quiz */}
            <Button
              variant='primary'
              type='button'
              id='addQuizBtn'
              onClick={handleAddNewQuiz}
              aria-label='Add Quiz'
            >
              ADD QUIZ
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
