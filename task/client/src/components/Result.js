import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Result({ score, questions }) {
  return (
    <Row>
      <Col md={12}>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score}/{questions.length}</p>
      </Col>
    </Row>
  );
}
