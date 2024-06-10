import React from 'react';// Import the React module to use React functionalities
//Bootstrap
// Import Row and Col from react-bootstrap for layout
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

//MainHeader function component
export default function MainHeader(
  {mainHeading}//PROPS
) {
  return (
    <header className='header'>
        <Row>
            <Col>
                  <h1 className='h1'>{mainHeading}</h1>
            </Col>          
        </Row>
        <Row className='navRow'>
            <Col className='navCol'>
            <nav className='navigation'>
                <ul className='navBar'>
                    <li className='linkItem'>
                        <Link className='refLink' to="/">
                                  <p className='linkText'>LOGIN</p>
                        </Link>                       
                    </li>
                    <li className='linkItem'>
                        <Link className='refLink' to="/reg">
                            <p className='linkText'>REGISTRATION</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            </Col>
        </Row>
    </header>
  )
}
