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
  quizName,
  setQuizName,
  currentQuestion,
  setCurrentQuestion,
  questions,
  currentUser,
  setQuestions  
}
) {
  
  // ========STATE VARIABLES===============
  //Edit Quiz variables
  const [newQuizName, setNewQuizName] = useState('');//State to store the new quizName
  const [update, setUpdate] = useState(false);//Boolean to toggle the edit quizForm
  const [newQuestions, setNewQuestions] = useState([]);// State to store the array of Questions for the new or updated quiz
  const [quizToUpdate, setQuizToUpdate] = useState(null);// ID of the quiz being edited
  const [editQuizIndex, setEditQuizIndex] = useState(// Details for editing a specific question
    { editQuestionText: '', editCorrectAnswer: '', editOptions: ['', '', ''] });
  const [formError, setFormError] = useState(null);//Form error message variables
  
  //====================USE EFFECT HOOK===================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
      fetchQuizzes()// Call the fetchQuizzes function to retrieve quizzes from the server
  }, [fetchQuizzes]);
  // Dependency array: the effect will re-run when fetchQuizzes changes

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async () => {
      // Conditional rendering to check if the number of questions is exactly 5
    if (questions.length !== 5) {
      // If not, alert the user and exit the function
      alert('You must add exactly 5 questions.'); // Ensure exactly 5 questions
      return; // Exit the function to prevent further execution
    }
    
    // Create a quiz object to send to the server
    const quiz = {
      name: quizName, // The name of the quiz
      questions,     // The array of questions
      username: currentUser // The username of the current user
    };

    try {
      const token = localStorage.getItem('token');//Retrieve the JWT token from localStorage
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Enable CORS for cross-origin resourcing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type
          'Authorization': token,// Pass the JWT token in Authorization header
        },
        body: JSON.stringify(quiz) // Convert quiz object to JSON
      });
  
      //Response handling
      if (response.ok) {
        alert('New Quiz successfully added')//Display a success message if the quiz is successfy
        const newQuiz = await response.json(); 
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);
        setQuizName('');     
        setQuestions([]);
      } 
      else {
        throw new Error('There was an error creating the quiz');//Throw an error message if the POST request is unsuccessful
      }

    } 
    catch (error) {
      console.error('There was an error creating the quiz:', error);
      setError('There was an error creating the quiz');
    }
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Set the mode to 'cors' to allow cross-origin requests
        headers: {
          'Content-Type': 'application/json',//Specify Content-Type in payload
          'Authorization': token,// Pass the JWT token in Authorization header
        },
        body: JSON.stringify({
            name: newQuizName, 
            questions: newQuestions         
            })
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizList(quizList.map(q => 
          (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setEditQuizIndex([
          { editQuestionText: '', editCorrectAnswer: '', options: ['', '', ''] }
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
  const deleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,// Pass the JWT token in Authorization header
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
      setError('Error deleting quiz:', error);
      console.error('Error deleting quiz:', error);
    }
  }
 
  // ===========EVENT LISTENERS==============  
    //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdate(!update)
    setQuizToUpdate(quizId);
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
                  <p className='itemText'>USERNAME: {quiz.username}</p>
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
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
