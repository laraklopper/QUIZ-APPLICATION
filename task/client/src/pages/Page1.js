// Import necessary modules and packages
import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';
import Welcome from '../components/Welcome';

//Page1 function component
export default function Page1(//Export default Page1 function component
  { //PROPS PASSED FROM PARENT COMPONENT 
    logout,
     error, 
     currentUser
    }
  ) {
 
//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database

//========JSX RENDERING================

  return (
    <>
    {/* HEADER */}
    <Header heading='HOME'/>
    <section id='page1Section1'>
      {/* Welcome message */}
      <Welcome currentUser={currentUser} error={error}/>
    </section>
    {/* Section2 */}
    <section className='section2'>
      <Row>
        <Col>
        <h2 className='h2'>PAST SCORES</h2>
        </Col>
      </Row>
        <Row>
          <Col xs={6} md={4}>
            <Button variant="primary" type='button' id='pastScoresBtn'>VIEW PAST SCORES</Button>
          </Col>
          <Col xs={12} md={8}>

          </Col>

        </Row>
    </section>
    <footer className='pageFooter'>
        <Row>
          <Col xs={12} md={8}>
          </Col>          
            <LogoutBtn logout={logout}/>
        </Row>
    </footer>
    </>
  )
}
