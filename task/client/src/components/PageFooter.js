import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Rules from './Rules';

//PageFooter function component
export default function PageFooter() {
  
    //=====JSX RENDERING===========
  return (
    // PageFooter
    <footer className='pageFooter'>
          <Row className='rulesRow'>
              <Col xs={12} md={8} className='rulesCol'>
              <h3 className='rulesHeading'>RULES:</h3>
              </Col>
              <Col xs={6} md={4} className='rulesCol'>
              </Col>
          </Row>
          <div>
            {/* Application Rules */}
            <Rules/>
          </div>
    </footer>
  )
}
