import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Edit function component
export default function Edit(
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz, 
        newQuestion, 
        newQuizName, 
        setNewQuizName, 
        setNewQuestion, 
        editQuiz
    }
) {

    //==============EVENT LISTENERS======================

    // Function to changing question details
    const handleQuestionChange = (index, event) => {
        const { name, value } = event.target;
        setNewQuestion(prevQuestions => {
            const updatedQuestions = [...prevQuestions]
            if (name === 'newQuestionText' || name === 'newCorrectAnswer') {
                updatedQuestions[index][name] = value

            } else if (name.startsWith('option')) {
                const optionIndex = parseInt(name.split('.')[1]);
                updatedQuestions[index].options[optionIndex] = value;
            }
            return updatedQuestions
        })
    };

    // Function to update a question
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
    //==================JSX RENDERING============================


  return (
    <div>
        {/* EDIT QUIZ FORM */}
          <form className='editQuizForm' onSubmit={(event) => { event.preventDefault(); editQuiz(quiz._id); }}>
                <Row>
                  <Col xs={6} md={4}>
                      <label className='editQuizLabel'>
                          <p className='labelText'>NEW QUIZNAME:</p>
                          <input 
                          type='text'
                          className='editQuizInput'
                          name='newQuizName'
                          value={newQuizName}
                          onChange={(e) => setNewQuizName(e.target.value)}
                          placeholder='QUIZNAME'
                          autoComplete='off'
                          />
                      </label>
                  </Col>
                    <Col xs={12} md={8}>
                    </Col>
                
      </Row>
      {newQuestion.map((newQuestion, index)=> (
        <div key={index} id='editQuizInput'>
              <Row>
                  <Col xs={6} className='editQuizCol'>
                  <label className='editQuizLabel'>
                      <p className='labelText'>QUESTION:</p>
                      <input
                          type='text'
                              name='newQuestionText'
                          value={newQuestion.newQuestionText}
                              onChange={(e) => handleQuestionChange(index, e)}
                              autoComplete='off'
                              placeholder='QUESTION'

                      />
                  </label>
                  </Col>
                  <Col xs={6} className='editQuizCol'>
                      <label className='editQuizLabel'>
                          <p className='labelText'>1. ALTERNATIVE ANSWER:</p>
                          <input
                              type='text'
                              name='newOptions.0'
                              value={newQuestion.newOptions[0]}
                              onChange={(e) => handleQuestionChange(index, e)}
                              autoComplete='off'
                              placeholder='OPTION1'
                          />
                      </label>
                  </Col>
              </Row>
              <Row>
                  <Col xs={6}><label className='editQuizLabel'>
                      <p className='labelText'>CORRECT ANSWER:</p>
                      <input
                          type='text'
                          name='newCorrectAnswer'
                          value={newQuestion.newCorrectAnswer}
                          onChange={(e) => handleQuestionChange(index, e)}
                          autoComplete='off'
                          placeholder='CORRECT ANSWER'
                      />
                  </label></Col>
                  <Col xs={6}><label className='editQuizLabel'>
                      <p className='labelText'>2. ALTERNATIVE ANSWER:</p>
                      <input
                          type='text'
                          name='newOptions.1'
                          value={newQuestion.newOptions[1]}
                          onChange={(e) => handleQuestionChange(index, e)}
                          autoComplete='off'
                          placeholder='OPTION 2'
                      />
                  </label></Col>
              </Row>
              <Row>
                  <Col xs={6}></Col>
                  <Col xs={6}><label className='editQuizLabel'>
                      <p className='labelText'>3. ALTERNATIVE ANSWER:</p>
                      <input
                          type='text'
                          name='newOptions.2'
                          value={newQuestion.newOptions[2]}
                            onChange={(e) => handleQuestionChange(index, e)}
                            autoComplete='off'
                            placeholder='OPTION 3'
                      />
                  </label></Col>
              </Row>
              <Row>
                  <Col xs={12} md={8}>
                  </Col>
                <Col>
                <button type='button' onClick={handleAddNewQuestion}>EDIT QUESTION</button>
                </Col>
              </Row>
        </div>
      ))}
      <div>
                  <Row>
                      <Col xs={12} md={8}>
                      </Col>
                      <Col xs={6} md={4}>
                         <button type='submit'>EDIT</button>
                      </Col>
                  </Row>     
                  
                 
      </div>
             
        </form>
    </div>
  )
}
