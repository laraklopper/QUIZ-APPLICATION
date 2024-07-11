// Import necessary modules and packages
import React from 'react';// Import necessary modules and packages
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 

// AddQuiz function component
export default function AddQuiz(//Export default AddQuiz function component
  {//PROPS PASSED FROM PARENT COMPONENT
  addNewQuiz,
  newQuizName,
  setNewQuizName,
  formError,
  newQuestions,
  setNewQuestions
}) {

  //======EVENT LISTENERS==========
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

  /* Function to handle changes in the question 
  text or correct answer*/
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuestions];// Copy the existing questions
    // Update the specified field of the question at the given index
    updatedQuestions[index][field] = value;
    setNewQuestions(updatedQuestions);// Update the state with the new questions array
  };

  // Function to handle changes in the alternative answers
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...newQuestions];// Copy the existing questions
    // Update the specified field of the question at the given index
    updatedQuestions[qIndex].options[optIndex] = value;
    setNewQuestions(updatedQuestions);// Update the state with the new questions array
  };

  //===============JSX RENDERING=========================
  
  return (
    <div id='addQuiz'>
    {/* Form to add a newQuiz */}
      <form onSubmit={addNewQuiz} id='newQuizForm'>
        <Row className='quizFormRow'>
          <Col xs={12} md={8} className='quizFormCol'>
            <label className='addQuizLabel' htmlFor='quizName'>
              <p className='labelText'>QUIZ NAME:</p>
              <input
                className='quizInput'
                type='text'
                name='quizName'
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                autoComplete='off'
                placeholder='Quiz Name'
                id='quizName'
                required
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
                <label className='addQuizLabel'>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    type='text'
                    className='quizInput'
                    name='questionText'
                    value={question.questionText}// Bind the input value to the question's text
                    onChange={(e) => handleQuestionChange(
                      index, 'questionText', e.target.value)}
                    autoComplete='off'
                    required
                    placeholder='QUESTION'
                  />
                </label>
              </Col>
              <Col xs={12} md={8} className='quizFormCol'>
                <label className='addQuizLabel'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                  <input
                    type='text'
                    className='quizInput'
                    name='correctAnswer'
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(
                      index, 'correctAnswer', e.target.value)}
                    autoComplete='off'
                    required
                    placeholder='CORRECT ANSWER'
                  />
                </label>
              </Col>
              {question.options.map((option, optIndex) => (
                <Col xs={12} md={8} className='quizFormCol' key={optIndex}>
                  <label className='addQuizLabel'>
                    <p className='labelText'>
                        {`${optIndex + 1}) ALTERNATIVE ANSWER:`}
                    </p>
                    <input
                      type='text'
                      className='quizInput'
                      name={`option${optIndex}`}
                      value={option}
                      onChange={(e) => handleOptionChange(
                        index, optIndex, e.target.value)}
                      autoComplete='off'
                      required
                      placeholder={`ALTERNATIVE ANSWER ${optIndex + 1}`}
                    />
                  </label>
                </Col>
              ))}
            </Row>
          ))}
          <Button
            variant='primary'
            type='button'
            onClick={handleAddQuestion}>
                ADD QUESTION
          </Button>
        </div>
        {formError && <p className='error'>
            {formError}
          </p>}
        <Button
          variant='primary'
          type='submit'
          disabled={newQuestions.length !== 5}
        >
          ADD QUIZ
        </Button>
      </form>
    </div>
  );
}
