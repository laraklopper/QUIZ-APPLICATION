import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Footer function component
export default function Footer(
  {//PROPS PASSED FROM PARENT COMPONENT
    logout
  }) {

  //==============JSX RENDERING=============

  return (
    <footer className='pageFooter'>
          <Row>
              <Col xs={12} md={8}></Col>
              <Col xs={6} md={4}>             
              {/* Logout button */}
                <Button 
                  variant="warning" 
                  type='button' 
                  onClick={logout}
                  >
                    LOGOUT
                  </Button>          
              </Col>
          </Row>
    </footer> 
  )
}
