import React from 'react'// Import the React module to use React functionalities
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap

//Form Headers function component
export default function FormHeaders(
    {formHeading}
) {

    //==========JSX RENDERING===========
  return (
    <Row>
        <Col>
        <h2 className='h2'>{formHeading}</h2>
        </Col>
    </Row>
  )
}
