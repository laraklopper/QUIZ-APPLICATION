// Import necessary modules and packages
import React  from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//RegistrationForm function component
export default function RegistrationForm(//Export the default RegistrationForm component
    {//PROPS PASSED FROM PARENT COMPONENT
    newUserData, 
    addUser,
    setNewUserData,
    viewPassword,
    setViewPassword
 }
) {
  //============EVENT LISTENERS=================    
    //Function handle user registration
  const handleRegistration = (e) => {
    e.preventDefault();//Prevent default form submission
    console.log('Registering new user');//Log a message in the console for debugging purposes
    addUser(); //Call the addUser function
  }
    
  //Function to handle input change
  const handleInputChange = (event) => {
    // Extract the properties from the event.target
    const { name, value, type, checked } = event.target;
    // Determine the new value based on the input type
    // If the input type is 'checkbox', use `checked`, otherwise use `value`
    const newValue = type === 'checkbox' ? checked : value;
    // Spread the previous state and update the specific field based on `name`
    setNewUserData(prevState => (
      { ...prevState, [name]: newValue }));
  };

//=========JSX RENDERING===========

  return (
    // Registration form
    <form id='registrationForm' onSubmit={handleRegistration}>
          <Row className='regisRow'>
              <Col xs={6} md={4} className='regisCol'>
              {/* New Username Label */}
                  <label className='regisLabel'>
                    <p className='labelText'>USERNAME:</p>
                    {/* Input for new username */}
                    <input
                    className='regisInput'
              type='text'
                    name='newUsername'
                    value={newUserData.newUsername}
              //Call the handleInputChange function when input changes
              onChange={handleInputChange}// Function to handle input changes
                    placeholder='Username'
              autoComplete='off'// Disable autocomplete for security
              required//Mark the input field as required
                    />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
              {/* Label for new email input */}
                  <label className='regisLabel'>
                      <p className='labelText'>EMAIL:</p>
                    {/* New Email Input */}
                      <input
                          className='regisInput'
                          type='email'
                          name='newEmail'
                          value={newUserData.newEmail}
                         //Call the handleInputChange function when input changes
                           onChange={handleInputChange}// Function to handle input changes
                          placeholder='Enter Email'
                           autoComplete='off'// Disable autocomplete for security
                            required//Mark the input field as required
                           />
                  </label>
              </Col>
              <Col xs={6} md={4} className='regisCol'>
              {/* Label for new date of birth input */}
                  <label className='regisLabel'>
                      <p className='labelText'>DATE OF BIRTH:</p>
            {/* New Date of Birth Input */}
                      <input
                            className='regisInput' 
                            type='date'
                            name='newDateOfBirth'
                            value={newUserData.newDateOfBirth}
                          //Call the handleInputChange function when input changes
                            onChange={handleInputChange}// Function to handle input changes
                            placeholder='dd/mm/yyyy'
                            autoComplete='off'// Disable autocomplete for security
                            required//Mark the input field as required
                          />
                  </label>
              </Col>
          </Row>
          <Row className='regisRow'>
             <Col xs={6} md={4} className='regisCol'>
                  {/* New Password Input */}
                  <label className='regisLabel'>
                      <p className='labelText'>PASSWORD:</p>
                      <input
                          className='regisInput' 
                          type={viewPassword ? 'text' : 'password'}// Toggle input type
                            name='newPassword'
                            value={newUserData.newPassword}
                          //Call the handleInputChange function when input changes
                          onChange={handleInputChange}// Function to handle input changes
                          placeholder='Password'
                          autoComplete='current-password'
                          required//Mark the input field as required
                          />
                  </label>
              </Col>
              <Col xs={6} md={4}className='regisCol' id='showPasswordCol'>
                {/* Button to display new password */}
                  <Button 
                  variant='success' 
                  type='button' 
                  id='newPasswordDisplayBtn' 
                  onClick={() => setViewPassword(!viewPassword)}// Toggle viewPassword state
                  >
                   {/* Button text based on viewPassword state*/}
                    {viewPassword ? 'HIDE PASSWORD': 'SHOW PASSWORD'}
                  </Button>
              </Col>
               <Col xs={6} md={4} className='regisCol'>
                  {/* Admin Input */}
                  <label id='regisLabelCheckBox'>
                      <p className='labelText'>REGISTER AS ADMIN:</p>
                      <input
                          id="adminCheckBox"
                          type='checkbox'
                          checked={newUserData.newAdmin}
                          onChange={handleInputChange}//Call the handleInputChange function when input changes
                          name='newAdmin'
                      />
                  </label>
              </Col>    
          </Row>
      <Row> 
        <Col xs={12} md={8}>
        </Col>
        <Col xs={6} md={4}>
          {/* Registration Button */}
          <Button
            variant="primary"
            // Trigger form submission
            type='submit'//Specify the button type
            id='registrationBtn'
          >
            REGISTER
          </Button>
        </Col>
      </Row>
    </form>
  )
}
