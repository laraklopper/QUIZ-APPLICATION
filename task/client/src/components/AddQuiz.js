// Import necessary modules and packages
import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


//Add quiz function component
export default function AddQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizName,
  setQuizName, 
  questions, 
  setQuestions,
  addNewQuiz,
  currentQuestion,
  setCurrentQuestion,
}) {
  //===========STATE VARIABLES====================
  // State to manage the error message displayed to the user
  const [errorMessage, setErrorMessage] = useState('');

  //============EVENT LISTENERS=========================
  //Function to add a new question
  const handleAddQuestion = () => {
    if (questions.length >= 5) {
      alert('You must add up to 5 questions.'); 
      console.log('You must add up to 5 questions.');
      return;// Exit the function to prevent adding more questions
    }
    if (!currentQuestion.questionText  || !currentQuestion.correctAnswer  || currentQuestion.options.some(opt => !opt)) {
      // Set an error message if any field is empty
      setErrorMessage('Please fill in all fields before adding a question.');
      return;// Exit the function to prevent adding incomplete questions
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion(  
      { 
        questionText: '', 
        correctAnswer: '', 
        options: ['', '', ''] 
      }
    );
  };

  // Function to delete a question
  const deleteNewQuestion =(index) => {
    const newQuestions = questions.filter((_, i) => i !== index); 
    setQuestions(newQuestions)
  }

  // Function to handle form submission
  const handleAddNewQuiz = () => {
    if (!quizName || questions.length === 0) {
      setErrorMessage('Please enter a quiz name and add at least one question.');
      return;
    }
    // Call the addNewQuiz function passed as a prop
    addNewQuiz();
  };

  //============JSX RENDERING================
  return (
    <div>
      <Row>
        <Col>
        <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      {/*  */}
      <div id='newQuizForm'>
        <Row>
          <Col xs={6} md={4}>
          {/* QuizForm Input */}
          <div className='addQuizField'>
              <label className='addQuizLabel' htmlFor='addQuizName'>
                <p className='labelText'>QUIZ NAME:</p> 
              </label>
                <input
                  type='text'
                  name='quizName'
                  value={quizName}
                  onChange={(e) =>
                    /* Event handler for the onChange event, 
                    triggered when the input value changes*/
                    setQuizName(e.target.value)
                  }
                  autoComplete='off'
                  placeholder='QUIZ NAME'
                  required
                  className='addQuizInput'
                  id='addQuizName'
                />             
          </div>
          </Col>
          <Col xs={12} md={8}></Col>
        </Row>
        <div id='quizInput'>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            <div className='addQuizField' >              
                <label className='addQuizLabel' id='questionInput'>
                  <p className='labelText'>QUESTION:</p>
                </label>
                {/* Question Input */}
                <input
                  type='text'
                  name='questionText'
                  value={currentQuestion.questionText}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: e.target.value
                    })}
                  autoComplete='off'
                  placeholder='QUESTION'
                  id='questionInput'
                  required
                  className='addQuizInput'
                />
            </div>         
            </Col>
            <Col xs={6} className='quizFormCol'>
            <div className='addQuizField'>
              <label 
              className='addQuizLabel'
              htmlFor='correctAnswer' 
              >
                <p className='labelText'>CORRECT ANSWER:</p>
              </label>
                {/* Input for the correct answer */}
              <input
                  type='text'
                  name='correctAnswer'
                  value={currentQuestion.correctAnswer} 
                  /* Handle the change event to update the state 
                  when the input value changes*/
                onChange={(e) => setCurrentQuestion(
                  {
                    ...currentQuestion, 
                    correctAnswer: e.target.value
                  }
                  )}
                  autoComplete='off'
                  placeholder='CORRECT ANSWER' 
                  required
                  className='addQuizInput'
                  id='correctAnswer'
              />              
            </div>
            </Col>
          </Row>
          {/* Alternative answers */}
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            <div className='addQuizField'>
                {/* First Alternative Answer  */}
             <label 
                className='addQuizLabel'
                htmlFor='optionOne'
            >
              <p className='labelText'>1.ALTERNATIVE ANSWER:</p>
              </label> 
                {/* Input field for the first alternative answer */}
            <input
                  type='text'
                  name='options[0]'
                  value={currentQuestion.options[0]}
                  onChange={(e) => {
                    const options = [
                      ...currentQuestion.options
                    ]
                    options[0] = e.target.value;
                      setCurrentQuestion({
                          ...currentQuestion,
                          options
                        }
                      )}}
                  autoComplete='off'
                  placeholder='ALTENATIVE ANSWER 1'
                  required
                  className='addQuizInput'
                  id='optionOne'
            />
            </div>
            </Col>
            <Col xs={6} className='quizFormCol'>
            <div className='addQuizField'>
                {/* Second Alternative Answer  */}
              <label 
                className='addQuizLabel' 
                htmlFor='option2'
              >
                <p className='labelText'>2.ALTERNATIVE ANSWER: </p>
              </label>              
                {/* Input field for the second alternative answer */}
            <input
                  type='text'
                  value={currentQuestion.options[1]}
            onChange={(e) => {
              const options = [
                ...currentQuestion.options
              ]
              options[1] = e.target.value;
              setCurrentQuestion(
                {
                  ...currentQuestion, 
                  options
                }
              )}}
                  autoComplete='off'
                  placeholder='ALTERNATIVE ANSWER 2'
                  required
                  className='addQuizInput'
                  id='option2'
                />
             </div>
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6}></Col>
            <Col xs={6} className='quizFormCol'>
            <div className='addQuizField'>
            {/* Third Alternative Answer*/}
            <label className='addQuizLabel' htmlFor='option3' >
              <p className='labelText'> 3.ALTERNATIVE ANSWER: </p>
                {/* Input field for the third alternative answer */}
            <input
                  type='text'
                  name='options[2]'
                  value={currentQuestion.options[2]}
            onChange={(e) => {
                const options = [...currentQuestion.options]
                options[2] = e.target.value;
                setCurrentQuestion(
                    {
                      ...currentQuestion, 
                      options 
                    })
                  }}
                  autoComplete='off'
                  placeholder='ALTERNATIVE ANSWER 3'
                  className='addQuizInput'
                  required
                  id='option3'
            />
            </label>
            </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}></Col>
            <Col xs={6} md={4}>
            {/* Button to add a question */}
              <Button 
                type='button' 
                variant="primary" 
                onClick={handleAddQuestion}
              >
                ADD QUESTION
              </Button>
            </Col>
          </Row>
        </div>
        <div id='newQuiz'>
          <Row>
            <Col>
            <h3 className='h3'>QUESTIONS</h3>
            {/* Display an error message if an error occurs */}
              {errorMessage && <div className="error">{errorMessage}</div>}
          </Col>
          {/* New questions output */}
           <div className='newQuizOutput'> 
              <Row>
                <Col md={4} className='quizNameCol'>
                  {/* Heading displaying the quiz name */}
                  <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
                </Col>
                <Col md={8}>
                </Col>
              </Row>             
              {/* Map the questions */}
            {questions.map((q, index) => (
              <div className='questionsOutput' key={index}>
                    <Row className='question'>
                      <Col md={3}>             
                        <p className='questionOutput'>{q.questionText}</p> </Col>
                      <Col md={2}>
                        <p className='answerOutput'>{q.correctAnswer}</p></Col>
                      <Col md={5}> 
                        <p className='options'>{q.options.join(', ')}</p></Col> 
                      <Col md={2}>
                      {/* Button to delete a new Question */}
                          <Button 
                            variant='danger' 
                            type='button'                   
                            onClick={() => 
                            deleteNewQuestion(index)}
                      aria-label={`Delete Question ${index + 1}`}
                          >
                            DELETE QUESTION
                          </Button>
                      </Col>
                    </Row> 
              </div>
            ))}
           </div>
          </Row>
          <Row>
            <Col md={8}></Col>
            {/* Button to add a new quiz */}
            <Col md={4}>
              <Button 
                variant='primary' 
                type='button'  
                onClick={handleAddNewQuiz}
                aria-label='Add Quiz'
              >
                  ADD QUIZ
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
