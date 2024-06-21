import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Header from '../components/Header';
import LogoutBtn from '../components/LogoutBtn';
import EditUser from '../components/EditUser';

//Page 4 function component
export default function Page4({ logout, currentUser, setUsers, setLoggedIn, setError }) {
  const [editUserData, setEditUserData] = useState({
    editUsername: '',
    editUserEmail: ''
  });
  const [updateUser, setUpdateUser] = useState(null);

   //======REQUESTS===============
  //--------PUT---------------
  //Function to edit a user 
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

  /*const deleteUser = async (userId) => {
    try {
      //Send delete request to server
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',//Request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-type': 'application/json',
        },
      });

      //Conditional rendering to check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to remove user');//Throw an error message if the request is unsuccessful
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
  };*/
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateAccount = (userId) => {
    setUpdateUser(userId === updateUser ? null : userId);
  };

  return (
    <>
      <Header heading='USER ACCOUNT' />
      <section className="section1">
        {currentUser && (
          <div>
            <Row>
              <Col xs={6} md={4}>
                <label>USERNAME:</label>
                <p className='outputText'>{currentUser.username}</p>
              </Col>
              <Col xs={6} md={4}>
                <label>EMAIL:</label>
                <p className='outputText'>{currentUser.email}</p>
              </Col>
              <Col xs={6} md={4}>
                <label>DATE OF BIRTH:</label>
                <p className='outputText'>{currentUser.dateOfBirth}</p>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <label>ADMIN:</label>
                <p className='outputText'>{currentUser.admin ? 'Yes' : 'No'}</p>
              </Col>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4}>
                <Button 
                  variant="primary" 
                  type='button' 
                  id='toggleUserEdit' 
                  onClick={() => updateAccount(currentUser._id)}>
                    {updateUser === currentUser._id ? 'Cancel' : 'Edit'}
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
      <footer>
        <Row>
          <Col xs={12} md={8}></Col>
          <LogoutBtn logout={logout} />
        </Row>
      </footer>
    </>
  );
}
