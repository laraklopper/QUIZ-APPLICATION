import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import MainHeader from '../components/MainHeader'
import PageFooter from '../components/PageFooter';

export default function Registration({addUser, newUserData, setNewUserData}) {

  //========EVENT LISTENERS==============

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewUserData(prevState => ({ ...prevState, [name]: newValue }));
  };

  const handleRegistration = () => {
    console.log('registering new user');
    addUser()
    
  }

  //===========JSX RENDERING=================
  return (
    <>
    <MainHeader mainHeading="REGISTRATION"/>
    <section className='section1'>
      <Row>
        <Col>
        <h3 className='h3'>ENTER REGISTRATION DETAILS</h3>
        </Col>
      </Row>
      {/* Registration Form */}
      <form id='registrationForm' onSubmit={handleRegistration}>
        <Row className='regisRow'>
          <Col xs={6} md={4} className='regisCol'>
            {/* Username input */}
           <label className='regisLabel'>
            <p className='labelText'>USERNAME:</p>
            <input
            className='regisInput'
            type='text'
            name='newUsername'
            value={newUserData.newUsername}
onChange={(e) => setNewUserData(
                  {...newUserData, newUsername: e.target.value})}
            onChange={handleInputChange}
            placeholder='USERNAME'
            autoComplete='off'
            required
            />
           </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            {/* Email Input */}
            <label className='regisLabel'>
              <p className='labelText'>EMAIL:</p>
              <input
                className="regisInput"
                type='email'
                name='newEmail'
                value={newUserData.newEmail}
                onChange={(e) => setNewUserData(
                  {...newUserData, newEmail: e.target.value})}
                // onChange={handleInputChange}
                placeholder='ENTER EMAIL'
                autoComplete="off"
                required
              />
            </label>
          </Col>
          {/* Date of Birth Input */}
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>DATE OF BIRTH:</p>
              <input
                className='regisInput'
                type='date'
                name='newDateOfBirth'
                value={newUserData.newDateOfBirth}
onChange={(e) => setNewUserData(
                  {...newUserData, newDateOfBirth: e.target.value})}
                autoComplete='off'
                placeholder="dd/mm/yyyy"
                onChange={handleInputChange}
              />
            </label>
          </Col>
        </Row>
        <Row className='regisRow'>
          <Col xs={6} md={4} className='regisCol'>
            <label className='regisLabel'>
              <p className='labelText'>PASSWORD:</p>
              <input
                className='regisInput'
                type='password'
                 name='newPassword'
                 value={newUserData.newPassword}
                onChange={(e) => setNewUserData(
                  {...newUserData, newPassword: e.target.value})}
                 // onChange={handleInputChange}
                 placeholder='Password'   
                 autoComplete='currentpassword'              
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            {/* Admin Input */}
              <label id='regisLabelCheckBox'>
              <p className='labelText'>REGISTER AS ADMIN:</p>
              <input 
                type="checkbox"
                checked={newUserData.newAdmin}
                onChange={(e) => setNewUserData(
                  {...newUserData, newPassword: e.target.value})}
                // onChange={handleInputChange}
                name="newAdmin"
                id="adminCheckbox"
              />
            </label>
          </Col>
          <Col xs={6} md={4} className='regisCol'>
            <Button type='text' variant="primary" id='registrationBtn'>REGISTER</Button>
          </Col>
        </Row>
        </form>
    </section>
    <PageFooter/>
    </>
  )
}
