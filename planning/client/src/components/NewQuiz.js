import React from 'react';
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button';

export default function NewQuiz({
  addNewQuiz,
  newQuizName,
  setNewQuizName,
  newQuestions,
  setNewQuestions,
  newQuizIndex,
  setNewQuizIndex,
  formError
}) {

  //=========EVENTS====================
  //Function to add a question
  const handleAddQuestion = (e) => {
    e.preventDefault();

    // Ensure all fields are filled before adding a question
    if (!newQuizIndex.newQuestionText || !newQuizIndex.newCorrectAnswer || newQuizIndex.newOptions.includes('')) {
      return;
    }

    // Add the new question to the questions array
    setNewQuestions([...newQuestions, newQuizIndex]);

    // Clear the input fields
    setNewQuizIndex({
      newQuestionText: '',
      newCorrectAnswer: '',
      newOptions: ['', '', '']
    });
  };
//===============JSX RENDERING===================
  return (
    <div>
      <Row className='formRow'>
        <Col id='formCol'>
          <Form onSubmit={addNewQuiz}>
            {/* Quiz Name */}
            <Form.Group controlId='quizName'>
              <Form.Label>Quiz Name</Form.Label>
              <Form.Control
                type='text'
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
              />
            </Form.Group>

            {/* Questions */}
            {newQuestions.map((question, index) => (
              <div key={index}>
                <Form.Group controlId={`question-${index}`}>
                  <Form.Label>Question {index + 1}</Form.Label>
                  <Form.Control
                    type='text'
                    value={question.newQuestionText}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuestions];
                      updatedQuestions[index].newQuestionText = e.target.value;
                      setNewQuestions(updatedQuestions);
                    }}
                  />
                </Form.Group>

                {/* Options */}
                {question.newOptions.map((option, optIndex) => (
                  <Form.Group controlId={`option-${index}-${optIndex}`} key={optIndex}>
                    <Form.Label>Option {optIndex + 1}</Form.Label>
                    <Form.Control
                      type='text'
                      value={option}
                      onChange={(e) => {
                        const updatedQuestions = [...newQuestions];
                        updatedQuestions[index].newOptions[optIndex] = e.target.value;
                        setNewQuestions(updatedQuestions);
                      }}
                    />
                  </Form.Group>
                ))}

                {/* Correct Answer */}
                <Form.Group controlId={`correctAnswer-${index}`}>
                  <Form.Label>Correct Answer</Form.Label>
                  <Form.Control
                    type='text'
                    value={question.newCorrectAnswer}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuestions];
                      updatedQuestions[index].newCorrectAnswer = e.target.value;
                      setNewQuestions(updatedQuestions);
                    }}
                  />
                </Form.Group>
              </div>
            ))}

            {/* Error Message */}
            {formError && <p style={{ color: 'red' }}>{formError}</p>}

            {/* Add Question */}
            <Button variant='primary' type='button' onClick={handleAddQuestion}>
              Add Question
            </Button>

            {/* Submit Quiz */}
            <Button variant='primary' type='submit'>
              Submit Quiz
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
