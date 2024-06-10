import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import { Link } from 'react-router-dom';// Import Link from react-router-dom for navigation


//Header function component
//Take the Heading component as a prop
export default function Header(heading) {//Export default Header function component
  return (
    <header>
        <Row>
            <Col>
            <h1 className='h1'>
                {heading}
            </h1>
            </Col>
        </Row>
        <Row>
            <Col>
            <nav>
              <ul>
                <li>
                  <Link to="/" className='refLink'>
                    <p className='linkText'>HOME</p>
                  </Link>
                </li>
              </ul>
            </nav>
            </Col>
        </Row>
    </header>
  )
}
