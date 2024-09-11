// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

//Header function component
export default function Header(
    {heading}//PROPS
) {
    
    //========JSX RENDERING============

  return (
    // Header component
    <header className='header'>
          <Row className='headingRow'>
              <Col className='headingCol'>
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
