// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css'
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// AddQuiz function component
export default function AddQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT 
  addNewQuiz, 
  setQuizName, 
  quizName, 
  handleAddQuestion,
  formError,
  handleChange,
  questions,
  nextQuestion
}
) {

  //=============JSX RENDERING=============
  
  return (
    <div id='addQuiz'>
      <Row>
        <h2 className='h2'>ADD QUIZ</h2>
      </Row>
      {/* Form to add newQuiz */}
      <form onSubmit={addNewQuiz} id='newQuizForm'>
        <Row className='quizFormRow'>
          <Col xs={6} className='quizFormCol'>
          {/* Quiz Name Input */}
            <label className='addQuizLabel'>
              <p className='labelText'>QUIZ NAME:</p>
              <input
                className='quizInput'
                type='text'
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                autoComplete='off'
                placeholder='Quiz Name'
                required
              />
            </label>
          </Col>
        </Row>
        {/* Card to add a new question */}
        {questions.map((question, index) => (
          <div key={index} id='questionsInput' >
            <Row className='quizFormRow'>
              <Col xs={6} className='quizFormCol'>
              {/* Question Input */}
                <label className='addQuizLabel'>
                  <p className='labelText'>QUESTION:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='questionText'
                    value={question.questionText}
                    onChange={(e) => handleChange(index, e)}
                    autoComplete='off'
                    placeholder='QUESTION'
                    required
                  />
                </label>
              </Col>
              <Col xs={6} className='quizFormCol'>
                <label className='addQuizLabel'>
                  {/* Alternative question input */}
                  <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='options.0'
                    placeholder='OPTION 1'
                    value={question.options[0]}
                    autoComplete='off'
                    onChange={(e) => handleChange(index, e)}
                  />
                </label>
              </Col>
            </Row>
            <Row className='quizFormRow'>
              <Col xs={6}>
              {/* Correct answer input */}
                <label className='addQuizLabel'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='correctAnswer'
                    value={question.correctAnswer}
                    onChange={(e) => handleChange(index, e)}
                    autoComplete='off'
                    placeholder='CORRECT ANSWER'
                  />
                </label>
              </Col>
              <Col xs={6} className='quizFormCol'>
              {/* Alternative answer Input */}
                <label className='addQuizLabel'>
                  <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='options.1'
                    value={question.options[1]}
                    onChange={(e) => handleChange(index, e)}
                    placeholder='OPTION 2'
                    autoComplete='off'
                    required
                  />
                </label>
              </Col>
            </Row>
            <Row className='quizFormRow'>
              <Col xs={6}></Col>
              <Col xs={6} className='quizFormCol'>
              {/* Alternative answer Input */}
                <label className='addQuizLabel'>
                  <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                  <input
                    className='quizInput'
                    type='text'
                    name='options.2'
                    value={question.options[2]}
                    onChange={(e) => handleChange(index, e)}
                    autoComplete='off'
                    placeholder='OPTION 3'
                    required
                  />
                </label>
              </Col>
            </Row>
          </div>
        ))}
        {formError && (
          <Row>
            <Col>
              <p className='error'>{formError}</p>
            </Col>
          </Row>
        )}
        <Row className='quizFormRow'>
          <Col xs={6} md={8} className='quizFormCol'>
          </Col>
          <Col xs={6} md={4} className='quizFormCol'>
            <Button variant='primary' type="button" onClick={nextQuestion}>
              NEXT
            </Button>
            <Button 
            variant='primary' 
            type="button" 
            onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Col>
        </Row>      
        <Row>
          <Col xs={6} md={8}>
            <ul id='quizQuestionRules'>
              <li>
                <p className='labelText'>TOTAL OF 5 QUESTIONS ARE REQUIRED</p>
              </li>
              <li>
                <p className='labelText'>QUIZ NAME MUST BE RELATED TO QUESTION TYPES</p>
              </li>
            </ul>
          </Col>
          <Col xs={6} md={4}>
            <Button variant="primary" type="submit" id='addQuizBtn'>
              ADD QUIZ
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
}
