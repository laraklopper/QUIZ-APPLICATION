// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button';//Import Bootstrap Button component

//Edit function component
export default function Edit(//Export the default Edit function component
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
        /*
        => index : the index of the question being updated
        =? event : the event object from the input change
        */
        // Extract the name and value from the event target (input field)
        const { name, value } = event.target;
        setNewQuestion(prevQuestions => {//Update the state with the newQuestion
            const updatedQuestions = [...prevQuestions]    // Create a shallow copy of the previous questions state
            // Conditional rendering to check if the input field is for question text or correct answer
            if (name === 'newQuestionText' || name === 'newCorrectAnswer') {
                // Directly update the corresponding field in the specific question
                updatedQuestions[index][name] = value
                // Conditional rendering to check if the input field is for an option (starts with 'newOptions')
            } else if (name.startsWith('newOptions')) {
                const optionIndex = parseInt(name.split('.')[1]);// Extract the option index from the name (e.g., 'newOptions.1' => 1)
                updatedQuestions[index].options[optionIndex] = value;// Update the specific option in the options array of the question

            }
            return updatedQuestions;    // Return the updated questions array to set the new state
        })
    };

    // Function to update a question
    const handleAddNewQuestion = () => {
        //Conditional rendering to check it the number of questions has reached its limit
        if (newQuestion.length >= 5) {
            alert('You cannot add more than 5 questions.');// Display an alert if the limit is reached
            return;    // Exit the function early to prevent adding more questions
        }
        setNewQuestion([
            ...newQuestion,// Spread the existing questions to keep them in the array
            //Add a new question object with empty fields
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
      {/* Map over the new questions */}
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
                          placeholder='OPTION2'
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
                {/* Button to edit a question */}
                <Button variant='primary' type='button' onClick={handleAddNewQuestion}>EDIT QUESTION</Button>
                </Col>
              </Row>
        </div>
      ))}
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
