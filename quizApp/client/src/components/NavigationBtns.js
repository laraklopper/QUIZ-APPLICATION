// Import necessary modules and packages
import React, { useCallback } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//NavigationBtn function component
export default function NavigationBtns(//Export default Navigation Button function component
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz,
        currentQuestionIndex,
        setCurrentQuestionIndex
    }) {
    //========EVENT LISTENERS==========
    //Function to handle navigation between questions
    const handleNavigation = useCallback((direction) => {
        // Conditional rendering to check if quiz questions are correctly defined
        if (!quiz.questions || !Array.isArray(quiz.questions)) {
            console.error('Quiz questions are not properly defined.');//Log an error message in the console for debugging purposes
        }
        // Handle previous question navigation
        if (direction === 'previous') {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prevIndex => prevIndex - 1);// Move to previous question
            } else {
                console.log('You are already at the first question.');//Log a message in the console for debugging purposes
            }
        } 
            // Handle next question navigation
        else if(direction === 'next'){
            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);// Move to next question
            } else {
                console.log('You are already at the last question');//Log a message in the console for debugging purposes
            }
        }
    },[currentQuestionIndex, quiz.questions, setCurrentQuestionIndex])

    //========JSX RENDERING=============
  return (
    <Row className='editQuizRow'>
        {/* Navigation buttons */}
          <Col  md={6}></Col>
          <Col md={3} className='editQuizCol' id='prevQuesBtnCol'>
              {/* Button to move to previous question */}
              <Button
                  variant='primary'//Bootstrap variant
                  onClick={() => handleNavigation('previous')}// Call handleNavigation with 'previous' direction
                  id='prevQuestionBtn'// Button identifier
                  type='button'//Specify the button type
                  aria-label='Move to Previous question'// Accessibility label for screen readers
                  disabled={currentQuestionIndex === 0}// Disable button if it's the first question
              >
                  PREVIOUS QUESTION
              </Button>
          </Col>
          <Col md={3} className='editQuizCol' id='nextQuesBtnCol'>
          {/* Button to move to next question */}
              <Button 
                  variant="primary" // Bootstrap variant 
                 type='button'//Specify the button type
                  id='nextQuestionBtn'// Button identifier
                  onClick={() => handleNavigation('next')}// Call handleNavigation with 'next' direction
                  disabled={currentQuestionIndex === quiz.questions.length - 1}// Disable button if it's the last question
                  aria-label='Move To next question'// Accessibility label for screen readers
              >
                NEXT QUESTION
            </Button>
          </Col>
    </Row>
  )
}
