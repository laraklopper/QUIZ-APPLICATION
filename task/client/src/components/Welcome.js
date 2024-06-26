import React from 'react'
import '../CSS/Page1.css'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Welcome Function Component
export default function Welcome({error, currentUser}) {
  return (
    <div id='welcome'>
        <Row className='welcomeRow'>
        <Col xs={6}  >
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
