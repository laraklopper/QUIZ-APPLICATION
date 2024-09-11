// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

//MainHeader function component
export default function MainHeader(//Export default MainHeader function component
    {//Props
        mainHeading
    } 
    ) {

    //========JSX RENDERING==========

 return (
    // Header for the Login and Registration pages
      <header className='header'>
        {/* Heading Row */}
          <Row className='headingRow'>
              <Col className='heaingCol'>
              {/* MainHeading of the page*/}
                  <h1 className='h1'>{mainHeading}</h1>
              </Col>
          </Row>
          <Row className='navRow'>
              <Col className='navCol'>
              {/* NavigationBar */}
                  <nav className='navigation'>
                      <ul className='navbar'>
                          <li className='linkItem'>
                            {/* Link to Login Page */}
                              <Link className='refLink' to='/'>
                                  <p className='linkText'>
                                    LOGIN
                                </p>
                              </Link>
                          </li>
                          <li className='linkItem'>
                            {/* Link to Registration Page */}
                              <Link className='refLink' to='/reg'>
                                  <p className='linkText'>
                                    REGISTRATION
                                </p>
                              </Link>
                          </li>
                      </ul>
                  </nav>
              </Col>
          </Row>
      </header>
  )
}
