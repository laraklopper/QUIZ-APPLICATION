// Import necessary modules and packages
import React, { useState } from 'react';
import '../CSS/Page4.css';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
//Components
import Header from '../components/Header';
import EditUser from '../components/EditUser';
import Footer from '../components/Footer';
import UserViewBtn from '../components/UserViewBtn';

// Page 4 function component
export default function Page4({
  // PROPS PASSED FROM PARENT COMPONENT
  logout, 
  currentUser, 
  setUsers, 
  setLoggedIn, 
  setError, 
  users
}) {
  //===========STATE VARIABLES===============
  const [editUserData, setEditUserData] = useState({
    editUsername: '',
    editUserEmail: ''
  });
  const [updateUser, setUpdateUser] = useState(null);
  const [viewUsers, setViewUsers] = useState(false);

  //---------------------------------------

  // Function to specify the date format
  const dateDisplay = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  }

  //======REQUESTS===============
  //--------PUT---------------
  // Function to edit a user 
  const editUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }
      const response = await fetch(`http://localhost:3001/users/editAccount/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editUserData.editUsername,
          email: editUserData.editUserEmail,
        })
      });
      if (!response.ok) {
        throw new Error('Failed to update user account');
      }
      const updatedAccount = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) => user._id === userId ? updatedAccount : user)
      );

      setEditUserData({ editUsername: '', editUserEmail: '' });
      setUpdateUser(null);
      setLoggedIn(true);

      console.log('User account successfully updated');
    } catch (error) {
      console.error(`Error updating user account: ${error.message}`);
      setError(`Error updating user account: ${error.message}`);
    }
  };

  //-----------DELETE----------------------
  // Function to remove a user
  const deleteUser = async (userId) => {
    try {
      // Send delete request to server
      const response = await fetch(`http://localhost:3001/users/deleteUser/${userId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove user');
      }
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
      console.log('User Successfully removed');
    } catch (error) {
      setError('Error removing user', error);
      console.error('Error removing user:', error.message);
    }
  };

  //==========EVENT LISTENERS=============
  // Function to handle input change in the update form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to toggle the update form
  const updateAccount = (userId) => {
    setUpdateUser(userId === updateUser ? null : userId);
  };

  /* Function to toggle the display of the users list if 
     the current user is an admin user */
  const toggleViewUsers = () => {
    if (currentUser.admin) {
      setViewUsers(!viewUsers);
    } else {
      console.log('Unauthorized');
      alert('Unauthorized');
    }
  };

  //=======JSX RENDERING==================

  return (
    <>
      {/* Header */}
      <Header heading='USER ACCOUNT' />
      <section className="page4Section1">
        {/* Current User output */}
        {currentUser && (
          <div id='currentUserOutput'>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user username */}
                <div className='userOutput'>
                <label>USERNAME:</label>
                <p className='outputText'>{currentUser.username}</p></div>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user email */}
                <div className='userData'>
                <label>EMAIL:</label>
                <p className='outputText'>{currentUser.email}</p>
                </div>
              </Col>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Current user Date of Birth */}
                <div className='userData'>
                  <label>DATE OF BIRTH:</label>
                <p className='outputText'>{dateDisplay(currentUser.dateOfBirth)}</p>
                </div>
                
              </Col>
            </Row>
            <Row className='userOutputRow'>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Output to state if the current user is an admin user */}
                <div className='userData'>
                <label>ADMIN:</label>
                <p className='outputText'>{currentUser.admin ? 'Yes' : 'No'}</p>
                </div>
              </Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='userOutputCol'>
                {/* Button to toggle the update User details */}
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
                {/* EditUser form */}
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
          {/* Display all USERS */}
          <Row>
            <UserViewBtn 
              toggleViewUsers={toggleViewUsers}
              viewingUsers={viewUsers}
            />
          </Row>
          {viewUsers && (
            <div id='usersList'>
              <Row>
                <Col>
                  <h2 className='h2'>USERS</h2>
                </Col>
              </Row>
              {/* User Output */}
              {users.map((user) => (
                <div key={user._id} className='user'>
                  <Row>
                    <Col xs={6} className='userDataCol'>
                      {/* Username output */}
                      <label className='userDataLabel'>USERNAME:</label>
                      <p className='outputText'>{user.username}</p>
                    </Col>
                    <Col xs={6} className='userDataCol'>
                      {/* Email output */}
                      <label>EMAIL:</label>
                      <p className='outputText'>{user.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} className='userDataCol'>
                      {/* Date of Birth output */}
                      <label>DATE OF BIRTH:</label>
                      <p className='outputText'>{dateDisplay(user.dateOfBirth)}</p>
                    </Col>
                    <Col xs={6} className='userDataCol'>
                      {/* Button to delete user */}
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
            </div>
          )}
        </div>
      </section>
      {/* Page Footer */}
      <Footer logout={logout}/>
    </>
  );
}
