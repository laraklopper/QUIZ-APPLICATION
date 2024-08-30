import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button'; 


//PastScores function component
export default function PastScores({fetchScores, scores}) {

  //==========JSX RENDERING==================
  return (
    <div>
        {/* Map through past scores*/}
        <Button variant='primary' onClick={fetchScores}>FETCH SCORES</Button>
          {scores.length > 0 ? (
              <DropdownButton id="dropdown-basic-button" title="PAST SCORES">
          {scores.map((score, index) => (
            <Dropdown.Item key={index}>{score.quizName}: {score.score}</Dropdown.Item>
          ))}
          </DropdownButton>
          ):(
            <p>NO SCORES available</p>
          )}        
    </div>
  )
}
