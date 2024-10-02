// Import necessary modules and packages
// Import the React module to use React functionalities
import React, { useEffect, useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 

//EditQuiz function component
export default function EditQuiz(//Export default editQuiz Function component
  {//PROPS PASSED FROM PARENT COMPONENT
    quiz, 
    setQuizList, 
    quizList,
    editQuizIndex,
    setEditQuizIndex,
    editQuiz,
    setNewQuizName,
    newQuizName,
    newQuestions,
    setNewQuestions,
  }
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 


  //=========USE EFFECT HOOK==================
  /* Effect to initialize and update the editQuizIndex state when 
  quiz or currentQuestionIndex changes*/
  useEffect(() => {
    if (quiz) {
      setEditQuizIndex({
        editQuestionText: quiz.questions[currentQuestionIndex]?.questionText || '',
        editCorrectAnswer: quiz.questions[currentQuestionIndex]?.correctAnswer || '',
        editOptions: quiz.questions[currentQuestionIndex]?.options || ['', '', '']
      })
    }
  }, [quiz, currentQuestionIndex, setEditQuizIndex])

  //============EVENT LISTENERS=================

  // Function to edit a question
const handleEditQuestion = () => {
    // if (newQuestions.length === 0) {     
    //   alert('No questions to update');
    //   return;// Exit the function
    // }
  
    if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');
    return;// Exit the function 
  }
/*
   //Conditional rendering to check if the quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    console.log('No questions available to update');
      return;// Exit if there are no questions to update
    }
  if (currentQuestionIndex >= quiz.questions.length) {
    console.error('Invalid Question Index');
    // alert('Invalid question Index');
    return;// Exit if index is invalid
  }*/
  const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions); 
    setQuizList(
      quizList.map(q =>
        q._id === quiz._id 
          ? { ...q, questions: updatedQuestions, name: newQuizName } 
          : q  
      ));
  };

  const handleOptionChange = (index, value) => {
  const updatedOptions = [...editQuizIndex.editOptions];
  updatedOptions[index] = value;
  setEditQuizIndex({ ...editQuizIndex, editOptions: updatedOptions });
};

   //==================CONDITIONAL RENDERING=================
  // Display a loading message if quiz data isn't available yet
  if (!quiz || !Array.isArray(quiz.questions)) {
    return <div>Loading...</div>;
  }

  //Conditional rendering to check if the currentQuestion index is valid
  if (currentQuestionIndex >= quiz.questions.length) {
    return <div>Invalid question index</div>
  }
  //==============JSX RENDERING====================
  
  return (
    <div id='editQuizForm'>      
      <Row className='formRow'>
        <Col>
        {/* Heading for editQuiz section */}
          <h2 className='h2' id='quizEditHead'>EDIT QUIZ</h2>
        </Col>
      </Row>
      {/* Form to edit quiz */}
      <form onSubmit={(e) =>{ e.preventDefault(); editQuiz(quiz._id)}}>
        <Row className='editQuizRow'>
          <Col xs={6} md={4} className='editQuizCol'>
          <div className='editField'>
              {/* Edit quiz name */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUiZ NAME:</p>
          </label>
              {/* Edit quizName input field */}
            <input
              type='text'
              name='newQuizName'
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
              autoComplete='off'
              placeholder={quiz.name}
              id='newQuizName'
              className='editQuizInput'
            />  
            </div>
          </Col>
          <Col xs={12} md={8} className='editQuizCol'></Col>
        </Row>
        <div className='editQuestions'>
           <Row>
          <Col className='editQuestionHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
          <Row>
            <Col xs={6} className='editQuizRow'>
            <div className='editField'>
                <label className='editQuizLabel' htmlFor='editQuestion'>
                  {/* Label for question input */}
                  <p className='labelText'>QUESTION:</p>
                </label>
                {/* New question input */}
                <input
                  type='text'
                  name='editQuestionText'
                  value={editQuizIndex.editQuestionText} 
                  onChange={(e) =>
                    setEditQuizIndex({
                      ...editQuizIndex,
                      editQuestionText: e.target.value, 
                    })}
                  autoComplete='off'
                  placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
                  id='editQuestion'
                  className='editQuizInput'
                />        
            </div>
            </Col>
            <Col xs={6} className='editQuiz'> 
            {/* Edited correct answer */}
              <div className='editField'>
                <label className='editQuizLabel' htmlFor='editAnswer'>
                  <p className='labelText'>CORRECT ANSWER:</p>
                </label>
                {/* New correct answer input */}
                <input
                  type='text'
                  name='editCorrectAnswer'
                  value={editQuizIndex.editCorrectAnswer}
                  onChange={(e) => setEditQuizIndex({
                    ...editQuizIndex,
                    editCorrectAnswer: e.target.value,
                  })}
                  autoComplete='off'
                  placeholder={quiz.questions[currentQuestionIndex]
                    ?.correctAnswer || ''}
                  id='editAnswer'
                  className='editQuizInput'
                />
              </div>          
             </Col>
          </Row>
          {/* Input for each option */}
              {editQuizIndex.editOptions.map((option, idx) => (
                <Col xs={6} key={idx} className="editQuizCol">
                  <OptionInput
                    index={idx + 1}
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={quiz.questions[currentQuestionIndex]?.options[idx] || ''}
                  />
                </Col>
              ))}

          {[0, 1, 2].map((optionIndex) => (
            <Row className='editQuizRow' key={optionIndex}>
              <Col xs={6}  className='editQuizCol'>
              <div className='editField'>             
              <label className='editQuizLabel'>
                <p className='labelText'>ALTERNATIVE ANSWER:</p>
              </label>
              {/* Input for new option */}
                <input
                  type='text'
                    name={`editOption${optionIndex + 1}`}
                    value={editQuizIndex.editOptions[optionIndex]}
                  onChange={(e) => {
                    const updatedOptions = [...editQuizIndex.editOptions];
                    updatedOptions[optionIndex] = e.target.value;  
                    setEditQuizIndex({ ...editQuizIndex, editOptions: updatedOptions });
                  }}
                    placeholder={quiz.questions[currentQuestionIndex]?.options[optionIndex] || ''}
                    id={`editOption${optionIndex + 1}`}
                  className='editQuizInput'                  
                />
                </div>  
              </Col>
            </Row>
          ))}
          <Row className='editQuizRow'>
            {/* BUTTONS */}
            <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to edit question */}
              <Button
                variant='primary'
                onClick={handleEditQuestion}
                className='editQuestionBtn'
              >
                EDIT QUESTION
              </Button>
            </Col>
            <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to previous question */}
              <Button
                variant='secondary'
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                  }
                }}
                className='previousQuestionBtn'
              >
                PREVIOUS QUESTION
              </Button>
            </Col>
            <Col xs={6} md={4} className='editQuizCol'>
              {/* Button to move to next question */}
              <Button
                variant='secondary'
                onClick={() => {
                  if (currentQuestionIndex < quiz.questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1); 
                  }
                }}
                className='nextQuestionBtn'
              >
                NEXT QUESTION
              </Button>
            </Col>
          </Row>
          </div>
          <div className='editQuiz'>
          <Row className='editQuizRow'>
            <Col xs={12} className='editQuizCol'>
              {/* Button to edit quiz */}
              <Button
                variant='primary'
                type='submit'
                id='editQuizBtn'
              >
                EDIT QUIZ
              </Button>
            </Col>
          </Row>
        </div>
      </form>
    </div>
  );
}
