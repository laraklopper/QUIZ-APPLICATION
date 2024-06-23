import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// AddQuiz function component
export default function AddQuiz({ addNewQuiz, setQuizName, quizName, questions, handleChange, addQuestion }) {

    // const handleQuestionChange = (index, field, value) => {
  //   const newQuestions = [...questions];
  //   if (field === 'options') {
  //     newQuestions[index].options[value.index] = value.text;
  //   } else {
  //     newQuestions[index][field] = value;
  //   }
  //   setQuestions(newQuestions);
  // };

  // const addQuestion = () => {
  //   setQuestions([...questions, { questionText: '', correctAnswer: '', options: ['', '', ''] }]);
  // };

    //=============JSX RENDERING=============

  return (
    <div>
      {/* Form Header*/}
      <Row>
        <Col>
          <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      {/* Form to add a new quiz */}
      <form onSubmit={addNewQuiz} id='addQuizForm'>
        {/* Row for quiz name input */}
        <Row className='newQuizRow'>
          <Col xs={6}>
            <label className='addQuizLabel'>
              <p className='labelText'>QUIZ NAME:</p>
              <input
                className='quizInput'
                type='text'
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)} // Update quiz name state
                required
              />
            </label>
          </Col>
          <Col xs={6}></Col>
        </Row>

        {/* Map through questions and render input fields for each */}
        {questions.map((question, index) => (
          <div className='addQuestionCard' key={index}>
            <h4 className='h4'>ADD QUESTION</h4>

            {/* Row for question text and first alternative answer */}
            <Row className='newQuesRow'>
              <Col xs={6} className='newQuesCol'>
                <label className='addQuizLabel'>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='questionText'
                    value={question.questionText}
                    onChange={(e) => handleChange(index, e)} // Update question text
                    required
                  />
                </label>
              </Col>
              <Col xs={6} className='newQuesCol'>
                <label className='addQuizLabel'>
                  <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                  <input
                    className='newQuesInput'
                    type='text'
                    name={`options.0`}
                    value={question.options[0]}
                    onChange={(e) => handleChange(index, e)} // Update first option
                    required
                  />
                </label>
              </Col>
            </Row>

            {/* Row for correct answer and second alternative answer */}
            <Row>
              <Col xs={6}>
                <label className='addQuizLabel'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                  <input
                    type='text'
                    className='newQuesInput'
                    name='correctAnswer'
                    value={question.correctAnswer}
                    onChange={(e) => handleChange(index, e)} // Update correct answer
                    required
                  />
                </label>
              </Col>
              <Col xs={6}>
                <label className='addQuizLabel'>
                  <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                  <input
                    type='text'
                    name={`options.1`}
                    value={question.options[1]}
                    onChange={(e) => handleChange(index, e)} // Update second option
                    required
                  />
                </label>
              </Col>
            </Row>

            {/* Row for third alternative answer */}
            <Row>
              <Col xs={6}></Col>
              <Col xs={6}>
                <label className='addQuizLabel'>
                  <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                  <input
                    type='text'
                    name={`options.2`}
                    value={question.options[2]}
                    onChange={(e) => handleChange(index, e)} // Update third option
                    required
                  />
                </label>
              </Col>
            </Row>
          </div>
        ))}

        {/* Button to add a new question */}
        <Row>
          <Col xs={12} md={8}></Col>
          <Col xs={6} md={4}>
            <Button variant="primary" onClick={addQuestion}>ADD QUESTION</Button>
          </Col>
        </Row>

        {/* Button to submit the form and add the quiz */}
        <Row>
          <Col>
            <button type="submit">ADD QUIZ</button>
          </Col>
        </Row>
      </form>
    </div>
  );
}
