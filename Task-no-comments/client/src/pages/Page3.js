// Import necessary modules and packages
import React, { useCallback, useEffect, useState} from 'react';
import '../CSS/Page3.css';
// Bootstrap
import Button from 'react-bootstrap/Button'; 
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
// Components
import Header from '../components/Header'
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
  quizName,
  setQuizName,
  currentQuestion,
  setCurrentQuestion,
  questions,
  setQuestions  
}
) {
  
  // ========STATE VARIABLES===============
  //Edit quiz variables
  // State to store new quiz name
  const [newQuizName, setNewQuizName] = useState('');
  const [update, setUpdate] = useState(false); 
  const [newQuestions, setNewQuestions] = useState([]) 
  const [quizToUpdate, setQuizToUpdate] = useState(null);  
  const [editQuizIndex, setEditQuizIndex] = useState( 
    { editQuestionText: '', 
      editCorrectAnswer: '', 
      editOptions: ['', '', ''] });
  // Form error for validation
  const [formError, setFormError] = useState(null); 
  
  
  //====================USE EFFECT HOOK===================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
      fetchQuizzes()//Call the fetch quizzes function
  }, [fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async () => {
   
    if (questions.length !== 5) {
      alert('You must add exactly 5 questions.');
      return;// Exit the function to prevent further execution
    }
    
    // Create a quiz object to send to the server
    const quiz = {
      name: quizName,// Quiz name entered by the user
      // username: currentUser.username, 
      questions,// The array of questions
    }
    try {
      const token = localStorage.getItem('token');
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quiz) // Convert the quiz object to a JSON string before sending
      });
  
      // Handle the response from the server
      if (response.ok) {
        alert('New Quiz successfully added');
        const newQuiz = await response.json();   
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);// Update the quizList state 
        setQuizName('');     
        setQuestions([]);
      } 
      else {
        throw new Error('There was an error creating the quiz');
      }

    } 
    catch (error) {
      console.error('There was an error creating the quiz:', error);
      setError('There was an error creating the quiz');
      alert('There was an error creating the quiz');
    }
  };


  // ---------------PUT-----------------------
  //Function to edit a quiz
  //Function to edit a quiz
  const editQuiz = async (quizId) => {//Define an async function to edit a quiz

    // Conditional rendering to check if the number of questions is exactly 5
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');// Set form error if the validation fails
      return;// Exit the function to prevent further execution
    }
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from local storage
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Enable Cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        },
        body: JSON.stringify({
          name: newQuizName, 
          questions: newQuestions,                
            })
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();
        // Update the quiz list with the modified quiz data
        setQuizList(quizList.map(q => 
          (q._id === updatedQuiz._id ? updatedQuiz : q)
        ));
        // Reset the edit form by clearing the state variables
        setEditQuizIndex([
          {
            editQuestionText: '',  
            editCorrectAnswer: '',  
            editOptions: ['', '', ''] 
          }
        ]);
        setQuizToUpdate(null); 
        setNewQuizName('');    
        setNewQuestions([]);    
      }       
      else {
        throw new Error('Error editing quiz');
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);
      setError(`Error editing the quiz: ${error}`);
    }
  }



//------------DELETE------------------------
//Function to delete a quiz
 const deleteQuiz = async (quizId) => {//Define an async function to delete a quiz
    try {
      const token = localStorage.getItem('token');
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header
        }
      });
      //Response handling
      if (response.ok) {
        setQuizList(quizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');
      }
    } 
    catch (error) {
      setError(`Error deleting quiz: ${error}`);
      console.error(`Error deleting quiz: ${error}`);
    }
  }
 
  // ===========EVENT LISTENERS==============  
  // Function to toggle the quiz edit form visibility
  const toggleQuizUpdate = useCallback((quizId) => {
    setUpdate((prevUpdate) => !prevUpdate);
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
                  {/* <p className='itemText'>USERNAME: {quiz.username}</p>  */}
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
