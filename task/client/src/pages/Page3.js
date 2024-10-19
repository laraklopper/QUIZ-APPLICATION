// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';//Import CSS stylesheet for Page3.js
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
// Components
import Header from '../components/Header';//Import the Header function component
import AddQuiz from '../components/AddQuiz';//Import the AddQuiz function component
import Footer from '../components/Footer';//Import the Footer function component
import EditQuiz from '../components/EditQuiz';//Import the EditQuiz function component

// Page3 function component
export default function Page3(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList, 
  setQuizList, 
  setError, 
  fetchQuizzes, 
  logout, 
  quizName,
  setQuizName,
  currentQuestion,
  setCurrentQuestion,
  questions,
  setQuestions  
}
) {
  
  // ========STATE VARIABLES===============
  //Variables for creating a new quiz
  /*const [newQuizData, setNewQuizData] = useState({//State to store data for a NewQuiz
    newquestion: '',
    correctAnswer: '',
    options: ['','','']
  })*/
  //Edit quiz variables
  const [newQuizName, setNewQuizName] = useState('');  // State to store new quiz name
  const [update, setUpdate] = useState(false);  // Toggle between edit mode and normal mode
  const [newQuestions, setNewQuestions] = useState([]) // State to store new questions when editing a quiz
  const [quizToUpdate, setQuizToUpdate] = useState(null);// State to store the quiz ID of the quiz being updated  
  const [editQuizIndex, setEditQuizIndex] = useState( //State to store the quizId of the quiz being updated
    { editQuestionText: '', 
      editCorrectAnswer: '', 
      editOptions: ['', '', ''] });
  const [formError, setFormError] = useState(null);// Form error for validation

  
  
  //====================USE EFFECT HOOK===================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes()//Call the fetch quizzes function
  }, [fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
 //Function to add a new quiz
  const addNewQuiz = useCallback(async () => {
    //Conditional rendering to check that the quiz has exacly 5 questions
    if (questions.length !== 5) {     
      console.log('You must add exactly 5 questions.');//Log an message in the console for debugging purposes
      return;// Exit the function to prevent further execution
    }
    // Create a quiz object to send to the server
    const quiz = {
      name: quizName,// Quiz name entered by the user
      username: currentUser.username,//Username of the user creating the quiz
      questions ,// The array of questions
    }
    try {      
      // Retrieve the authentication token from localStorage
      const token = localStorage.getItem('token');
      console.log(quiz)
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors', // Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the content-type 
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify(quiz) // Convert the quiz object to a JSON string before sending
      });
  
      // Handle the response from the server
      if (response.ok) {
        const newQuiz = await response.json(); // Parse the new quiz object 
        // Update the quizList
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);
        // Reset the quiz name and questions after successful quiz creation
        setQuestions(['']);
        setQuizName('');     

      } 
    } 
    catch (error) {
      //Error handling
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz');// Set the Error State with an error message
    }
  },[currentUser,questions,quizName,setError,setQuestions, setQuizList,setQuizName]);

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {//Define an async function to edit a quiz

    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from local storage
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Enable Cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify(
          {
          name: newQuizName, // The new quiz name provided by the user
             username: currentUser.username,      
          questions: newQuestions,// Send the updated questions
            })
      });

      //Response handling
      if (response.ok) {
        // Parse the updated quiz data from the response
        const data = await response.json();
        const updatedQuiz = data.editedQuiz

        // Update the quiz list with the modified quiz data
        setQuizList(quizList.map(q => 
          (q._id === updatedQuiz._id ? 
            updatedQuiz : q)));
        // Reset the edit form by clearing the state variables
        // setEditQuizIndex([{ editQuestionText: '',   editCorrectAnswer: '', editOptions: ['', '', '']  }]);
        setQuizToUpdate(null);  // Reset the quiz being updated
        setNewQuizName('');     // Clear the new quiz name input
        setNewQuestions([]);    // Clear the new questions array
        setFormError('');
        setError('')
      } 
      else {
        const errorData = await response.json();
        setError(errorData.message || 'Error editing quiz'); 
      }
    } 
    catch (error) {
      console.error(`Error editing the quiz: ${error}`);//Log an error message in the console for debugging purposes
      setError(`Error editing the quiz: ${error}`);//Set the Error State with an error message
      
    }
  }
