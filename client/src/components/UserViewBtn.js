// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

// UserViewBtn component
export default function UserViewBtn(//Export the default UserViewBtn function component
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
                //Change the text and bootstrap variant if the user is not authorised to view all users
                variant={isUnauthorized  ? 'danger': (viewingUsers ? 'secondary' : 'primary')}
                type='button' 
                onClick={toggleViewUsers} // Call the toggleViewUsers event handler
                id='userDisplayBtn'
                aria-label='View Users'
                >
                {/* Button text changes based on viewingUsers state */}
                {isUnauthorized ? 'UNAUTHORIZED' : (viewingUsers ? 'HIDE USERS' : 'VIEW USERS')}                
            </Button>
        </Col>
    );
}
