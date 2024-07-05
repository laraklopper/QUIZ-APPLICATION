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
  //=========STATE VARIABLES
  // State variables for managing quiz creation and editing
const [quizName, setQuizName] = useState('');//State used to store the name of the new quiz
  const [questions, setQuestions] = useState([//State used to store an array of question objects, each containing questionText, correctAnswer, and options.
    { questionText: '', correctAnswer: '', options: ['', '', ''] }
  ]);
  const [update, setUpdate] = useState(false);// State used to flag the toggle quiz update mode
  const [quizToUpdate, setQuizToUpdate] = useState(null);//State used to store the ID of the quiz being updated 
  const [newQuizName, setNewQuizName] = useState('');//State used to store the new updated name of a quiz being edited
  const [newQuestion, setNewQuestion] = useState([// Array of new questions when editing a quiz
    { newQuestionText: '', newCorrectAnswer: '', newOptions: ['', '', ''] }
  ]);
  const [formError, setFormError] = useState('');//State used to store any error messages related to the form.
  
//========================================================
  /* useEffect to fetch quizzes when the component mounts 
  or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes()//call the fetchQuizzes function
  },[fetchQuizzes]) // Dependency array ensures fetchQuizzes is called only when it changes
/*[fetchQuizzes] ensures that fetchQuizzes is re-invoked whenever its reference changes, 
which is typical when it's passed as a prop and could change due to parent component re-renders or updates.*/

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {//Define an async function to add a new quiz
    event.preventDefault();//Prevent default form submission
    //Conditional rendering to check that the quiz contains exactly 5 questions
    if (questions.length !== 5) {
      setFormError('You must add exactly 5 questions.'); // Set form error if validation fails
      return;// Exit the function
    }
      // If the validation passes, proceed with adding the quiz
    try {
      const token = localStorage.getItem('token');//Retrieve the authentication token from local storage
      /*Retrieves the authentication token from local storage for use in the request header*/
      //Send a POST request to the server
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`// Set authorization header with the JWT token
        },
        body: JSON.stringify(// Convert the quizName and questions state to a JSON string for the request body
          {
            quizName: newQuizName, // The new name for the quiz
            questions: newQuestion // The updated list of questions for the quiz
          }
        )
      });

      //Response handling
      // Condtitional rendering to check if if the response indicates success (status code 200-299)
      if (!response.ok) {
        const quiz = await response.json();// Parse the JSON response to get the created quiz
         setQuizList([...quizList, quiz]);// Update the quiz list state with the new quiz
         //Reset the Form fields
      setQuizName('');//Reset the quizName
      setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);//Reset the questions
      setFormError('');// Clear any existing error messages
      console.log('Quiz created:', quiz);// Log the created quiz to the console for debugging purposes
      }
      else{
        throw new Error('There was an error creating the quiz');//Throw an error message if the POST request is unsuccessful
      }

    } catch (error) {
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz:', error);//Set the error state with an error message
    }
  };

  // ---------------PUT-----------------------
  //Function to update a quiz
  const editQuiz = async (quizId) => {//Define an async function to edit a quiz
    try {
         //Conditional rendering to ensure exacly 5 questions are added
        if (questions.length !== 5) {
          setFormError('You must have exactly 5 questions.');
          return;//Exit the function
        }
      
      const token = localStorage.getItem('token');    // Retrieve the JWT token from local storage
      //Request
      //Send a PUT request to the server to edit an existing quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing (CORS)
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`, // Include the authorization token in the request header
        },
        body: JSON.stringify(// Convert newQuizName and newQuestion to a JSON string for the request body
          {// Request body containing the updated quiz name and questions
            quizName: newQuizName, //The updated name for the quiz being edited.
            questions: newQuestion // The updated list of questions for the quiz
          }// Convert updated quiz data to JSON format
        )
      });
      //Response handling
            // Conditional rendering to check if the response indicates success (status code 200-299)
      if (response.ok) {
        const updatedQuiz = await response.json(); // Parse the response as JSON
               /* Update the quizList state by mapping through the current list (quizList.map) and replacing 
       the quiz with matching ID (q._id === updatedQuiz._id) with the updated quiz (updatedQuiz).*/
        setQuizList(
          quizList.map(//create a new array by applying a given function to each element of the original array
            q => (q._id === updatedQuiz._id  ? updatedQuiz : q))); //For each quiz object q,  checks if the _id property of q matches the _id of the updatedQuiz
                //The conditional operator (? :) is used to choose between two values. 
        //If the condition (q._id === updatedQuiz._id) is true, it returns updatedQuiz. Otherwise, it returns q.
        
        // Reset form fields and state
        setQuizName('');//Clear the newQuizName input field
        setUpdateQuiz(null);// Clear the quizToUpdate state to exit edit mode
      } 
      else {
        throw new Error('Error editing quiz');//Throw an error message if the PUT request is unsuccessful
      }
    } catch (error) {
          // Handle any errors that occur during the request
      console.error(`Error editing the quiz: ${error}`);//Log an error message in the console for debugging purposes
      setError(`Error editing the quiz: ${error}`)//Set the error state with an error message
    }
  }