//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = async (quizId) => {//Define an async function to delete a quiz
    try {
      const token = localStorage.getItem('token');// Retrieve token from localStorage
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',//Enable Cross-Origin resource sharing mode
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        }
      });
      //Response handling
      if (response.ok) {
        // If the request is successful, remove the quiz from the quizList
        setQuizList(quizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');//Throw an error message if the DELETE request is unsuccessful
      }
    } 
    catch (error) {
      setError(`Error deleting quiz: ${error}`);//Log an error message in the console for debugging purposes
      console.error(`Error deleting quiz: ${error}`);// Set the error state to display the error in the UI
    }
  }
 
  // ===========EVENT LISTENERS==============  
  // Function to toggle the quiz edit form visibility
  const toggleQuizUpdate = useCallback((quizId) => {
    // if (quizToUpdate === quizId) {
    //   setQuizToUpdate(null)      
    // } else {
    //   setQuizToUpdate(quizId)
    // }
    setUpdate((prevUpdate) => !prevUpdate);// Toggle the 'update' state between true and false
    // Set the 'quizToUpdate' state to the selected quiz's ID for editing
    setQuizToUpdate(quizId);
  }, []);

  //==============JSX RENDERING=================
  return (
    <>
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1: List of quizzes */}
      <section className='page3Section1'>
        <Row className='quizRow'>
          <Col id='outputHeading'>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
        {/* List of quizzes */}
        <div id='quizOutput'>
          {quizList.map((quiz) => (//Iterate over the quizList
            <div className='quizItem' key = {quiz._id}>
              <Row className='quizListRow'>
                <Col className='quizCol' md={3}>
                {/* Quiz Name */}
                   <p className='itemText'>QUIZ NAME: {quiz.name}</p>
                </Col>
                <Col md={3}>
                {/* username of the user who created the quiz */}
                    <p className='quizUsername' hidden>USERNAME: {quiz.username}</p> 
                </Col>
                <Col  md={3} className='buttonCol'> 
                  <div>
                    {/* Button to delete the Quiz */}
                    <Button variant='primary' onClick={() => deleteQuiz(quiz._id)}>
                      DELETE QUIZ
                    </Button>
                  </div>
                </Col>
                  <Col md={3}>
                <div>
                  {/* Toggle button to edit a quiz */}
                <Button 
                  variant='primary' 
                  type='button' 
                  onClick={() => toggleQuizUpdate(quiz._id)}>
                    {update  && quizToUpdate === quiz._id ? 'EXIT': 'EDIT QUIZ' }
                </Button>
                  </div>
                   </Col> 
              </Row>
                  <div>
                     {update && quizToUpdate === quiz._id && (
                      // EditQuiz function component
                      <EditQuiz
                      setError={setError}
                      quizList={quizList}
                      setQuizList={setQuizList}
                      newQuizName={newQuizName}
                      setNewQuizName={setNewQuizName}
                      editQuiz={editQuiz}
                      setNewQuestions={setNewQuestions}
                      quiz={quiz}
                      editQuizIndex={editQuizIndex}
                      setEditQuizIndex={setEditQuizIndex}
                      newQuestions={newQuestions}
                      quizName={quizName}
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}
                    />              
            )} 
            </div>             
            </div>
          ))}
        </div>
      </section> 
      {/* Section 2: Form to Add Quiz  */}
      <section id='page3Section2'>
        {/* Form to Add Quiz */}
        <AddQuiz
          addNewQuiz={addNewQuiz}               
          questions={questions}
          setQuestions={setQuestions}
          formError={formError}
          setFormError={setFormError}
          quizName={quizName}
          setQuizName={setQuizName}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
