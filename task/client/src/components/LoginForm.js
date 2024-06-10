import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//LoginForm function component
export default function LoginForm(
  {//PROPS PASSED FROM PARENT COMPONENT
    handleLogin, 
    handleUserLogin, 
    userData
  }
) {

  //============JSX RENDERING================

  return (
    <form id='loginForm' onSubmit={handleLogin}>
      <Row className='loginRow'>
        <Col xs={6} className='loginCol'>
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
        <Col xs={6} className='loginCol'>
          {/* Email Input */}
          <label className='loginLabel'>
            <p className='labelText'>EMAIL:</p>
            <input
              className='loginInput'
              type='email'
              name='email'
              value={userData.email}
              onChange={handleUserLogin}
              autoComplete='off'
              placeholder='EMAIL'
            />
          </label>
        </Col>
      </Row>
      <Row className='loginRow'>
        <Col xs={6} className='loginCol'>
          {/* Password Input */}
          <label className='loginLabel'>
            <p className='labelText'>PASSWORD:</p>
            <input
              className='loginInput'
              type='password'
              name='password'
              value={userData.password}
              onChange={handleUserLogin}
              autoComplete='current-password'
              placeholder='Password'
            />
          </label>
        </Col>
        <Col xs={6} className='loginCol'>
          {/* Login Button */}
          <Button variant="primary" id='loginBtn' type='submit'>
            LOGIN
          </Button>
        </Col>
      </Row>
    </form>
  )
}
