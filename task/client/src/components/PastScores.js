// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button'; 


//PastScores function component
export default function PastScores(
  {// PROPS PASSED FROM PARENT COMPONENT
    fetchScores, 
    userScores
  }
  ) {


  //==========JSX RENDERING==================
  return (
    <div>
      {/* Button to trigger fetching past scores */}
        
        <Button variant='primary' type='button' onClick={fetchScores}>
          FETCH SCORES
          </Button>
          {/* Conditional rendering to check if there are scores to display */}
          {userScores.length > 0 ? (
              <DropdownButton id="dropdown-basic-button" title="PAST SCORES">
          {/* Map through past scores and display them in the dropdown*/}
            {userScores.map((score, index) => (
            <Dropdown.Item 
            key={index}>
              {score.quizName}: {score.score}
              </Dropdown.Item>
          ))}
          </DropdownButton>
          ):(
          // Display a message if no scores are available
            <p className='scoreError'>NO SCORES AVAILABLE</p>
          )}        
    </div>
  )
}
