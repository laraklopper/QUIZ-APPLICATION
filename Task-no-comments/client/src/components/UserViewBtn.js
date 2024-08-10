import React from 'react'
//Bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//UserViewBtn
export default function UserViewBtn(
    {
        toggleViewUsers
    }
) {
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
