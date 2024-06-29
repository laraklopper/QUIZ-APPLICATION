// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button';//Import Bootstrap Button component

//EditQuizFunction
export default function EditQuiz(//Export the default EditQuiz function component
  { //PROPS PASSED FROM PARENT COMPONENT
    quiz,
    newQuizName,
    editQuiz,
    setNewQuestion,
    setNewQuizName,
    newQuestion
  }
) {

  //==================EVENT LISTENERS===========================

  //Function to change question details
const handleQuestionChange = (index, event) => {
  // Create a copy of the newQuestion state array
  const values = [...newQuestion];

  /*Conditional rendering to determine
  which input field triggered the change based on its name attribute*/
  if (event.target.name === 'newQuestionText' || event.target.name === 'newCorrectAnswer') {
    // If the changed field is either newQuestionText or newCorrectAnswer,
    // update the corresponding property in the current question object (at index)
    values[index][event.target.name] = event.target.value;
  } else {
    // If the changed field is an option (identified by name like "options.0", "options.1", etc.),
    // extract the option index from the name and update the options array of the current question object
    const optionIndex = Number(event.target.name.split('.')[1]);
    values[index].options[optionIndex] = event.target.value;
  }

  // Update the state with the modified values array
  setNewQuestion(values);
};

  // Function to add a new updated question
 const handleAddNewQuestion = () => {
  /* Conditional rendering to checks if the current number of questions 
   (newQuestion.length) has reached 5 or more*/
  if (newQuestion.length >= 5) {
    /*If true, display an alert informing the user that they cannot add 
    more than 5 questions and exit the function using return.*/
    alert('You cannot add more than 5 questions.');
    return;
  }

  // If the length of newQuestion array is less than 5, proceed to add a new question
  // Create a new question object with empty fields
  const newQuestionObject = {
    newQuestionText: '',       // Empty string for new question text
    newCorrectAnswer: '',      // Empty string for new correct answer
    options: ['', '', '', '']  // Array with 4 empty strings for options
  };

  // Update the state by appending the new question object to the existing newQuestion array
  setNewQuestion([
    ...newQuestion,           // Spread operator to retain existing questions
    newQuestionObject        // Add the new question object at the end
  ]);
};

  // Function to move to the next question

 const handleNewNextQuestion = () => {
  // Retrieve the last question object in the newQuestion array
  const lastQuestion = newQuestion[newQuestion.length - 1];

  // Conditional rendering to check if any of the fields of the current question are notfilled
   /*
   !lastQuestion.newQuestionText: Ensures the question text is not empty.
  !lastQuestion.newCorrectAnswer: Ensures the correct answer is not empty.
  lastQuestion.options.some(option => !option): Checks if any of the options 
  in the options array is empty.
   */
  if (!lastQuestion.newQuestionText || !lastQuestion.newCorrectAnswer || lastQuestion.options.some(option => !option)) {
   /* If any of these conditions are true, it display an alert asking the user to fill out all fields 
   before proceeding to the next question and exits the function using return.*/
    alert('Please fill out all fields of the current question before moving to the next one.');
    return;
  }

  // Conditional rendering to check if the current number of questions (newQuestion.length) is already 5 or more
  if (newQuestion.length >= 5) {
     /*If true, display an alert informing the user that they cannot add 
    more than 5 questions and exit the function using return.*/
    alert('You cannot add more than 5 questions.');
    return;
  }

  // If validation passes and not exceeding question limit, add a new question object
  setNewQuestion([
    ...newQuestion,
    { newQuestionText: '', newCorrectAnswer: '', options: ['', '', '', ''] }
  ]);
};

  //==========JSX RENDERING===========================

   return (
    <div>
      <Row className='formRow'>
        <Col>
          <form onSubmit={(event) => { event.preventDefault(); editQuiz(quiz._id); }}>
            <label>
              <p className='labelText'>NEW QUIZ NAME:</p>
              <input 
                type='text'
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
              />
            </label>
            {newQuestion.map((question, index) => (
              <div key={index}>
                <label>
                  <p>NEW QUESTION TEXT:</p>
                  <input
                    type="text"
                    name="newQuestionText"
                    value={question.newQuestionText}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                <label>
                  <p>NEW CORRECT ANSWER:</p>
                  <input
                    type="text"
                    name="newCorrectAnswer"
                    value={question.newCorrectAnswer}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <p>New Option {optionIndex + 1}:</p>
                    <input
                      type="text"
                      name={`options.${optionIndex}`}
                      value={option}
                      onChange={(event) => handleQuestionChange(index, event)}
                    />
                  </label>
                ))}
              </div>
            ))}
            <Button type="button" onClick={handleAddNewQuestion}>EDIT Question</Button>
            <Button type="button" onClick={handleNewNextQuestion}>Next Question</Button>
            <Button type="submit">Save Changes</Button>
          </form>
        </Col>
      </Row>
    </div>
  );
}
