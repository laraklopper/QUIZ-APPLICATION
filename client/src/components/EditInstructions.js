// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row'; // Bootstrap Row component for layout
import Col from 'react-bootstrap/Col'; // Bootstrap Col component for layout
import Button from 'react-bootstrap/Button';// Import Button component from react-bootstrap

//EditInstructions function component
export default function EditInstructions() {//Export defaualt EditInstructions component
    //==========STATE VARIABLES================
    // State to control whether the instructions for editing the quiz are visible or not
    const [showEditInstruct, setShowEditInstruct] = useState(false);

    //==========EVENT LISTENERS=================
    // Function to toggle visibility of the edit instructions
    const toggleInstructions = () => {
        setShowEditInstruct(!showEditInstruct); // Toggle the state value between true and false
    }

    //============JSX RENDERING==============
  return (
    <div id='editQuizInstructions'>
        <Row className='instructRow'>
              <Col xs={12} md={8}></Col>
              <Col xs={6} md={4} id='editInstructBtnCol'>
              {/* Toggle button to display instructions */}
                  <Button 
                      variant='primary' //Bootstrap variant
                      onClick={toggleInstructions} // Event listener to toggle the instructions
                      type='button' // Specifies the type of the button
                      id='editInstructionsBtn'// Unique identifier for styling or testing
                  >
                      {/* Button text changes based on showEditInstruct state */}
                    {showEditInstruct ? 'HIDE INSTRUCTIONS' : 'HOW TO EDIT A QUIZ'}
                </Button>
              </Col>
        </Row>
          <Row className='instructRow'>
              <Col xs={12} md={8} >
                  {/* Conditional rendering to display instructions 
                  if showEditInstruct state is true */}
                    {showEditInstruct &&
                      <div id='editInstructions'>
                                <ol className='editInstruct'>
                                    <li className='instruct'>
                                        Select the quiz to edit
                                    </li>
                                    <li className='instruct'>
                                        Edit the question and click EDIT QUESTION
                                    </li>
                                    <li className='instruct'>
                                        Click on EDIT QUIZ AND SAVE
                                    </li>
                                </ol>
                                <ul id='authMessage'>
                                    <li className='instruct'>
                                        <h6 className='h6'>
                                            USERS ARE ONLY AUTHORISED TO EDIT A QUIZ IF THEY CREATED IT OR ARE ADMIN USERS
                                        </h6>
                                    </li>
                                </ul>
                            </div>
                    }     
              </Col>
              <Col xs={6} md={4}></Col>
          </Row>
    </div>
  )
}
