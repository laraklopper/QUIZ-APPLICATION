import React from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Welcome Function Component
export default function Welcome(//Export default Welcome function component
  {//PROPS PASSED FROM PARENT COMPONENT 
    error, 
    currentUser
  }) {

  //================JSX RENDERING==================
  return (
    <div id='welcome'>
        <Row className='welcomeRow'>
        <Col xs={6}  >
        {/* Display error message if the username is not found */}
                  {error ? (
                    <p>{error}</p>
                  ):(
                    // Welcome message
                    <div id='welcomeMsg'>
                      <label id='welcomeLabel'>
                        <h2 id='welcomeHeading'>WELCOME:</h2>
                        <h3 id='username'> {currentUser?.username}</h3>
                      </label>
                    </div>
                  )}
              </Col>
        {/* Instructions */}
      <Col xs={6} id='instructions'>
                  <h2 id='instructionsHeading'>HOW TO PLAY:</h2>
                  {/* Explain how the application works */}
          <ul id='instructText'>
                    <li className='instruction'>Select a quiz from the list</li>
                  </ul>
              
              </Col>
        </Row>
    </div>
  )
}
