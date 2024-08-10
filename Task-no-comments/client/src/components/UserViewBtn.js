// Import necessary modules and packages
import React from 'react'
//Bootstrap
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 

//UserViewBtn function component
export default function UserViewBtn(
    {//PROPS PASSED FROM PARENT COMPONENT 
        toggleViewUsers
    }
) {

    //===================JSX RENDERING===============
    
  return (
    
          <Col>
              {/* Button to display all users */}
              <Button
                  variant='primary'
                  type='button'
                  onClick={toggleViewUsers}
                  id='userDisplayBtn'>
                  VIEW USERS
              </Button>
          </Col>
  )
}
