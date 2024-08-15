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
  currentUser,
  setQuestions  
}
) {
  
  // ========STATE VARIABLES===============
  //Edit Quiz variables
  const [newQuizName, setNewQuizName] = useState('');
  const [update, setUpdate] = useState(false);
  const [newQuestions, setNewQuestions] = useState([])
  const [quizToUpdate, setQuizToUpdate] = useState(null);
  const [editQuizIndex, setEditQuizIndex] = useState(
    { questionText: '', correctAnswer: '', options: ['', '', ''] });
    //Form error message variables
  const [formError, setFormError] = useState(null);
  
  //====================USE EFFECT HOOK===================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
      fetchQuizzes()
  }, [fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async () => {
    
    if (questions.length !== 5) {
      alert('You must add exactly 5 questions.');
      return;
    }
    // Create a quiz object to send to the server
    const quiz = {
      name: quizName, 
      questions, 
      username: currentUser
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
        body: JSON.stringify(quiz)
      });
  
      //Response handling
      if (response.ok) {
        alert('New Quiz successfully added')
        const newQuiz = await response.json(); 
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);
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
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
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
          userData={userData}
          setUserData={setUserData}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
