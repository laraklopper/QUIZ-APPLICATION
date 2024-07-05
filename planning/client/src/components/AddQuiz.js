// Import necessary modules and packages
import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 

//Import AddQuiz function component
export default function AddQuiz () {
  //============STATE VARIABLES=============
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formError, setFormError] = useState('');

  //========EVENTS===========
  // Function to handle changes in input fields
  const handleChange = (e, index, field, optionIndex = null) => {
    const updatedQuestions = [...questions];  // Create a copy of the current questions array
      // Conditional rendering to check if the change is for an option within the options array
    if (optionIndex !== null) {
      updatedQuestions[index][field][optionIndex] = e.target.value;    // Update the specific option in the options array of the given question

    } else {
      updatedQuestions[index][field] = e.target.value;// Update the state with the modified questions array
    }
    setQuestions(updatedQuestions);// Update the state with the modified questions array
  };

// Function to add a new question to the questions array
  //The addQuestion function is used to add a new, empty question to the questions array
const addQuestion = () => {
    if (questions.length >= 5) {
      setFormError('You cannot add more than 5 questions.');
      return;
    }
  const newQuestion = { questionText: '', correctAnswer: '', options: ['', '', ''] };// Create a new question object with default values
  setQuestions([...questions, newQuestion]);  // Create a new array that includes all existing questions and the new question
  setQuestionIndex(questionIndex + 1);  // Increment the question index to reflect the addition of a new question
};


  //=========REQUESTS=================
  const addNewQuiz = async (e) => {
    e.preventDefault();// Prevents the default form submission behavior
    const quiz = { quizName, questions };  // Construct the quiz object from state variables
  // Conditional rendering to check that exactly 5 questions are added before submitting

     if (questions.length !== 5) {
      setFormError('You must add exactly 5 questions.');
      return;// Exit the function
    }
    try {
      const token = localStorage.getItem('token'); // Retrieve the authentication token from local storage
      // Send a POST request to the server endpoint to add the quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json', 
           'Authorization': `Bearer ${token}` // Include the token for authentication
        },
        body: JSON.stringify(quiz)// Convert the quiz object to JSON format for the request body
      });
    // Conditional rendering to check if the server response is successful (HTTP status code 200-299)

      if (response.ok) {
        alert('Quiz added successfully!');// Display success message to the user
          // Reset the form state after successful quiz addition
        setQuizName('');
        setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
        setQuestionIndex(0);// Reset question index to start from the first question
      } else {
        alert('Failed to add quiz');// Display error message if adding quiz fails
      }
    } catch (error) {
      console.error('Error:', error);//Display an error message in the console for debugging purposes
    }
  };

//=============JSX RENDERING=======================
  return (
    <div>
    <Row>
    <Col><h1 className="h1">Add Quiz</h1></Col>
    </Row>
      
      <form onSubmit={addNewQuiz}>
        <div>
          <label>Quiz Name:</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        {questions.map((question, index) => (
          <div key={index}>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
          </Col>
          </Row>
            <h3>Question {index + 1}</h3>
            <div>
              <label>Question Text: </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleChange(e, index, 'questionText')}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className='addQuizLabel' htmlFor="correctAnswer">Correct Answer: </label>
              <input
                type="text"
                value={question.correctAnswer}
                id="correctAnswer"
                onChange={(e) => handleChange(e, index, 'correctAnswer')}
                required
              />
            </div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>Alternative Answer {optionIndex + 1}: </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleChange(e, index, 'options', optionIndex)}
                  required
                />
              </div>
            ))}
          </div>
        ))}{
          formError && (
            <Row>
            <p className='error'>{formError}</p>
            </Row>
          )}
        <Button variant='primary' type="button" onClick={addQuestion}>
          Add Question
        </Button>
        <Button variant='primary' type="submit">Add Quiz</button>
      </form>
    </div>
  );
};

export default AddQuiz;
