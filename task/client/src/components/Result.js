import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

//Result function component
export default function Result(
  {//PROPS PASSED FROM PARENT COMPONENT
    score, 
    addScore,
    totalQuestions
  }
) {

  const handleSubmitScore = (e) => {
    e.preventDefault()
    addScore()
  }
  //===========JSX RENDERING==============
  
  return (
    <div>
      <form onSubmit={handleSubmitScore}>
      <Row>
        <Col md={12} id='resultsCol'>
          {/* Display the result with the score and total questions */}
          <label>RESULT</label>
          <input
          id='resultOutput'
          type='text'
          value={`${score} OF ${totalQuestions}`}
          readOnly
          className='form-Control'
          aria-live='polite'/>
        </Col>
      </Row>  
      <Row>
        <Col xs={6} md={4}></Col>
        <Col xs={6} md={4}>
          {/* Button to exit quiz and save the score to the database */}
        <Button
          variant='primary'
          type='submit'
          aria-label='Exit quiz and save score'
        >
          EXIT AND SAVE
          </Button>
        </Col>
        <Col xs={6} md={4}></Col>
      </Row>
      </form>
    </div>
  )
}
