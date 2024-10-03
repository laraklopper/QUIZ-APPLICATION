// Import necessary modules and packages
import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//NewQuestionsList function component
export default function NewQuestionsList(
  {//PROPS PASSED FROM PARENT COMPONENT
    quizName, 
    questions, 
    setQuestions
  }
) {

  //============EVENT LISTENERS===================
  // Function to delete a question
  const deleteNewQuestion = (index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions) // Update the questions state with the new array
  }

  //===============JSX RENDERING===============
  return (
    <div className='newQuizInput'>
      <Row>
        <Col md={4} className='quizNameCol'>
        {/* NEW QUIZ NAME */}
          <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
        </Col>
        <Col md={8}></Col>
      </Row>
      {/* List of new questions */}
      {questions.map((q, index) => (
        <div className='questionsOutput' key={index}>
          <Row className='questions'>
            <Col md={3}>
            {/* QUESTION */}
              <p className='questionOutput'>{q.questionText}</p>
            </Col>
            <Col md={2}>
            {/* CORRECT ANSWER */}
              <p className='answerOutput'>{q.correctAnswer}</p>
            </Col>
            <Col md={5}>
            {/* OPTIONS */}
              <p className='options'>{q.options.join(', ')}</p>
            </Col>
            <Col md={2} id='newQuizBtnCol'>
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
    </div>
  )
}
