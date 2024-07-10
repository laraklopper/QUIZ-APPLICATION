// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';//Import Bootstrap Button component

//Edit function component
export default function Edit(//Export the default Edit function component
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz, 
        // newQuestion, 
        newQuizName, 
        setNewQuizName, 
        // setNewQuestion, 
        editQuiz
    }
) {

    //==============EVENT LISTENERS======================
/*
    // Function to changing question details
    const handleQuestionChange = (index, event) => {
        const { name, value } = event.target;
        setNewQuestion(prevQuestions => {
            const updatedQuestions = [...prevQuestions]    
            if (name === 'newQuestionText' || name === 'newCorrectAnswer') {
                updatedQuestions[index][name] = value
            } 
            else if (name.startsWith('newOptions')) {
                const optionIndex = parseInt(name.split('.')[1]);
                updatedQuestions[index].options[optionIndex] = value;

            }
            return updatedQuestions;
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
    };*/
    //==================JSX RENDERING============================


  return (
    <div>
        {/* EDIT QUIZ FORM */}
          <form className='editQuizForm' onSubmit={(event) => { event.preventDefault(); editQuiz(quiz._id); }}>
                <Row className='editQuizRow'>
                  <Col xs={6} md={4} className='editQuizCol'>
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
      {/* Map over the new questions */}
     
      <div>
                  <Row>
                      <Col xs={12} md={8}>
                      </Col>
                      <Col xs={6} md={4}>
                      {/* Button to edit the quiz */}
                          <Button variant="primary" type='submit'>EDIT</Button>
                      </Col>
                  </Row>     
      </div>
        </form>
    </div>
  )
}
