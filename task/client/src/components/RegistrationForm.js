import React from 'react'
//Bootstrap
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//RegistrationForm function component
export default function RegistrationForm(
    {//PROPS PASSED FROM PARENT COMPONENT
    handleRegistration, 
    newUserData, 
    handleInputChange
 }
) {

//=========JSX RENDERING===========

  return (
    // Registration form
    <form id='registrationForm' onSubmit={handleRegistration}>
          <Row className='regisRow'>
              <Col xs={6} md={4} className='regisCol'>
              {/* New Username Input */}
                  <label className='regisLabel'>
                    <p className='labelText'>USERNAME:</p>
                    <input
                    className='regisInput'
                    type='text'
                    name='newUsername'
                    value={newUserData.newUsername}
                    onChange={handleInputChange}
                    placeholder='USERNAME'
                    autoComplete='off'
                    required
                    />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
              {/* New Email Input */}
                  <label className='regisLabel'>
                      <p className='labelText'>EMAIL:</p>
                      <input
                          className='regisInput'
                          type='email'
                          name='newEmail'
                          value={newUserData.newEmail}
                          onChange={handleInputChange}
                          placeholder='Enter Email'
                          autoComplete='off'
                          required
                           />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  <label className='regisLabel'>
                    {/* New Date of Birth Input */}
                      <p className='labelText'>DATE OF BIRTH:</p>
                      <input
                          className='regisInput' 
                          type='date'
                          name='newDateOfBirth'
                          value={newUserData.newDateOfBirth}
                          onChange={handleInputChange}
                          placeholder='dd/mm/yyyy'
                          required
                          
                          />
                  </label>
              </Col>
          </Row>
          <Row className='regisRow'>
              <Col xs={6} md={4} className='regisCol'>
                  {/* New Password Input */}
                  <label className='regisLabel'>
                      <p className='labelText'>PASSWORD:</p>
                      {/*Password middleware*/}
                      <input
                          className='regisInput' 
                          type='password'
                          name='newPassword'
                          value={newUserData.newPassword}
                          onChange={handleInputChange}
                          placeholder='Password'
                          autoComplete='current-password'
                          required
                          />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  {/* Admin Input */}
                  <label id='regisLabelCheckBox'>
                      <p className='labelText'>REGISTER AS ADMIN:</p>
                      <input
                          id="adminCheckbox"
                          type='checkbox'
                          checked={newUserData.newAdmin}
                          onChange={handleInputChange}
                          name='newAdmin'
                      />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
                  {/* Registration Button */}
                  <Button variant="primary"type='submit' id='registrationBtn'>
                    REGISTER
                  </Button>
              </Col>
          </Row>
    </form>
  )
}
