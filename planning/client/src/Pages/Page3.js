// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page3.css';
// Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 
// Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import Edit from '../components/Edit';
import NewQuiz from '../components/NewQuiz';

// Page3 function component
export default function Page3(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList,
  setQuizList,
  setError,
  fetchQuizzes,
  questions,
  setQuestions,
  quizName,
  setQuizName
}) {

  // ========STATE VARIABLES===============
  //NewQuiz Variables
  const [newQuizName, setNewQuizName] = useState('');
  const [newQuestions, setNewQuestions] = useState([]);
  const [newQuizIndex, setNewQuizIndex] = useState({
    newQuestionText: '',
    newCorrectAnswer: '',
    newOptions: ['', '', '']
  });
  //Update quiz variables
  const [update, setUpdate] = useState(false)
  const [quizToUpdate, setQuizToUpdate] = useState(null);
  const [editQuizIndex, setEditQuizIndex] = useState([// Array of new questions when editing a quiz
    { editQuestionText: '', editCorrectAnswer: '', editOptions: ['', '', ''] }
  ]);
  //Error
  const [formError, setFormError] = useState('');

  //========================================================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {
    event.preventDefault();
   
    const quiz = {
      newQuizName, 
      questions: newQuestions
    }
    if (newQuestions.length !== 5) {
      setFormError('You must add exactly 5 questions.');
      return;// Exit the function
    }

    try {
      //Retrieve the authentication token from local storage
      const token = localStorage.getItem('token');
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
          { quizName: newQuizName, questions: newQuestions }
        )
      });

      //Response handling
      if (response.ok) {
        // Parse the JSON response to get the created quiz
        const createdQuiz = await response.json();
        setQuizList([...quizList, createdQuiz]);
        setNewQuizName('');
        setNewQuestions([]);
        setFormError('');
        console.log('Quiz created:', createdQuiz);
      } 
      else {
        throw new Error('There was an error creating the quiz');
      }
    } catch (error) {
      console.error('There was an error creating the quiz:', error);
      setError('There was an error creating the quiz:', error);
    }
  };

  // ---------------PUT-----------------------
  //Function to update a quiz
  const editQuiz = async (quizId) => {
    if (editQuizIndex.length !== 5) {
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
        body: JSON.stringify(// Convert the updated quiz data to JSON format
          {// Request body containing the updated quiz name and questions
            quizName: newQuizName, // The new name for the quiz
            questions: editQuizIndex // The updated list of questions for the quiz
          }
        )
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();
        // Update quizList with the edited quiz
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        // Reset the form fields
        setEditQuizIndex([
          { editQuestionText: '', editCorrectAnswer: '', options: ['', '', ''] }
        ]);
        setNewQuizName('');
        setQuizToUpdate(null);// Clear the quiz being updated
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
  const deleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      //Send a DELETE request to server
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
        {/* QUIZ Output */}
        <div id='quizOutput'>
          {/* Display the list of quizes*/}
          {quizList.map((quiz) => (
            <div className='quizItem' key={quiz._id}>
              <Row className='quizListRow'>
                <Col className='quizCol'>
                  <p className='itemText'>Quiz Name: {quiz.quizName}</p>
                </Col>
                {/* Toggle button to update QUIZ */}
                <Col xs={6} md={4} className='buttonCol'> 
                  <div>
                    <Button variant='primary' onClick={() => deleteQuiz(quiz._id)}>
                      DELETE
                    </Button>
                  </div>
                  <div>
                    <Button 
                      variant='primary' 
                      type='button' 
                      onClick={() => toggleQuizUpdate(quiz._id)}>
                      {update && quizToUpdate === quiz._id ? 'EXIT': 'EDIT' }
                    </Button>
                  </div>
                </Col> 
              </Row>
              <div>
                {update && quizToUpdate === quiz._id && (
                  <Edit
                    newQuestion={editQuizIndex}
                    setNewQuestion={setEditQuizIndex}
                    newQuizName={newQuizName}
                    setNewQuizName={setNewQuizName}
                    editQuiz={editQuiz}
                    quiz={quiz}
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
        <NewQuiz
          addNewQuiz={addNewQuiz}
          newQuizName={newQuizName}
          setNewQuizName={setNewQuizName}
          newQuestions={newQuestions}
          setNewQuestions={setNewQuestions}
          newQuizIndex={newQuizIndex}
          setNewQuizIndex={setNewQuizIndex}
          formError={formError}
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
