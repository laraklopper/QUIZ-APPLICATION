import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//RegistrationRules function component
export default function RegistrationRules() {

    //==========JSX RENDERING=============
  return (
    <div>
          <Row>
              <Col xs={12} md={8}>
                  <ul className='rulesList'>
                      <li className='rule'>
                        THE USERNAME DOES NOT HAVE TO BE THE USERS REAL NAME
                        </li>
                      <li className='rule'>
                        USERNAME AND PASSWORD MUST BE UNIQUE
                        </li>
                      <li className='rule'>
                        PASSWORDS MUST BE AT LEAST 8 CHARACTERS
                        </li>
                      <li className='rule'>
                        USERS MAY ONLY ON INITIAL REGISTRATION REGISTER AS AN 
                        ADMIN USER
                    </li>
                  </ul>             
                 </Col>
              <Col xs={6} md={4}>
              </Col>
          </Row>
    </div>
  )
}