//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = async (quizId) => {//Define an async function to delete a quiz
    try {
      const token = localStorage.getItem('token');//Retrieve the authentication token from localStorage
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing (CORS)
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`,// Include the authorization token in the request header
        }
      });

      //Response handling
      // Conditional rendering to check if the response indicates success (status code 200-299)
      if (response.ok) {
              // If successful, update the quizList state by filtering out the deleted quiz
        setQuizList(quizList.filter(q => q._id !== quizId));
        /*The filter method iterates through each quiz in quizList. For each quiz q, it checks if q._id is not equal to quizId. 
        If q._id is not equal to quizId, the quiz is included in the new array.
        setQuizList(...): Updates the state with the new array that excludes the deleted quiz.*/
      } else {
        throw new Error('Error deleting quiz');//Throw an error message if the DELETE request is unsuccessful
      }
    } catch (error) {
      setError('Error deleting quiz:', error);//Set the error state with an error message
      console.error('Error deleting quiz:', error);//Log a error message in the console for debugging purposes
    }
  }
 
  // ===========EVENTS==============
  // Function to handle changes in the quiz questions
const handleChange = (index, event) => {
  
  const values = [...questions];// Create a copy of the questions array using spread operator

  // Conditional rendering to if the target name is 'questionText' or 'correctAnswer'
  if (event.target.name === "questionText" || event.target.name === "correctAnswer") {
    values[index][event.target.name] = event.target.value; // Update the questionText or correctAnswer of the question at the specified index
  } 
  else {
    // If the target name is an option (e.g., options.0, options.1, options.2)
    const optionIndex = Number(event.target.name.split('.')[1]);    // Extract the option index from the event target name
    values[index].options[optionIndex] = event.target.value;// Update the option value in the options array of the question at the specified index
  }

  // Update the state (questions) with the updated values array
  setQuestions(values);
};
/*The string.split() method takes a pattern and divides the string into an ordered list of substrings 
by searching for the pattern, puts these substrings into an array, and returns the array.*/

  //Function to add a new question
const handleAddQuestion = () => {
  // Conditional rendering if the current number of questions is already 5
  if (questions.length >= 5) {
    // If there are already 5 questions, set an error message and return early
    setFormError('You cannot add more than 5 questions.');
    return;
  }

  // If there are less than 5 questions, add a new question to the questions array
  setQuestions([
    ...questions, // Spread the existing questions array to preserve its contents
    { // Add a new question object to the end of the array
      questionText: '', // Initialize question text as an empty string
      correctAnswer: '', // Initialize correct answer as an empty string
      options: ['', '', ''] // Initialize options as an array of three empty strings
    }
  ]);
};

  // Function to move to the next question
  const nextQuestion = () => {
    // Get the last question in the questions array
    const lastQuestion = questions[questions.length - 1]; 
      // Conditional rendering to check if any of the fields in the last question are empty
    if (!lastQuestion.questionText || !lastQuestion.correctAnswer || lastQuestion.options.some(option => !option)) {
     /* .some(): This method iterates through each element of the array and returns 
     true if at least one element satisfies the condition specified by the callback function.*/
          // If any field is empty, set an error message and return early
      setFormError('Please fill out all fields of the current question before moving to the next one.');
      return;
    }
    // Conditional rendering to check if the number of questions has reached the limit of 5
  if (questions.length >= 5) {
    // If the limit is reached, set an error message and return early
    setFormError('You cannot add more than 5 questions.');
    return;
  }

    // Add a new question template to the questions array
    setQuestions([...questions, 
      { questionText: '', correctAnswer: '', options: ['', '', ''] }
    ]);
    setFormError('');    // Clear any existing form errors

  }
// Function to toggle the edit mode of a quiz
const toggleQuizUpdate = (quizId) => {
  // Toggle the update state between true and false
  setUpdate(!update);
  // Set the quiz ID of the quiz to be updated
  setQuizToUpdate(quizId);
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
              <Col> 
          <Button variant='primary' type='button' onClick={() => toggleQuizUpdate(quiz._id)}>
                    {update && quizToUpdate === quiz._id ? 'EXIT' : 'EDIT'}
                  </Button>
          </Col>
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
