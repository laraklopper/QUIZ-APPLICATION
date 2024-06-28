// Import necessary modules and packages
import React, { useState } from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//LoginForm function component
export default function LoginForm(
  {//PROPS PASSED FROM PARENT COMPONENT
    handleLogin, 
    handleUserLogin, // Event listener to handle user Login
    userData
  }
) {
  //=========STATE VARIABLES===============
const [showPassword, setShowPassword] = useState(false)
  //============JSX RENDERING================

  return (
    // Form for user login
    <form id='loginForm' onSubmit={handleLogin}>
      <div id='loginDetails'>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Username input */}
          <label className='loginLabel'>
            <p className='labelText'>USERNAME:</p>
            <input
              className='loginInput'
              type='text'
              name='username'
              value={userData.username}
              onChange={handleUserLogin}
              autoComplete='off'
              placeholder='USERNAME'
            />
          </label>
        </Col>
      </Row>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Password Input */}
          <label className='loginLabel'>
            <p className='labelText'>PASSWORD:</p>
            <input
              className='loginInput'
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={userData.password}
              onChange={handleUserLogin}
              autoComplete='current-password'
              placeholder='PASSWORD'
            />
            <div id='showPassword'>   
             {/* Button to display password */}
              <Button variant='success'
                type='button'
                id='passwordDisplayBtn'
                onMouseDown={(e) => { e.preventDefault(); setShowPassword(true); }}
                onMouseUp={(e) => { e.preventDefault(); setShowPassword(false);}}>
                  {showPassword ? 'HIDE PASSWORD' : 'SHOW PASSWORD'}
                </Button>
              </div>
          </label>
          
        </Col>
      </Row>
      <Row className='loginRow'>
        <Col className='loginCol'>
          {/* Login Button */}
          <Button variant="primary" id='loginBtn' type='submit'>
            LOGIN
          </Button>
        </Col>  
      </Row>
      </div> 
    </form>
  )
}
