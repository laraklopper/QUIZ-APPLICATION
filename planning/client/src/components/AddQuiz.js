import React, { useState } from 'react';

export default function AddQuiz () {
  //============STATE VARIABLES=============
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
  const [questionIndex, setQuestionIndex] = useState(0);

  
  const handleChange = (e, index, field, optionIndex = null) => {
    const updatedQuestions = [...questions];
    if (optionIndex !== null) {
      updatedQuestions[index][field][optionIndex] = e.target.value;
    } else {
      updatedQuestions[index][field] = e.target.value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', ''] }]);
    setQuestionIndex(questionIndex + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quiz = { quizName, questions };
    //  if (questions.length !== 5) {
    //   setFormError('You must add exactly 5 questions.');
    //   return;// Exit the function
    // }
    try {
      // const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: { 
          'Content-Type': 'application/json' 
           'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quiz)
      });

      if (response.ok) {
        alert('Quiz added successfully!');
        setQuizName('');
        setQuestions([{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
        setQuestionIndex(0);
      } else {
        alert('Failed to add quiz');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

//=============JSX RENDERING=======================
  return (
    <div>
      <h1 className="h1">Add Quiz</h1>
      <form onSubmit={addNewQuiz}>
        <div>
          <label>Quiz Name: </label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        {questions.map((question, index) => (
          <div key={index}>
            <h3>Question {index + 1}</h3>
            <div>
              <label>Question Text: </label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleChange(e, index, 'questionText')}
                required
              />
            </div>
            <div>
              <label>Correct Answer: </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => handleChange(e, index, 'correctAnswer')}
                required
              />
            </div>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>Alternative Answer {optionIndex + 1}: </label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleChange(e, index, 'options', optionIndex)}
                  required
                />
              </div>
            ))}
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Add Quiz</button>
      </form>
    </div>
  );
};

export default AddQuiz;
