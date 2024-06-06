import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rules from './Rules'

export default function PageFooter() {
  return (
    <footer className='pageFooter'>
          <Row className='footerRow'>
              <Col xs={6} className='col'>
                  <Rules />
              </Col>
              <Col xs={6}  className='col'>
              </Col>
          </Row>        
    </footer>
  )
}
