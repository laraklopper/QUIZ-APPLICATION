import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//EditQuizFunction
export default function EditQuiz(
  { //PROPS PASSED FROM PARENT COMPONENT
    quiz,
    newQuizName,
    editQuiz,
    setNewQuestion,
    setNewQuizName,
    newQuestion
  }
) {

  //==================EVENT LISTENERS===========================

  const handleQuestionChange = (index, event) => {
    const values = [...newQuestion];
    if (event.target.name === 'newQuestionText' || event.target.name === 'newCorrectAnswer') {
      values[index][event.target.name] = event.target.value;
    } else {
      const optionIndex = Number(event.target.name.split('.')[1]);
      values[index].options[optionIndex] = event.target.value;
    }
    setNewQuestion(values);
  };


  const handleAddNewQuestion = () => {
    if (newQuestion.length >= 5) {
      alert('You cannot add more than 5 questions.');
      return;
    }
    setNewQuestion([
      ...newQuestion,
      { newQuestionText: '', newCorrectAnswer: '', options: ['', '', '', ''] }
    ]);
  };

  const handleNewNextQuestion = () => {
    const lastQuestion = newQuestion[newQuestion.length - 1];
    if (!lastQuestion.newQuestionText || !lastQuestion.newCorrectAnswer || lastQuestion.options.some(option => !option)) {
      alert('Please fill out all fields of the current question before moving to the next one.');
      return;
    }
    if (newQuestion.length >= 5) {
      alert('You cannot add more than 5 questions.');
      return;
    }
    setNewQuestion([
      ...newQuestion,
      { newQuestionText: '', newCorrectAnswer: '', options: ['', '', '', ''] }
    ]);
  };
  //==========JSX RENDERING===========================

   return (
    <div>
      <Row className='formRow'>
        <Col>
          <form onSubmit={(event) => { event.preventDefault(); editQuiz(quiz._id); }}>
            <label>
              <p className='labelText'>NEW QUIZ NAME:</p>
              <input 
                type='text'
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
              />
            </label>
            {newQuestion.map((question, index) => (
              <div key={index}>
                <label>
                  <p>NEW QUESTION TEXT:</p>
                  <input
                    type="text"
                    name="newQuestionText"
                    value={question.newQuestionText}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                <label>
                  <p>NEW CORRECT ANSWER:</p>
                  <input
                    type="text"
                    name="newCorrectAnswer"
                    value={question.newCorrectAnswer}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <p>New Option {optionIndex + 1}:</p>
                    <input
                      type="text"
                      name={`options.${optionIndex}`}
                      value={option}
                      onChange={(event) => handleQuestionChange(index, event)}
                    />
                  </label>
                ))}
              </div>
            ))}
            <Button type="button" onClick={handleAddNewQuestion}>Add New Question</Button>
            <Button type="button" onClick={handleNewNextQuestion}>Next Question</Button>
            <Button type="submit">Save Changes</Button>
          </form>
        </Col>
      </Row>
    </div>
  );
}