// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';// Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col';// Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// AddQuiz function component
export default function AddQuiz(//Export default AddQuiz function component
  {//PROPS PASSED FROM PARENT COMPONENT
    addNewQuiz,
    newQuizName,
    setNewQuizName,
    setFormError, 
    formError,
    newQuestions,
    setNewQuestions
  }
) {

  //=========EVENT LISTENERS============
  // Function to add a new question
  const handleAddQuestion = () => {
    // Conditional rendering to check if the number of questions is already 5
    if (newQuestions.length >= 5) {
      // Set an error message if there are already 5 questions
      setFormError('You cannot add more than 5 questions.');
      return;
    }
    // Add a new question with default values
    setNewQuestions([
      ...newQuestions,
      { questionText: '', correctAnswer: '', options: ['', '', ''] }
    ]);
  };

  // Function to handle changes in the question text or correct answer
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuestions]; // Copy the existing questions
    updatedQuestions[index][field] = value; // Update the specified field of the question at the given index
    setNewQuestions(updatedQuestions); // Update the state with the new questions array
  };
  // Function to handle changes in the alternative answers
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...newQuestions];// Copy the existing questions
    // Update the specified field of the question at the given index
    updatedQuestions[qIndex].options[optIndex] = value;
    setNewQuestions(updatedQuestions);// Update the state with the new questions array
  };


  //=========JSX RENDERING====================

  return (
    <div>
      {/* Form to add a new quiz */}
      <form id='addQuizForm' onSubmit={addNewQuiz}>
        <Row className='quizFormRow'>
          <Col xs={12} md={8}>
          {/* Quiz Name Input */}
            <label className='addQuizLabel'>
              <p className='labelText'>QUIZ NAME:</p>
              <input
                className='quizInput'
                type='text'//Specify the input type 
                name='newQuizName'//Specify the name of input element
                value={newQuizName}// Bind the input value to the newQuizName state 
                onChange={(e) => setNewQuizName(e.target.value)}//Update the newQuizName state on input change
                autoComplete='off'//Specify if the browser should predict the value of the input field
                placeholder='QUIZ NAME'
                id='quizName'
                required//Boolean attribute to specify that the input must be filled
              />
            </label>
          </Col>
        </Row>
        <div>
          <Row>
            <Col>
               <h3 className='h3'>ADD QUESTIONS</h3>
            </Col>
          </Row>
          {newQuestions.map((question, index) => (// Iterate over the list of questions
            <Row className='quizFormRow' key={index}>
              <Col xs={12} md={8} className='quizFormCol'>
              {/* Question Input */}
              <label className='addQuizLabel'>
                <p className='labelText'>QUESTION:</p>
                <input
                className='quizInput'
                    type='text'//Specify the input type 
                    name='questionText'//Specify the name of input element
                    value={question.questionText}// Bind the input value to the question's text
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}// Update the question text on input change
                    autoComplete='off'//Specify if the browser should predict the value of the input field
                    required//Boolean attribute to specify that the input must be filled
                    id='newQuestion'
                    placeholder='QUESTION'
                />
              </label>
              </Col>
              <Col xs={12} md={8} className='quizFormCol'>
              <label className='addQuizlabel'>
                {/* Correct Answer input */}
                <p className='labelText'>CORRECT ANSWER:</p>
                <input
                    className='quizInput'
                    type='text'//Specify the input type
                    name='correctAnswer'//Specify the name of input element
                    value={question.correctAnswer}// Bind the input value to the question's correct answer
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}// Update the correct answer on input change
                    autoComplete='off'//Specify if the browser should predict the value of the input field
                    required//Boolean attribute to specify that the input must be filled
                    id='correctAnswer'
                    placeholder='CORRECT ANSWER'
                />
              </label>
              </Col>
              {question.option.map((option, optIndex) => (// Iterate over the list of alternative answers
                <Col xs={12} md={8} className='quizFormCol' key={optIndex}>
                  <label className='addQuizLabel'>
                    <p className='labelText'>{`${optIndex + 1}) ALTERNATIVE ANSWER:`}</p>
                    <input
                      className='quizInput'
                      type='text'//Specify the input type
                      name={`option${optIndex}`}//Specify the name of input element
                      value={option}// Bind the input value to the specific alternative answer
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}// Update the alternative answer on input change
                      autoComplete='off'//Specify if the browser should predict the value of the input field
                      required//Boolean attribute to specify that the input must be filled
                      placeholder={`ALTERNATIVE ASNSWER ${optIndex + 1}`} 
                    />
                  </label>
                </Col>
              ))}             
            </Row>
          ))}
          {/* Button to add a new quiz */}
          <Button 
            variant='primary' //Bootstrap variant
            type='button' //Specify the button type 
            onClick={handleAddQuestion}// Add a new question on button click
          >
            ADD QUESTION
            </Button>
        </div>
        {formError && <p className='error'>{formError}</p>}{/* Display form error message */}
        {/* Button to add a new Quiz */}
        <Button 
          variant='primary' //Bootstrap variant
           type='submit' //Specify the button type
          disabled={newQuestions !== 5}// Disable the button if there are not exactly 5 questions
        >
          ADD QUIZ
          </Button>
      </form>
    </div>
  )
}
