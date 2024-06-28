import React from 'react'
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button';//Import Bootstrap Button component

//Edit User function component
export default function EditUser(
  {//PROPS PASSED FROM PARENT COMPONENT 
        editUserData, 
        handleInputChange, 
        editUser
    }
){

  //=========EVENT LISTENERS================
  const handleUpdate = (e) => {
    e.preventDefault()
    console.log('Edit user account');
    editUser()
  }
  
    //===================JSX RENDERING===============
  return (
        <div>
          <Row>
            <Col><h3 className='h3'>EDIT ACCOUNT</h3></Col>
          </Row>
          <form onSubmit={handleUpdate}>
            <Row className='editUserRow'>
              <Col xs={6} className='editUserCol'>
              <label className='editUserLabel'>
                <p className='labelText'>USERNAME:</p>
                <input
                type='text'
                name='editUsername'
                value={editUserData.editUsername}
                onChange={handleInputChange}
                autoComplete='off'
                placeholder='New Username'
                />
              </label>
              </Col>
              <Col xs={6}> <label className='editUserLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                  type='email'
                  name='editUserEmail'
                  value={editUserData.editUserEmail}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='New Email'
                />
              </label>
              </Col>
            </Row>
              <Row>
                  <Col xs={12} md={8}>
                  </Col>
                  <Col xs={6} md={4}>
                      <Button variant="warning" type='submit'>EDIT ACCOUNT</Button>
                  </Col>
              </Row>
          </form>
        </div >
  )
}
