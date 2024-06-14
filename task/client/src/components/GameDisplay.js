import React, { useEffect, useState } from 'react';

//Page 2
// GameDisplay component definition
export default function GameDisplay() {
  // State variables => move to page2.js 
  const [quizList, setQuizList] = useState([]); // Stores the list of quizzes fetched from the server 
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Stores the currently selected quiz
  const [questionIndex, setQuestionIndex] = useState(0); // Stores the index of the current question
  const [score, setScore] = useState(0); // Stores the user's score

  //=================USE EFFECT HOOK=======================
  // useEffect hook to fetch quizzes when the component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await fetch('http://localhost:3001/users/fetchQuiz', {
          method: 'GET',//HTTP request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token, // Send token for authentication
          }
        });

        //Handle response
        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          setQuizList(data); // Update quizList state with fetched data
        } else {
          throw new Error('Failed to fetch quizzes'); // Throw error if response is not ok
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error); // Log any errors that occur
      }
    };

    fetchQuizzes(); // Call the fetchQuizzes function
  }, []); // Empty dependency array means this effect runs once when the component mounts

  //=> mov to Page2.js
  // Function to handle answer selection
  const handleAnswer = async (answer) => {
    if (answer === selectedQuiz.questions[questionIndex].correctAnswer) {
      setScore(score + 1); // Increment score if the answer is correct
    }
    if (questionIndex < selectedQuiz.questions.length - 1) {
      setQuestionIndex(questionIndex + 1); // Move to the next question
    } else {
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ quizId: selectedQuiz._id, score }) // Send quizId and score to the server
        });
        const data = await response.json(); // Parse JSON response
        console.log('Result saved:', data); // Log the result
      } catch (error) {
        console.error('Error saving result:', error); // Log any errors that occur
      }
    }
  };

  // Function to handle quiz selection
  const handleSelect = (quiz) => {
    setSelectedQuiz(quiz); // Set the selected quiz
    setQuestionIndex(0); // Reset question index to 0
    setScore(0); // Reset score to 0
  };

  //======================================
  // Render the component UI
  return (
    <div>
      {!selectedQuiz ? (
        <div>
    <Row>
    <Col>
          <h2>Select Quiz</h2>
    </Col>
    </Row>
    <Row>
    <Col xs={6} md={4}>
             <select onChange={(e) => handleSelect(JSON.parse(e.target.value))}>
            <option value="">Select a quiz</option>
            {quizList.map((quiz) => (
              <option key={quiz._id} value={JSON.stringify(quiz)}>
                {quiz.category}
              </option>
            ))}
          </select>
        </Col>
        <Col xs={6} md={4}>
            </Col>
      
       
        </div>
      ) : (
        <div>
        
          <h2>{selectedQuiz.category} Quiz</h2>
          <p>Question {questionIndex + 1} of {selectedQuiz.questions.length}</p>
          <p>{selectedQuiz.questions[questionIndex].question}</p>
          {selectedQuiz.questions[questionIndex].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
