import React, { useState } from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';

//Page 4 function component
export default function Page4({logout, userData}) {
  //======STATE VARIABLES====
 const [editUserData, setEditUserData] = useState({
  editUsername: ' ',
  editUserEmail: ''
 })
 const [updateUser, setUpdateUser] =  useState(false)
 const [userToUpdate, setUserToUpdate] = useState(null)
  //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  // const editUser = async () => {

  // }
  //--------DELETE----------------
  // Function to delete user

  //======EVENT LISTENERS============

  const handleInputChange = (event) => {
    const {name, value} = event.target
    setEditUserData((prevData) => ({
      ...prevData,
      [name] : value,
    }))
  }

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
          {/* Button to toggle edit user account */}
            <Button variant="primary" type='button' id='toggleUserEdit'>EDIT ACCOUNT</Button>
          </Col>
        </Row>
        {/* EDIT ACCOUNT */}
        <div>
          <Row>
            <Col><h3 className='h3'>EDIT ACCOUNT</h3></Col>
          </Row>
          <form>
            <Row>
              <Col xs={6}>
              <label className='editUserLabel'>
                <p className='labelText'>USERNAME:</p>
                <input
                type='text'
                name='editUsername'
                value={editUserData.editUsername}
                onChange={handleInputChange}
                />
              </label>
              </Col>
              <Col xs={6}> <label className='editUserLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                  type='email'
                  name='editEmail'
                  value={editUserData.editUserEmail}
                  onChange={handleInputChange}
                />
              </label>
              </Col>
            </Row>

          </form>
        </div>
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
