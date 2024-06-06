import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function MainHeader({mainHeading}) {
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
