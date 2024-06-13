import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



export default function AddQuiz() {
 

  //========JSX RENDERING===================

  return (
    <div>
      <Row>
        <Col>
        <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      <form>
        <Row>
          <Col xs={6}>
          <label>
            <p>QUIZ NAME:</p>
            <input/>
          </label>
          </Col>
          <Col xs={6}>
          <label>
            <p>USERNAME:</p>
            <input/>
          </label>
          </Col>

        </Row>
        <div>
          <
        </div>
      </form>
    </div>
  )
}
