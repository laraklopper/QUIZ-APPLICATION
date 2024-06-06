import React from 'react';
import MainHeader from '../components/MainHeader'
import PageFooter from '../components/PageFooter'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Login function component
export default function Login({submitLogin, userData, setUserData}) {

  //======EVENT LISTENER===============
  // Event listener for handling user login data changes
  const handleUserLogin = (event) => {
    const { name, value } = event.target;
    // Update userData state with new values
    setUserData((prevState) => (
      { ...prevState, [name]: value }
    ));
  };

  // Event listener to handle user Login
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('logging In');
    submitLogin(e);// Pass the event to the submitLogin function
  }
  //=========JSX RENDERING==============

  return (
    <>
    {/* Header */}
    <MainHeader mainHeading="LOGIN"/>
    <section className='section1'>
        <form id='loginForm' onSubmit={handleSubmit}>
          <Row className='loginRow'>
            <Col xs={6} className='loginCol'>
              <label className='loginLabel'>
              <p className='labelText'>USERNAME:</p>
              <input
              className='loginInput'
              type='text'
              name='username'
              value={userData.username}
              onChange={handleUserLogin}
              autoComplete='off'
              placeholder='Username'
              />
              </label></Col>
            <Col xs={6} className='loginCol'>
              <label className='loginLabel'>
                <p className='labelText'>EMAIL:</p>
                <input
                className='loginInput'
                type='email'
                name='email'
                value={userData.email}
                onChange={handleUserLogin}
                autoComplete='off'
                placeholder='Email'
                />
              </label>
              </Col>
          </Row>
          <Row className='loginRow'>
            <Col xs={6} className='loginCol'>
              <label className='loginLabel'>
                <p className='labelText'>PASSWORD:</p>
                <input
                className='loginInput'
                type='password'
                name='password'
                value={userData.password}
                onChange={handleUserLogin}
                autoComplete='off'
                placeholder='Password'
                />
              </label>
            </Col>
            <Col xs={6} className='loginCol'>
              <Button variant="primary" type='submit' id='loginBtn'>LOGIN</Button>
            </Col>
          </Row>
        </form>
    </section>
    <PageFooter/>
    </>
  )
}
