import React, { useEffect, useState } from 'react'
 import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function AddQuiz() {
 //======STATE VARIABLES=================
  const [quizName, setQuizName] = useState('');
  const [username, setUsername] = useState('')
  const [questions, setQuestions] = useState([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);

 //============
   useEffect(() => {
        // Replace 'USER_ID' with the actual user ID you want to fetch
        const userId = 'USER_ID';

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();
                setUsername(userData.username);
            } catch (error) {
                console.error('There was an error fetching the user data:', error);
            }
        };

        fetchUserData();
    }, []);

     const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'options') {
            newQuestions[index].options[value.index] = value.text;
        } else {
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', ''] }]);
    };

 const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quizName,
                    username,
                    questions
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const quiz = await response.json();
            console.log('Quiz created:', quiz);
        } catch (error) {
            console.error('There was an error creating the quiz:', error);
        }
    };
  //========JSX RENDERING===================

  return (
    <div>
      <Row>
        <Col>
        <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      <form>
        <Row>
          <Col xs={6}>
           <label>
            <p>QUIZ NAME:</p>
            <input
            className='quizInput'
            type='text'
            />
          </label>
          </Col>
          <Col xs={6}>
          <label>
            <p>USERNAME:</p>
            <input/>
          </label>
          </Col>

        </Row>
        <div>
          <
        </div>
      </form>
    </div>
  )
}
