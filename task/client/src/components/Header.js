import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function Header(heading) {
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
