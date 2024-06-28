import React from 'react'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export default function LogoutBtn({logout}) {
  return (
    <Col xs={6} md={4}>
          <Button variant="warning" onClick={logout}>LOGOUT</Button>
    </Col>
  )
}
