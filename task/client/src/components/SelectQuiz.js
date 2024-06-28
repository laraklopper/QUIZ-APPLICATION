import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function SelectQuiz(
    {
        quizList, 
        selectedQuiz
    }
) {
    //=========JSX RENDERING========
    
  return (
    <div>
          <Row>
              <Col>
                  <h2>SELECT QUIZ</h2>
              </Col>
          </Row>
        <form>
            <label>
                <p>SELECT:</p>
            </label>
            <select>
                {quizList.map((quiz, index) => (
                    <option key={index} value={JSON.stringify(quiz)}>
                        {selectedQuiz}
                    </option>
                ))}
            </select>
        </form>
    </div>
  )
}
