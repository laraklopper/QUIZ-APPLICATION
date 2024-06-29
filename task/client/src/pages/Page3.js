// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';//Import CSS stylesheet
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; 
// Components
import Header from '../components/Header';//Import the Header function component
import LogoutBtn from '../components/LogoutBtn';//Import LogoutBtn function component
import AddQuiz from '../components/AddQuiz';//Import AddQuiz function component
import EditQuiz from '../components/EditQuiz';//Import EditQuiz function component

// Page3 function component
export default function Page3(//Export default Page3 function component
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList,
  setQuizList,
  setError,
  fetchQuizzes
}) {

  // ========STATE VARIABLES===============
  const [quizName, setQuizName] = useState('');//Stores the name of the new quiz
  const [questions, setQuestions] = useState([//State used to store an array of question objects, each containing questionText, correctAnswer, and options.
    { questionText: '', correctAnswer: '', options: ['', '', ''] }
  ]);
  //Update quiz variables
  const [updateQuiz, setUpdateQuiz] = useState(null); //State used to store the ID of the quiz being updated 
  const [newQuizName, setNewQuizName] = useState('');
  const [newQuestion, setNewquestion] = useState([
    { newQuestionText: '', newCorrectAnswer: '', newOptions: ['', '', ''] }
  ]);
  const [formError, setFormError] = useState('');//State used to store any error messages related to the form.

//========================================================
  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes()//call the fetchQuizzes function
  },[fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {//Define an async function to add a new quiz
    event.preventDefault();//Prevent default form submission
    if (questions.length !== 5) {
      setFormError('You must add exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');//Retrieve the token from local storage
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`// Pass the JWT token in Authorization header
        },
        body: JSON.stringify({ quizName, questions })
      });

      //Response handling
      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('There was an error creating the quiz');//Throw an error message if the POST request is unsuccessful
      }

      const quiz = await response.json();//Parse the data as JSON
      //Reset the Form fields
      setQuizList([...quizList, quiz]);// Update the quiz list state with the new quiz
      setQuizName('');//Reset the quizName
      setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);//Reset the questions
      setFormError('');// Clear any existing error messages
      console.log('Quiz created:', quiz);// Log the created quiz to the console for debugging purposes

    } catch (error) {
      console.error('There was an error creating the quiz:', error);
      setError('There was an error creating the quiz:', error);
    }
  };

  // ---------------PUT-----------------------
  //Function to update a quiz
  const editQuiz = async (quizId) => {
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      //Send a PUT request to the server
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quizName: newQuizName, questions: newQuestion })
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setQuizName('');
        setUpdateQuiz(null);
      } 
      else {
        throw new Error('Error editing quiz');
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);
      setError(`Error editing the quiz: ${error}`)
    }
  }

//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = async (quizId) => {//Define an async function to delete a quiz
    try {
      const token = localStorage.getItem('token');
      //Send a delete request to server
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        setQuizList(quizList.filter(q => q._id !== quizId));
      } else {
        throw new Error('Error deleting quiz');
      }
    } catch (error) {
      setError('Error deleting quiz:', error);
      console.error('Error deleting quiz:', error);
    }
  }
 
  // ===========EVENTS==============
  // Function to handle changes in the quiz questions
  const handleChange = (index, event) => {
    const values = [...questions]; 


    if (event.target.name === "questionText" || event.target.name === "correctAnswer") {
      values[index][event.target.name] = event.target.value;
    } else {
      const optionIndex = Number(event.target.name.split('.')[1]);
      values[index].options[optionIndex] = event.target.value;
    }
    setQuestions(values);
  };

  //Function to add a new question
  const handleAddQuestion = () => {
    
    if (questions.length >= 5) {
      setFormError('You cannot add more than 5 questions.');
      return;
    }
    setQuestions(
      [...questions, 
        { questionText: '', correctAnswer: '', options: ['', '', ''] }
      ]);
  };

  // Function to move to the next question
  const nextQuestion = () => {
    const lastQuestion = questions[questions.length - 1]; 
    if (!lastQuestion.questionText || !lastQuestion.correctAnswer || lastQuestion.options.some(option => !option)) {
      setFormError('Please fill out all fields of the current question before moving to the next one.');
      return;
    }
    if (questions.length >= 5) {
      setFormError('You cannot add more than 5 questions.');
      return;
    }
    // Add a new question template to the questions array
    setQuestions([...questions, 
      { questionText: '', correctAnswer: '', options: ['', '', ''] }
    ]);
    setFormError('');  

  }

  //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdateQuiz(quizId === updateQuiz ? null : quizId);
  };


  //==============JSX RENDERING=================
  return (
    <>
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1 */}
      <section className='section1'>
        <Row className='quizRow'>
          <Col>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
        {/* QUIZ Output */}
        <div>
          {/* Display the list of quizes*/}
          {quizList.map((quiz) => (
            <div key = {quiz._id}>
            <Row  className='quizListRow'>
              <Col className='quizRow'><p>Quiz Name: {quiz.quizName}</p></Col>
              {/* Toggle button to update QUIZ */}
              <Col> <Button variant='primary' type='button' onClick={() => toggleQuizUpdate(quiz._id)}>
                {updateQuiz === quizName._id ? 'EXIT': 'EDIT'}
                </Button></Col>
            {updateQuiz === quizName._id && (
                <EditQuiz 
                quiz={quiz} 
                setQuizList={setQuizList} 
                quizList={quizList} 
                setUpdateQuiz={setUpdateQuiz} 
                setError={setError}
                newQuizName={newQuizName}
                setNewQuizName={setNewQuizName}      
                editQuiz={editQuiz}     
                setNewQuestion={setNewquestion}    
                />
            )}
              <Col><button onClick={() => deleteQuiz(quiz._id)}>DELETE</button></Col> 
              </Row>
            </div>
          ))}
        </div>
      </section>
      {/* Section 2 */}
      <section id='page3Section2'>
        {/* Form to Add Quiz */}
        <AddQuiz
        addNewQuiz={addNewQuiz}
        setQuizName={setQuizName}
        quizList={quizList}
        quizName={quizName}
        handleAddQuestion={handleAddQuestion}
        formError={formError}
        handleChange={handleChange}
        questions={questions}
        nextQuestion={nextQuestion}
        />
      </section>
      {/* footer */}
      <footer className='pageFooter'>
        <Row>
          <Col xs={12} md={8}></Col>
          {/* Logout Button */}
          <LogoutBtn />
        </Row>
      </footer>
    </>
  );
}
