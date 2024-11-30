// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
import Stack from 'react-bootstrap/Stack';// Import the Stack component from react-bootstrap

// Footer function component
export default function Footer(//Export default footer function component
  {//PROPS PASSED FROM PARENT COMPONENT
    logout
  }) {

  //==============JSX RENDERING=============

  return (
    // Footer
    <footer className='pageFooter'>
      <Row className='footerRow'>
        <Stack gap={3}>
          <div className="p-2"></div>
          <div className="p-2"></div>
        </Stack>
      </Row>
      <Row className='logoutRow'>
        <Stack direction="horizontal" gap={3} className='logoutStack'>
          <div className="p-2"></div>
          <div className="p-2 ms-auto"></div>
          <div className="p-2">  
            {/* Logout button */}
            <Button
              variant="warning"//Bootstrap variant
              type='button'//Specify the button type
              aria-label='logout button'//Accessibility label for the logout button
              id='logoutBtn'//Unique identifier
              onClick={logout}//Call the logout function to logout
            >
              LOGOUT
            </Button> 
            </div>
        </Stack>
          </Row>
    </footer> 
  )
}
