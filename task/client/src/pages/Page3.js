// Import necessary modules and packages
import React, { useEffect, useState} from 'react';
import '../CSS/Page3.css';
// Bootstrap
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
// Components
import Header from '../components/Header';
import AddQuiz from '../components/AddQuiz';
import Footer from '../components/Footer';
import EditQuiz from '../components/EditQuiz';

// Page3 function component
export default function Page3(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList, 
  setQuizList, 
  setError, 
  fetchQuizzes, 
  logout, 
  userData,
  setUserData,
  quizName,
  setQuizName,
  currentQuestion,
  setCurrentQuestion,
  questions,
  // currentUser,
  setQuestions  
}
) {
  
  // ========STATE VARIABLES===============
  //Edit Quiz variables
  const [newQuizName, setNewQuizName] = useState('');// State variable to store the name of the new quiz being added or edited
  const [update, setUpdate] = useState(false);// State variable to control the visibility of the update form or mode
  // State variable to store the list of new questions being added or updated
  const [newQuestions, setNewQuestions] = useState([]); // Array for new questions
  // State variable to store the ID of the quiz currently being updated
const [quizToUpdate, setQuizToUpdate] = useState(null); // The quiz being updated
// State variable to manage the index of the question being edited and its details
const [editQuizIndex, setEditQuizIndex] = useState(
  { questionText: '', correctAnswer: '', options: ['', '', ''] }
);
// State variable for storing and displaying form error messages
const [formError, setFormError] = useState(null); // Form error message variables  
  //====================USE EFFECT HOOK====================================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
      fetchQuizzes()
  }, [fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------    
//Function to add a new quiz
  const addNewQuiz = async () => {//Define an async function to add a new Quiz
    // Conditional rendering to check if exactly 5 questions have been added
    if (questions.length !== 5) {
      alert('You must add exactly 5 questions.');// Alert the user if the condition is not met
      return;// Exit the function early if the condition is not met
    }
  // Create a quiz object with the name and questions to send to the server
    const quiz = {name: quizName, questions}
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage for authentication
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Cross-Origin Resource Sharing mode
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in request body
          'Authorization': `Bearer ${token}`,//Attach the JWT token to the authorization header
        },
        body: JSON.stringify(quiz)// Convert the quiz object to JSON format for the request body
      });
      /*
      body: JSON.stringify({
        name: quizName, 
        questions
        })
      */

      //Response handling
      if (response.ok) {
        alert('New Quiz successfully added') // Notify the user of successful addition
        const newQuiz = await response.json(); // Parse the response JSON to get the new quiz data
        //setQuizList([...prevQuizList, newQuiz])
        // Update the quiz list by adding the new quiz
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);
        setQuizName('');     // Reset the quiz name input
        setQuestions([]); // Clear the questions array
      } 
      else {
        throw new Error('There was an error creating the quiz');//Throw an error if the POST request is unsuccessful
      }

    } 
    catch (error) {
          // Handle any errors that occur during the fetch request
      console.error('There was an error creating the quiz:', error); // Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz');//Set the error State with an error message
    }
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {
    //Conditional rendering
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage for authentication
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',//Enable Cross-Origin-Resourcing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,//Attach the JWT token to the authorization header
        },
        body: JSON.stringify({// Convert the updated quiz data to JSON format for the request body
            name: newQuizName, 
            questions: newQuestions         
            })
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();// Parse the response JSON to get the updated quiz data
        setQuizList(quizList.map(q =>  // Update the quiz list with the new quiz data
          (q._id === updatedQuiz._id ? updatedQuiz : q)));// Replace the old quiz with the updated quiz
              // Reset state variables for editing
        setEditQuizIndex([
          { editQuestionText: '', editCorrectAnswer: '', options: ['', '', ''] }
        ]);
       setQuizToUpdate(null); // Clear the ID of the quiz being edited
      setNewQuizName(''); // Reset the new quiz name input
      setNewQuestions([]); // Clear the new questions array
      } 
      
      else {
        throw new Error('Error editing quiz');//Throw an error if the PUT request is unsuccessful
      }

 
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error(`Error editing the quiz: ${error}`);// Log an error message in the console for debugging purposes
      setError(`Error editing the quiz: ${error}`);//Set the error State with an error message
    }
  }

//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = async (quizId) => {//Define an async function to delete a quiz
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage to authenticate the request
      //Send a DELETE request to server to delete a quiz by its id
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',//Enable CORS for Cross-Origin-Resourcing
        headers: {
          'Content-Type': 'application/json',//Speciy the Content-Type as JSON
          'Authorization': `Bearer ${token}`,//Attatch the JWT token in the authorization Header
        }
      });
      //Response handling
              // Conditional rendering to check if the response is successful (status code 200-299)
      if (response.ok) {
      // Filter out the deleted quiz from the current quiz list
        setQuizList(quizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');//Throw an error message if the DELETE request is unsuccessful
      }
    } 
    catch (error) {
       // Handle any errors that occur during the fetch request
      setError('Error deleting quiz:', error);//Set the error state with an error message
      console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
    }
  }
 
  // ===========EVENT LISTENERS==============  
    //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdate(!update)  // Toggle the update state between true and false

    setQuizToUpdate(quizId);// Set the quiz ID to be updated
  };


  //==============JSX RENDERING=================
  return (
    <>
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1 */}
      <section className='page3Section1'>
        <Row className='quizRow'>
          <Col id='outputHeading'>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
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
                  {/* <p className='itemText'>USERNAME: {quiz.user}</p> */}
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
      {/* Section 2 */}
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
          userData={userData}
          setUserData={setUserData}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
