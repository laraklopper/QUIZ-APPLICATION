import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';

//Page1 function component
export default function Page1({  logout, error, currentUser}) {
 
//=============REQUESTS===================
//---------------GET---------------------
//Function to display the Scores list from the database

//========JSX RENDERING================

  return (
    <>
    <Header heading='HOME'/>
    <section>
        <Row>
          <Col xs={6} md={4}>
          {error ? (
            // Display error message if username is not found
            <p id='errorMessage'>{error}</p>
          ):(
            <div>
              <h2 className='h2'>WELCOME:{currentUser?.username}</h2>
            </div>
          )
           }                
          
            <div>
              <h2>HOW TO PLAY:</h2>
              {/* Explain how the application works */}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            </div>
          </Col>
          <Col xs={6} md={4} >
          <button>
            {/* toggle button to fetch scores */}
          </button>
          </Col>
            <Col xs={6} md={4}>         
            {/* display the scores list from the database */}
            </Col>
        </Row>
    </section>
    <footer className='footer'>
        <Row>
          <Col xs={12} md={8}>
          </Col>          
            <LogoutBtn logout={logout}/>
        </Row>
    </footer>
    </>
  )
}
