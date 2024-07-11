// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page3.css';
// Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 
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
  questions,
  setQuestions,
  quizName,
  setQuizName,
  logout
}) {
  // ========STATE VARIABLES===============
  const [newQuizName, setNewQuizName] = useState('');//State used for quiz being created
  const [newQuestions, setNewQuestions] = useState([]);//State used to store the list of newQuestions being added to the quiz
  const [update, setUpdate] = useState(false);//State to toggle between update and non-update mode.
  const [quizToUpdate, setQuizToUpdate] = useState(null);//State to store the ID of the quiz being updated.
  const [editQuizIndex, setEditQuizIndex] = useState(// State to store the questions for the quiz being edited.
    [{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);//State used to store any form error messages
  const [formError, setFormError] = useState('');

  //========================================================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {
    event.preventDefault();
    if (newQuestions.length !== 5) {
      setFormError('You must add exactly 5 questions.');
      return;
    }

    try {
      const token = localStorage.getItem('token');//Retrieve the authentication token from local storage
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors',// Enable Cross-Origin Resource Sharing

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quizName: newQuizName, questions: newQuestions })
      });

      //Response handling
      if (response.ok) {
        const createdQuiz = await response.json();
        setQuizList([...quizList, createdQuiz]);
        setNewQuizName('');
        setNewQuestions([]);
        setFormError('');
        alert('New Quiz added');
      } else {
        throw new Error('There was an error creating the quiz');
      }
    } catch (error) {
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
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quizName: newQuizName, questions: editQuizIndex })
      });

      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setEditQuizIndex([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
        setQuizToUpdate(null);
      } 
      else {
        throw new Error('Error editing quiz');
      }
    } 
    catch (error) {
      console.error(`Error editing the quiz: ${error}`);
      setError(`Error editing the quiz: ${error}`);
    }
  };

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
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setQuizList(quizList.filter(q => q._id !== quizId));
      } else {
        throw new Error('Error deleting quiz');
      }
    } catch (error) {
      setError('Error deleting quiz:', error);
    }
  };

    // ===========EVENT LISTENERS==============  
    //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdate(!update);
    setQuizToUpdate(quizId);
  };

  //============JSX RENDERING==============

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
                <Col xs={6} md={4} className='buttonCol'> 
            {/* Button to Delete a quiz */}
                  <Button variant='primary' onClick={() => deleteQuiz(quiz._id)}>
                    DELETE
                  </Button>
                      {/* Toggle button to update QUIZ */}
                  <Button 
                    variant='primary' 
                    type='button' 
                    onClick={() => toggleQuizUpdate(quiz._id)}>
                    {update && quizToUpdate === quiz._id ? 'EXIT' : 'EDIT'}
                  </Button>
                </Col>
              </Row>
{/* Form to edit a quiz */}
              {update && quizToUpdate === quiz._id && (
                <EditQuiz
                  editQuizIndex={editQuizIndex}
                  setEditQuizIndex={setEditQuizIndex}
                  newQuizName={newQuizName}
                  setNewQuizName={setNewQuizName}
                  editQuiz={editQuiz}
                  quiz={quiz}
                />
              )}
            </div>
          ))}
        </div>
      </section>
          {/* Section 2 */}
      <section id='page3Section2'>
        <Row>
          <Col>
            <h2 className='h2'>ADD QUIZ</h2>
          </Col>
        </Row>
        {/* Form to add a quiz */}
        <AddQuiz
          addNewQuiz={addNewQuiz}
          newQuizName={newQuizName}
          setNewQuizName={setNewQuizName}
          formError={formError}
          newQuestions={newQuestions}
          setNewQuestions={setNewQuestions}
        />
      </section>
            {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}
