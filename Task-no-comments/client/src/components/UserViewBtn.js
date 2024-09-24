// Import necessary modules and packages
// Import the React module to use React functionalities
import React from 'react';
//Bootstrap
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';


// UserViewBtn component
export default function UserViewBtn(
    { // PROPS PASSED FROM PARENT COMPONENT
        toggleViewUsers, 
        viewingUsers,
        isUnauthorized 
    }
    ) {
    
    //========JSX RENDERING==========

    return (
        <Col>
            {/* Button to toggle the display of all users */}
            <Button
                // Change button variant based on viewingUsers state
                variant={isUnauthorized  ? 'danger': (viewingUsers ? 'secondary' : 'primary')}
                type='button' // Specify the button type
                onClick={toggleViewUsers} // Attach the click event handler
                id='userDisplayBtn'// Set the button ID
                >
                {/* Button text changes based on viewingUsers state */}
                {isUnauthorized ? 'UNAUTHORIZED' : (viewingUsers ? 'HIDE USERS' : 'VIEW USERS')}                
            </Button>
        </Col>
    );
}
