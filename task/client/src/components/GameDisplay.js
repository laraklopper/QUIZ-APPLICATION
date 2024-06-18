import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Quiz from './Quiz';

//Page 2
// GameDisplay component definition
export default function GameDisplay() {
  //==========STATE VARIABLES==============
  // State to track the selected quiz
  const [selectedQuiz, setSelectedQuiz] = useState(null);  // State to track the selected quiz
  const [questionIndex, setQuestionIndex] = useState(0);  // State to track the current question index
  const [score, setScore] = useState(0);  // State to track the user's score


 
  

  //=========EVENTS==============
  // Function to handle selecting a quiz
  const handleSelect = (event) => {
    try {
      const quiz = JSON.parse(event.target.value);      // Parse the selected quiz from the event value
      setSelectedQuiz(quiz);      // Set the selected quiz
      setQuestionIndex(0);      // Reset the question index to 0
      setScore(0);      // Reset the score to 0

    } catch (error) {
      console.error('Error parsing quiz:', error);// Log any errors in the console that occur during the JSON parsing for debugging purposes

    }
  };

   const handleTimerChange = (event) => {
        setTimerEnabled(event.target.checked); // Update timerEnabled based on the checkbox state
    };
  
    const startQuiz = () => {
        setPlay(true)
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
