import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';

//Page 4 function component
export default function Page4() {
    //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  //--------DELETE----------------
  // Function to delete user

  //=======JSX RENDERING==============
  return (
   <>
    <Header heading='USER ACCOUNT'/>
    <secton className="section1">
        <Row>
          <Col xs={6} md={4}>
          <p>USERNAME:</p>  {/*userData.username  */}
          </Col>
          <Col xs={6} md={4}>
            <p>EMAIL:</p>{/*userData.email */}
          </Col>
          <Col xs={6} md={4}>
          <p>DATE OF BIRTH:</p>  {/* userData.DateOfBirth */}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
          <p>ADMIN:</p>  {/* Boolean to state if user is admin or not userData.admin*/}
          </Col>
          <Col xs={6} md={4}>
            <Button variant="primary">EDIT ACCOUNT</Button>
          </Col>
        </Row>
    </secton>
    {/* Footer */}
    <footer>
      <Row>
          <Col xs={12} md={8}>
          </Col>
          <LogoutBtn 
          logout={logout}
          />
      </Row>        
    </footer>
    </>
  )
}
