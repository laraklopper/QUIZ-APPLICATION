import React from 'react';
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button';

export default function Edit({
  newQuestion,
  setNewQuestion,
  newQuizName,
  setNewQuizName,
  editQuiz,
  quiz
}) {

  //=========EVENTS====================
  const handleEditQuestion = (index, field, value) => {
    const updatedQuestions = [...newQuestion];
    updatedQuestions[index][field] = value;
    setNewQuestion(updatedQuestions);
  };

  //===========JSX RENDERING===================
  
  return (
    <Row>
      <Col>
        <Form onSubmit={(e) => {
          e.preventDefault();
          editQuiz(quiz._id);
        }}>
          {/* Edit Quiz Name */}
          <Form.Group controlId='editQuizName'>
            <Form.Label>Edit Quiz Name</Form.Label>
            <Form.Control
              type='text'
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
            />
          </Form.Group>

          {/* Edit Questions */}
          {newQuestion.map((question, index) => (
            <div key={index}>
              <Form.Group controlId={`editQuestion-${index}`}>
                <Form.Label>Edit Question {index + 1}</Form.Label>
                <Form.Control
                  type='text'
                  value={question.editQuestionText}
                  onChange={(e) => handleEditQuestion(index, 'editQuestionText', e.target.value)}
                />
              </Form.Group>

              {/* Edit Options */}
              {question.editOptions.map((option, optIndex) => (
                <Form.Group controlId={`editOption-${index}-${optIndex}`} key={optIndex}>
                  <Form.Label>Edit Option {optIndex + 1}</Form.Label>
                  <Form.Control
                    type='text'
                    value={option}
                    onChange={(e) => {
                      const updatedQuestions = [...newQuestion];
                      updatedQuestions[index].editOptions[optIndex] = e.target.value;
                      setNewQuestion(updatedQuestions);
                    }}
                  />
                </Form.Group>
              ))}

              {/* Edit Correct Answer */}
              <Form.Group controlId={`editCorrectAnswer-${index}`}>
                <Form.Label>Edit Correct Answer</Form.Label>
                <Form.Control
                  type='text'
                  value={question.editCorrectAnswer}
                  onChange={(e) => handleEditQuestion(index, 'editCorrectAnswer', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}

          {/* Submit Edit */}
          <Button variant='primary' type='submit'>
            Submit Edit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
