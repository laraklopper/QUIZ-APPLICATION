import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
