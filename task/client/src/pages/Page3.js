import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button';
// Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';

// Page3 function component
export default function Page3({
  quizList, 
  setQuizList, 
  setError
}) {
  // ========STATE VARIABLES===============
 const [quizName, setQuizName] = useState('');//Stores the name of the new quiz
  const [questions, setQuestions] = useState([//State used to store an array of question objects, each containing questionText, correctAnswer, and options.
    { questionText: '', correctAnswer: '', options: ['', '', ''] }
  ]);
    const [formError, setFormError] = useState('');//State used to store any error messages related to the form.
    const [updateQuiz, setUpdateQuiz] = useState(null);//State used to store the ID of the quiz being updated
 
  // ==============REQUESTS=======================
  // ----------POST-------------------
    // Function to add a new quiz
  const addNewQuiz = async (event) => {
    event.preventDefault();// Prevent the default form submission behavior
    //Conditional rendering to check if exactly 5 questions are added//
    if (questions.length !== 5) {
      setFormError('You must add exactly 5 questions.');// Set an error message if the condition is not met
      return;
    }
    try {
      const token = localStorage.getItem('token');//Retrieve the token from local storage
          // Send a POST request to add a new quiz
      const response = await fetch('http://localhost:3001/users/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quizName, questions })// Convert the quiz data to a JSON string
      });
      
      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');//Throw an error message if the POST request is unsuccessful
      }
      const quiz = await response.json();//Parse the data as JSON
      setQuizList([...quizList, quiz]); // Update the quiz list state with the new quiz
      
      // Reset the form fields
      setQuizName('');// Reset the quiz name
      setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);// Reset the questions
      setFormError('');// Clear any existing error messages
      console.log('Quiz created:', quiz);// Log the created quiz to the console for debugging purposes

    } catch (error) {
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz:', error); // Set the error state with error message
    }    
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (e) => {
    e.preventDefault();
     // Conditional rendering to check that exactly 5 questions are provided
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');//Retrieve the token from local storage
      // Send a PUT request to edit the quiz with the specified ID
      const response = await fetch(`http://localhost:3001/users/editQuiz/${updateQuiz}`, {
        method: 'PUT',//HTTP request method
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload
          'Authorization': token,// Pass the JWT token in Authorization header
        },
        body: JSON.stringify({ quizName, questions })
      });

      if (response.ok) {
        const updatedQuiz = await response.json();
        // Update the quiz list state, replacing the existing quiz with the updated one
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setQuizName('');
        setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);
        setUpdateQuiz(null);
        setFormError('');
      } else {
        throw new Error('Error editing quiz');
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);//Log an error message in the console for debugging purposes
    }
  }

  // ----------DELETE------------------
  //Function to delete a quiz 
  const deleteQuiz = async (id) => {//Define an async function  to delete/remove a quiz
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/users/deleteQuiz/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });
      if (response.ok) {
        setQuizList(quizList.filter(q => q._id !== id));
      } else {
        throw new Error('Error deleting quiz');
      }
    } catch (error) {
      setError('Error deleting quiz:', error);
      console.error('Error deleting quiz:', error);
    }
  }

  // ===========EVENTS==============
 const handleChange = (index, event) => {
  // Make a copy of the current state 'questions' array
  const values = [...questions];

  // Conditional rendering if the changed input field is 'questionText' or 'correctAnswer'
  if (event.target.name === "questionText" || event.target.name === "correctAnswer") {
    // If so, update the corresponding field in the 'values' array
    values[index][event.target.name] = event.target.value;
  } else {
    // If not, extract the option index from the input field name
    const optionIndex = Number(event.target.name.split('.')[1]);
    // Update the corresponding option in the 'values' array
    values[index].options[optionIndex] = event.target.value;
  }

  // Set the state 'questions' to the updated 'values' array
  setQuestions(values);
};

  const handleAddQuestion = () => {
    if (questions.length >= 5) {
      setFormError('You cannot add more than 5 questions.');
      return;
    }
    setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', ''] }]);
  };

  //==============JSX RENDERING=================
  return (
    <>
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1 */}
      <section>
        <Row>
          <Col>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
        {/* QUIZ Output */}
        <div>
          {/* Display the list of quizes*/}
          {quizList.map((quiz) => (
            <Row key={quiz._id}>
              <Col><p>Quiz Name: {quiz.quizName}</p></Col>
              <Col> <button onClick={() => setUpdateQuiz(quiz._id)}>EDIT</button></Col>
              <Col><button onClick={() => deleteQuiz(quiz._id)}>DELETE</button></Col>
            </Row>
          ))}
        </div>
      </section>
      <section id='page3Section2'>
        <div>
          <Row>
            <h2 className='h2'>ADD QUIZ</h2>
          </Row>
          {/* Form to add newQuiz */}
          <form onSubmit={addNewQuiz} id='newQuizForm'>
            <Row className='quizFormRow'>
              <Col xs={6} className='quizFormCol'>
                <label className='addQuizLabel'>
                  <p className='labelText'>QUIZ NAME:</p>
                  <input
                    className='quizInput'
                    type='text'
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    autoComplete='off'
                    required
                  />
                </label>
              </Col>
            </Row>
            {/* Card to add a new question */}
            {questions.map((question, index) => (
              <div key={index}>
                <Row className='quizFormRow'>
                  <Col xs={6}>
                    <label className='addQuizLabel'>
                      <p className='labelText'>QUESTION:</p>
                      <input
                        className='quizInput'
                        type='text'
                        name='questionText'
                        value={question.questionText}
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                    </label>
                  </Col>
                  <Col xs={6} className='quizFormRow'>
                    <label className='addQuizLabel'>
                      <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                      <input
                        className='quizInput'
                        type='text'
                        name='options.0'
                        value={question.options[0]}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </label>
                  </Col>
                </Row>
                <Row className='quizFormRow'>
                  <Col xs={6}>
                    <label className='addQuizLabel'>
                      <p className='labelText'>CORRECT ANSWER:</p>
                      <input
                        className='quizInput'
                        type='text'
                        name='correctAnswer'
                        value={question.correctAnswer}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </label>
                  </Col>
                  <Col xs={6}>
                    <label className='addQuizLabel'>
                      <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                      <input
                        className='quizInput'
                        type='text'
                        name='options.1'
                        value={question.options[1]}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </label>
                  </Col>
                </Row>
                <Row className='quizFormRow'>
                  <Col xs={6}></Col>
                  <Col xs={6}>
                    <label className='addQuizLabel'>
                      <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                      <input
                        className='quizInput'
                        type='text'
                        name='options.2'
                        value={question.options[2]}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </label>
                  </Col>
                </Row>
              </div>
            ))}
            {formError && (
              <Row>
                <Col>
                  <p className='error'>{formError}</p>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12} md={8}></Col>
              <Col xs={6} md={4}>
                <Button variant='primary' type="button" onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={8}>
                <ul id='quizQuestionLabel'>
                  <li>
                    <p>TOTAL OF 5 QUESTIONS ARE REQUIRED</p>
                  </li>
                  <li>
                    <p>QUIZ NAME MUST BE RELATED TO QUESTION TYPES</p>
                  </li>
                </ul>
              </Col>
              <Col xs={6} md={4}>
                <Button variant="primary" type="submit">
                  ADD QUIZ
                </Button>
              </Col>
            </Row>          
          </form>
        </div>
      </section>
      {/* footer */}
      <footer className='footer'>
        <Row>
          <Col xs={12} md={8}></Col>
          <LogoutBtn />
        </Row>    
      </footer>
    </>
  );
}
