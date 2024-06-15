import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../components/Header'

//Page3 function component
export default function Page3(
  {//PROPS FROM PARENT COMPONENT
    // error,
    // setError,
    logout
  }
) {
  //=========STATE VARIABLES===========
  const [quizzes, setQuizzes] = useState([])
  const [quizName, setQuizName] = useState('')
  // const [username, setUsername] = useState('')//userData.username
  const [questions, setQuestions] = useState([
    { questionText: '', correctAnswer: '', options: ['', '', '', ''] }
  ]);
  
  const [error, setError] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  // const [newQuizName, setNewQuizName] = useState('')
  // const [questions, setQuestions] = useState([
  //   {
  //     newQuestionText: '',
  //     newCorrectAnswer: '',
  //     newOptions: ['', '', '']
  //   }
  // ]);
  
  //========UsE EFFECT HOOK TO FETCH QUIZZES FROM DATABASE===================
  // Fetch all quizzes when the component mounts
  useEffect(() => {
    // Fetch all quizzes on component mount
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3001/users/findQuizzes',);
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);


  //===========================================
    // Function to add a new question to the form
   const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);
    };

  //===============================
//Function to submit a new Quiz
    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/users/addQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ quizName, username, questions })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Quiz added:', data);
                setQuizName('');
                setUsername('');
                setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);
                setQuizzes([...quizzes, data]);
            } else {
                throw new Error('Error adding new quiz');
            }
        } catch (error) {
            setError('Error adding quiz:', error);
            console.error('Error adding quiz:', error);
        }
    };
  
  // Function to set the form inputs for editing a quiz
    const handleEditQuiz = (quiz) => {
        setQuizName(quiz.quizName);
        setUsername(quiz.username);
        setQuestions(quiz.questions);
        setEditingQuiz(quiz._id);
    };

  //Function to edit quiz
    const handleEditQuizSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/users/editQuiz/${editingQuiz}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ quizName, username, questions })
            });

            if (response.ok) {
                const updatedQuiz = await response.json();
                setQuizzes(quizzes.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
                setQuizName('');
                setUsername('');
                setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', '', ''] }]);
                setEditingQuiz(null);
            } else {
                throw new Error('Error editing quiz');
            }
        } catch (error) {
            setError('Error editing quiz:', error);
            console.error('Error editing quiz:', error);
        }
    };

  //-----------DELETE REQUEST---------------------
  //Function to delete a quiz
   
    const handleDeleteQuiz = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/users/deleteQuiz/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                }
            });

            if (response.ok) {
                setQuizzes(quizzes.filter(q => q._id !== id));
            } else {
                throw new Error('Error deleting quiz');
            }
        } catch (error) {
            setError('Error deleting quiz:', error);
            console.error('Error deleting quiz:', error);
        }
    };
  
  //=============JSX RENDERING===========

  return (
    <>
    {/* Header */}
    <Header heading='ADD QUIZ'/>
    {/* section1 */}
        <section className='section1'>
      <Row>
        <Col>
        <h2 className='h2'>QUIZZES</h2>
        </Col>
      </Row>
      {/* QUIZ Output */}
      <div>
          {quizzes.map((quiz) => (
             <Row key={quiz._id}>
              <Col><p>Quiz Name: {quiz.quizName}</p></Col>
              <Col><p>Username: {quiz.username}</p></Col>
              <Col><Button variant="warning" >EDIT</Button></Col>
              <Col><Button variant="danger">DELETE</Button></Col>
            </Row>
          ))}
      </div>
    </section>
            </section>
      <section>
        <h2>{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</h2>
        <form onSubmit={editingQuiz ? handleEditQuizSubmit : handleQuizSubmit}>
          <label>
            Quiz Name:
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          {questions.map((question, index) => (
            <div key={index}>
              <label>
                Question:
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].questionText = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
              </label>
              <label>
                Correct Answer:
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].correctAnswer = e.target.value;
                    setQuestions(newQuestions);
                  }}
                />
              </label>
              {question.options.map((option, optIndex) => (
                <label key={optIndex}>
                  Option {optIndex + 1}:
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[optIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                </label>
              ))}
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion}>Add Question</button>
          <button type="submit">{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</button>
        </form>
      </section>
        <footer>
        <Col xs={12} md={8}>
        </Col>     
        <LogoutBtn logout={logout}/>
    </footer>
    </>
  )
}
