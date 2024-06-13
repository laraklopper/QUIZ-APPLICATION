import React, { useState } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//AddQuiz function component
export default function AddQuiz() {
  //======STATE VARIABLES=================
  const [quizName, setQuizName] = useState('');
  const [username, setUsername] = useState('')
  const [questions, setQuestions] = useState([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
 
  //=================================================


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
      const response = await fetch('http://localhost:3001/users/quizzes', {
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
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={6}>
          <label>
            <p>QUIZ NAME:</p>
            <input
            className='quizInput'
            type='text'
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
            />
          </label>
          </Col>
          <Col xs={6}>
          <label>
            <p>USERNAME:</p>
            <input
            className='quizInput'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
          </label>
          </Col>

        </Row>
        <div>
          <h4 className='h4'>ADD QUESTION</h4>
        </div>
        {questions.map((question , index) => (
          <div key={index}>
            <label>Question:</label>
            <input type="text" value={question.questionText} onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)} required />
            <label>Correct Answer:</label>
            <input type="text" value={question.correctAnswer} onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)} required />
            {question.options.map((option, optIndex) => (
              <div key={optIndex}>
                <label>Option {optIndex + 1}:</label>
                <input 
                type="text" 
                value={option} 
                onChange={(e) => handleQuestionChange(index, 'options', 
                  { index: optIndex, text: e.target.value })} 
                required />
              </div>
            ))}
          </div>
        ))}
        <Row>
          <Col>
            <button type="button" onClick={addQuestion}>Add Question</button>
            <button type="submit">Submit Quiz</button>
          </Col>
        </Row>
      </form>
    </div>
  )
}
