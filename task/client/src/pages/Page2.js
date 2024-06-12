import React from 'react'
//Components
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//Page 2 function component
export default function Page2({logout}) {

    //======JSX RENDERING==========
  return (
    <>
    {/* Header */}
    <Header heading="GAME"/>
    {/* section 1 */}
    <section className='section1'>

    </section>
    <footer>
     <Row>
          <Col xs={12} md={8}>
          </Col>
          <LogoutBtn logout={logout}/>
     </Row>
     
    </footer>
    </>
  )
}
