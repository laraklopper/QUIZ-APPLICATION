// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// UserViewBtn component
export default function UserViewBtn(
    { // PROPS PASSED FROM PARENT COMPONENT
        toggleViewUsers, 
        viewingUsers 
    }
    ) {
    
    //========JSX RENDERING==========

    return (
        <Col>
            {/* Button to toggle the display of all users */}
            <Button
                variant={viewingUsers ? 'secondary' : 'primary'}
                type='button'
                onClick={toggleViewUsers}
                id='userDisplayBtn'
                >
                {viewingUsers ? 'HIDE USERS' : 'VIEW USERS'}
            </Button>
        </Col>
    );
}
