// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

//Header function component
export default function Header(//Export default Header function component
    {heading}//PROPS
) {
    
    //========JSX RENDERING============

  return (
    // Header component
    <header className='header'>
        <Row>
            <Col>
            {/* Heading after Login */}
            <h1 className='h1'>{heading}</h1>
            </Col>
        </Row>
        <Row className='navRow'>
            <Col className='navCol'>
            {/* Navigation */}
            <nav className='navigation'>
                {/* Unordered list to hold the navigation links */}
                <ul className='navbar'>
                    <li className='linkItem'>
                        {/* Link to HOME PAGE */}
                        <Link className='refLink' to='/'>
                        <p className='linkText'>HOME</p>
                        </Link>
                    </li>
                    <li className='linkItem'>
                        {/* Link to GAME PAGE */}
                        <Link className='refLink' to='/page2'>
                            <p className='linkText'>GAME</p>
                        </Link>
                    </li>
                    <li className='linkItem'>
                        {/* Link to ADD QUESTIONS page */}
                        <Link className='refLink' to='/page3'>
                            <p className='linkText'>ADD QUESTIONS</p>
                        </Link>
                    </li>
                    <li className='linkItem'>
                        {/* Link to USER ACCOUNT Page */}
                        <Link className='refLink' to="/page4">
                            <p className='linkText'>USER ACCOUNT</p>
                        </Link>
                    </li>
                </ul>
            </nav>
            </Col>
        </Row>
    </header>
  )
}
