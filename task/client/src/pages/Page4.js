// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page4.css';//Import the CSS stylesheet for the component
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
//Components
import Header from '../components/Header';// Import the Header component from '../components/Header'
import LogoutBtn from '../components/LogoutBtn';// Import the LogoutBtn component from '../components/LogoutBtn'
import EditUser from '../components/EditUser';// Import the EditUser component from '../components/EditUser'

//Page 4 function component
export default function Page4(//Export default Page4 function component
  {//PROPS PASSED FROM PARENT COMPONENT
    logout, 
    currentUser, 
    setUsers, 
    setLoggedIn, 
    setError, 
    users
   }
  ) {
  //===========STATE VARIABLES===============
  const [editUserData, setEditUserData] = useState({  // State to manage the data for editing user details
    editUsername: '',
    editUserEmail: ''
  });
  const [updateUser, setUpdateUser] = useState(null);  // State to track which user's details are being edited
  const [viewUsers, setViewUsers] = useState(false);  // State to toggle the display of users


  //---------------------------------------

// Function to format a date string into a localized date format
  const dateDisplay = (dateString) => {
      // Options for formatting the date
    const options = {
      day: '2-digit',// Display the month with leading zero if necessary
      month: '2-digit',// Display the month with leading zero if necessary
      year: 'numeric'//Display the full year
    };
      // Convert the date string into a localized date string using the specified options
    return new Date(dateString).toLocaleDateString('en-GB', options);
  }
  //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
  const editUser = async (userId) => {//Define async function to editUser Data
    try {
      const token = localStorage.getItem('token');//Retrieve token from local storage
      //Conditional rendering to check if the token exists
      if (!token) {
        throw new Error('No token available');//Throw an error if the token is not available
      }
      //Send a PUT request to the server to update user details
      const response = await fetch(`http://localhost:3001/users/editAccount/${userId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,// Include the token in the Authorization header
        },
        body: JSON.stringify({
          username: editUserData.editUsername,// New username to update
          email: editUserData.editUserEmail, // New email to update
        })
      });

          // Conditional rendering to check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to update user account');
      }
      const updatedAccount = await response.json();// Parse the response body as JSON

      // Update the users list in the state with the updated user details
      setUsers((prevUsers) =>
        prevUsers.map((user) => user._id === userId ? updatedAccount : user)
      );

      setEditUserData({ editUsername: '', editUserEmail: '' });
      setUpdateUser(null);
      setLoggedIn(true);

      console.log('User account successfully updated');
    } catch (error) {
      console.error(`Error updating user account: ${error.message}`);//Log an error message in the console for debugging purposes
      setError(`Error updating user account: ${error.message}`);//
    }
  };

  //-----------DELETE----------------------
  //Function to remove a user
  const deleteUser = async (userId) => {//Define an async function to remove a user
    try {
      //Send delete request to server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-type': 'application/json',
        },
      });

      // Conditional rendering to check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Failed to remove user');
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
      console.log('User Successfully removed');
    }
    catch (error) {
      setError('Error removing user', error);
      console.error('Error removing user:', error.message);
    }
  };

  //==========EVENT LISTENERS=============
  //Function to handle input change in the update form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Function to toggle the update form
  const updateAccount = (userId) => {
    setUpdateUser(userId === updateUser ? null : userId);
  };

  //Function to toggle userDisplay
  const toggleViewUsers = () => {
    setViewUsers(!viewUsers);
  };
  //=======JSX RENDERING==================

  return (
    <>
    {/* Header */}
      <Header heading='USER ACCOUNT' />
      <section className="page4Section1">
        {currentUser && (
          <div id='currentUserOutput'>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                <label>USERNAME:</label>
                <p className='outputText'>{currentUser.username}</p>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                <label>EMAIL:</label>
                <p className='outputText'>{currentUser.email}</p>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                <label>DATE OF BIRTH:</label>
                <p className='outputText'>{dateDisplay(currentUser.dateOfBirth)}</p>
              </Col>
            </Row>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                <label>ADMIN:</label>
                <p className='outputText'>{currentUser.admin ? 'Yes' : 'No'}</p>
              </Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='userOutputCol'>
                <Button
                  variant="primary"
                  type='button'
                  id='toggleUserEdit'
                  onClick={() => updateAccount(currentUser._id)}>
                  {updateUser === currentUser._id ? 'Exit' : 'Edit'}
                </Button>
              </Col>
            </Row>
            {updateUser === currentUser._id && (
              <div>
                <EditUser
                  editUserData={editUserData}
                  handleInputChange={handleInputChange}
                  editUser={() => editUser(currentUser._id)}
                />
              </div>
            )}
          </div>
        )}
      </section>
      <section className='section2'>
        <div>
          {/* Display all users */}
          {!viewUsers ? (
            <Row>
              <Col>
                <Button
                  variant='primary'
                  type='button'
                  onClick={toggleViewUsers}
                  id='userDisplayBtn'>
                  VIEW USERS
                </Button>
              </Col>
            </Row>
          ):(
          <div>
              {users.map((user) => (
                <div key={user._id} className='user'>
                  <Row>
                    <Col xs={6}>
                      <label>USERNAME:</label>
                      <p className='outputText'>{user.username}</p>
                    </Col>
                    <Col xs={6}>
                      <label>EMAIL:</label>
                      <p className='outputText'>{user.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <label>DATE OF BIRTH:</label>
                      <p className='outputText'>{dateDisplay(user.dateOfBirth)}</p>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant='danger'
                        type='button'
                        onClick={() => deleteUser(user._id)}>
                        REMOVE USER
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Row>
                <Col>
                <Button variant='secondary'
                onClick={toggleViewUsers}
                >
                  HIDE USERS
                </Button>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </section>
        {/*Footer*/}
      <footer className='pageFooter'>
        <Row>
          <Col xs={12} md={8}></Col>
            {/* Logout button */}
          <LogoutBtn logout={logout} />
        </Row>
      </footer>
    </>
  );
}
