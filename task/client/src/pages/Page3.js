import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';//Import CSS stylesheet
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
// Components
import Header from '../components/Header';//Import the Header function component
import LogoutBtn from '../components/LogoutBtn';//Import LogoutBtn function component
import AddQuiz from '../components/AddQuiz';//Import AddQuiz function component

// Page3 function component
export default function Page3(//Export default Page3 function component
  {//PROPS PASSED FROM PARENT COMPONENT 
  quizList,
  setQuizList,
  setError,
  fetchQuizzes
}) {
  // ========STATE VARIABLES===============
  //NewQuizVariables
  const [quizName, setQuizName] = useState('');//Stores the name of the new quiz
  const [questions, setQuestions] = useState([//State used to store an array of question objects, each containing questionText, correctAnswer, and options.
    { questionText: '', correctAnswer: '', options: ['', '', ''] }
  ]);
  //Update quiz variables
  const [updateQuiz, setUpdateQuiz] = useState(null);//State used to store the ID of the quiz being updated  
  const [newQuizName, setNewQuizName] = useState('');
  const [newQuestion, setNewquestion] = useState([
    { newQuestionText: '', newCorrectAnswer: '', newOptions: ['', '', ''] }
  ]);
  const [formError, setFormError] = useState('');//State used to store any error messages related to the form.

  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes()//call the fetchQuizzes function
  })
  
  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {//Define an async function to add a new quiz
    event.preventDefault();//Prevent default form submission
    if (questions.length !== 5) {
      setFormError('You must add exactly 5 questions.');// Set an error message if the condition is not met
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
        body: JSON.stringify({ quizName, questions })// Convert the quiz data to a JSON string
      });

      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (!response.ok) {
        throw new Error('There was an error creating the quiz');//Throw an error message if the POST request is unsuccessful
      }

      const quiz = await response.json();//Parse the data as JSON
      //Reset the Form fields
      setQuizList([...quizList, quiz]);// Update the quiz list state with the new quiz
      setQuizName('');// Reset the quiz name
      setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);// Reset the questions
      setFormError('');// Clear any existing error messages
      console.log('Quiz created:', quiz);// Log the created quiz to the console for debugging purposes

    } catch (error) {
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz:', error);// Set the error state with error message
    }
  };

  // ---------------PUT-----------------------
  //Function to update a quiz
  const editQuiz = async (e) => {//Define an async function to edit a quiz
    e.preventDefault();//prevent default form submission behaviour
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quiz._id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quizName, questions })
      });

      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setQuizName('');
        setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);
        setUpdateQuiz(null);
        setFormError('');
      } else {
        throw new Error('Error editing quiz');
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);
    }
  }

  // ----------DELETE------------------
  // const deleteQuiz = async (id) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': token,
  //       }
  //     });
  //     if (response.ok) {
  //       setQuizList(quizList.filter(q => q._id !== id));
  //     } else {
  //       throw new Error('Error deleting quiz');
  //     }
  //   } catch (error) {
  //     setError('Error deleting quiz:', error);
  //     console.error('Error deleting quiz:', error);
  //   }
  // }

  // ===========EVENTS==============
  const handleChange = (index, event) => {
    const values = [...questions]; // Create a copy of the questions array

    // Conditional rendering if the changed input is for questionText or correctAnswer
    if (event.target.name === "questionText" || event.target.name === "correctAnswer") {
      values[index][event.target.name] = event.target.value;
    } else {
      // Extract the option index from the event target name
      const optionIndex = Number(event.target.name.split('.')[1]);
      // Update the option value for the specific question index and optionIndex
      values[index].options[optionIndex] = event.target.value;
    }
    // Update the questions state with the modified values
    setQuestions(values);
  };

  //Function to add a new question
  const handleAddQuestion = () => {
    // Conditional rendering to check if the number of questions has reached the maximum limit (5)
    if (questions.length >= 5) {
      setFormError('You cannot add more than 5 questions.');// Set an error message if the limit is reached
      return;
    }
    // Add a new empty question template to the questions array
    setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', ''] }]);
  };

  // Function to move to the next question
  const nextQuestion = () => {
    const lastQuestion = questions[questions.length - 1];  // Get the last question in the questions array
    if (!lastQuestion.questionText || !lastQuestion.correctAnswer || lastQuestion.options.some(option => !option)) {
      // Set an error message if any field is missing
      setFormError('Please fill out all fields of the current question before moving to the next one.');
      return;
    }
    //Conditional rendering to check if there are already 5 questions
    if (questions.length >= 5) {
      // Set an error message if there are already 5 questions
      setFormError('You cannot add more than 5 questions.');
      return;
    }
    // Add a new question template to the questions array
    setQuestions([...questions, 
      { questionText: '', correctAnswer: '', options: ['', '', ''] }
    ]);
    setFormError('');  // Clear any form error

  }

  //Function to toggle editForm
  const quizEdit = (quizId) => {
    setUpdateQuiz(quizId === updateQuiz ? null : quizId)
  }
  
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
          <div key={quiz._id} id="quizList">
           <Row className='quizListRow'>
              <Col className='quizRow'><p className="outputText">Quiz Name: {quiz.quizName}</p></Col>
          {/* Toggle button to update QUIZ */}
             <Col> 
                <Button variant='primary' onClick={() => setUpdateQuiz(quiz._id)}>
                          {updateQuiz === quiz._id ? 'EXIT': 'EDIT'}
                </Button>
              </Col>
          {/* Toggle button to update QUIZ */}

               {/* <Col><button onClick={() => deleteQuiz(quiz._id)}>DELETE</button></Col> */}
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
