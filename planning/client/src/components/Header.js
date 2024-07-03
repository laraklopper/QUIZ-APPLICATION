import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Header function component
export default function Header({heading}) {
  return (
    <header>
        <Row>
            <Col>
            <h1 className='h1'>{heading}</h1>
            </Col>
        </Row>
    </header>
  )
}
